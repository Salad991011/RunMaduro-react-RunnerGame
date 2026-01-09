import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useGame } from "../store";
import { AudioBus } from "../audio/audio";
import { LANES } from "../constants";

// ---------------------------------------------
// COINS
// ---------------------------------------------
export type CoinRecord = { id: string; x: number; y: number; z: number };

const coins = new Map<string, CoinRecord>();

// IMPORTANT (future economy):
// "collected" is the per-run ledger of collected coin IDs.
// We intentionally DO NOT delete from this set on coin unmount.
// Later, we can transfer this ledger into a persistent "bank" currency.
const collected = new Set<string>();

export const CoinWorld = {
  upsert(c: CoinRecord) {
    // Do not re-add collected coins back into the active collision map.
    if (collected.has(c.id)) return;
    coins.set(c.id, c);
  },

  remove(id: string) {
    // NOTE: we remove from active coin map ONLY.
    // We DO NOT touch "collected" here, so the run-ledger remains intact.
    // (This avoids losing collection history when coins unmount/despawn.)
    coins.delete(id);
  },

  isCollected(id: string) {
    return collected.has(id);
  },

  collect(id: string) {
    collected.add(id);
    coins.delete(id);
  },

  /** Clears active + collected ledger (use at the start of a new run). */
  reset() {
    coins.clear();
    collected.clear();
  },

  /** (Future) Clears only active coin map, keeps collected ledger. */
  clearActive() {
    coins.clear();
  },
};

// ---------------------------------------------
// COIN LEDGER HELPERS (placeholders for upgrades/economy)
// ---------------------------------------------

/** Snapshot of how many coins were collected in the CURRENT run. */
export function getCollectedCoinCount() {
  return collected.size;
}

/** Snapshot of collected coin IDs in the CURRENT run. */
export function getCollectedCoinIds(): string[] {
  return Array.from(collected);
}

/**
 * (Future) Drain the run-ledger: returns collected IDs and clears them.
 * Useful when you want to transfer run rewards into a persistent bank.
 */
export function drainCollectedCoinIds(): string[] {
  const ids = Array.from(collected);
  collected.clear();
  return ids;
}

// ---------------------------------------------
// OBSTACLES
// ---------------------------------------------
export type ObstacleRecord = {
  id: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

const obstacles = new Map<string, ObstacleRecord>();

export const ObstacleWorld = {
  upsert(o: ObstacleRecord) {
    obstacles.set(o.id, o);
  },

  remove(id: string) {
    obstacles.delete(id);
  },

  reset() {
    obstacles.clear();
  },
};

// ---------------------------------------------
// RESTART / RESET HELPERS
// ---------------------------------------------
// We keep these module-level so restart can fully reset collision bookkeeping.
let _lastCollectT = 0;
let _lastHitT = 0;

/** Reset only the internal cooldown timers (optional helper). */
export function resetCollisionTimers() {
  _lastCollectT = 0;
  _lastHitT = 0;
}

/**
 * Reset coin + obstacle worlds + internal timers (call this on Restart).
 * This starts a NEW run with a clean slate (active coins + collected ledger).
 */
export function resetCollisionWorlds() {
  CoinWorld.reset();
  ObstacleWorld.reset();
  resetCollisionTimers();
}

const clampLaneIndex = (i: number) => Math.max(0, Math.min(LANES.length - 1, i));

export function useCollisions() {
  const phase = useGame((s) => s.phase);
  const laneIndex = useGame((s) => s.laneIndex);

  // store y is "jump height"
  const y = useGame((s) => s.y);

  // forward distance
  const z = useGame((s) => s.z);

  const isRolling = useGame((s) => s.isRolling);

  const addCoin = useGame((s) => s.addCoin);
  const setPhase = useGame((s) => s.setPhase);

  // local refs, but we also maintain module-level for external restart reset.
  const lastCollectT = useRef(0);
  const lastHitT = useRef(0);

  useFrame((state) => {
    if (phase !== "running") return;

    const now = state.clock.getElapsedTime();

    // keep module timers in sync (so resetCollisionWorlds() works reliably)
    if (lastCollectT.current !== _lastCollectT) lastCollectT.current = _lastCollectT;
    if (lastHitT.current !== _lastHitT) lastHitT.current = _lastHitT;

    // Player world position must match Player.tsx visual offset
    const px = LANES[clampLaneIndex(laneIndex)];
    const baseY = isRolling ? 0.1 : 0.9; // MUST match Player.tsx
    const py = y + baseY;
    const pz = z;

    // ---------------------------------------------
    // OBSTACLE HIT (end run)
    // ---------------------------------------------
    if (now - lastHitT.current > 0.05) {
      // cleanup obstacles far behind player
      for (const [id, o] of obstacles) {
        if (o.z < z - 14) obstacles.delete(id);
      }

      // player as a sphere-ish collider
      const pr = isRolling ? 0.38 : 0.45;

      for (const [, o] of obstacles) {
        // AABB vs sphere test (fast + stable)
        const hx = o.w * 0.5;
        const hy = o.h * 0.5;
        const hz = o.d * 0.5;

        const dx = Math.max(Math.abs(px - o.x) - hx, 0);
        const dy = Math.max(Math.abs(py - o.y) - hy, 0);
        const dz = Math.max(Math.abs(pz - o.z) - hz, 0);

        const dist2 = dx * dx + dy * dy + dz * dz;

        if (dist2 <= pr * pr) {
          lastHitT.current = now;
          _lastHitT = now;

          setPhase("gameover");
          // Optional later:
          // AudioBus.play("hit");
          return;
        }
      }
    }

    // ---------------------------------------------
    // COINS (collect)
    // ---------------------------------------------
    if (now - lastCollectT.current < 0.02) return;

    // cleanup coins far behind player (active map only)
    for (const [id, c] of coins) {
      if (c.z < z - 12) coins.delete(id);
    }

    const r = 0.85;
    const r2 = r * r;

    for (const [id, c] of coins) {
      const dx = c.x - px;
      const dy = c.y - py;
      const dz = c.z - pz;
      const dist2 = dx * dx + dy * dy + dz * dz;

      if (dist2 <= r2) {
        CoinWorld.collect(id);
        addCoin();
        AudioBus.play("coin");

        lastCollectT.current = now;
        _lastCollectT = now;

        break;
      }
    }
  });
}

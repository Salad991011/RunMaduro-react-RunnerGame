import { create } from "zustand";
import { resetCollisionWorlds } from "./systems/useCollisions";

export type GamePhase = "menu" | "running" | "paused" | "gameover";

type GameState = {
  phase: GamePhase;
  score: number;

  // coins collected during the CURRENT run
  coins: number;

  // persistent currency (future upgrades/skins/consumables)
  bankCoins: number;

  speed: number;

  // player
  laneIndex: number; // 0..2
  y: number;
  vy: number;
  isRolling: boolean;
  rollT: number;

  // world
  z: number; // forward distance

  // actions
  start: () => void;
  restart: () => void;

  setPhase: (p: GamePhase) => void;

  addScore: (d: number) => void;
  addCoin: () => void;

  // economy placeholders
  addBankCoins: (n: number) => void;
  spendBankCoins: (n: number) => boolean;
  commitRunCoinsToBank: () => void;

  setSpeed: (v: number) => void;
  setLaneIndex: (i: number) => void;
  setPlayerY: (y: number) => void;
  setPlayerVy: (vy: number) => void;
  setRolling: (on: boolean, rollT?: number) => void;
  setZ: (z: number) => void;
};

const initialRun = {
  phase: "menu" as const,
  score: 0,
  coins: 0,
  speed: 10,
  laneIndex: 1,
  y: 0,
  vy: 0,
  isRolling: false,
  rollT: 0,
  z: 0,
};

export const useGame = create<GameState>((set, get) => ({
  ...initialRun,

  // Persistent currency (kept across restarts)
  bankCoins: 0,

  start: () => {
    resetCollisionWorlds();
    set({ phase: "running" });
  },

  restart: () => {
    // For testing: restart clears the current run state + collision worlds,
    // but does NOT wipe bankCoins (persistent currency).
    resetCollisionWorlds();
    const bankCoins = get().bankCoins;
    set({ ...initialRun, bankCoins, phase: "running" });
  },

  setPhase: (p) => set({ phase: p }),

  addScore: (d) => set((s) => ({ score: s.score + d })),

  addCoin: () => set((s) => ({ coins: s.coins + 1 })),

  // -------------------------
  // Economy placeholders
  // -------------------------
  addBankCoins: (n) =>
    set((s) => ({
      bankCoins: s.bankCoins + Math.max(0, Math.floor(n)),
    })),

  spendBankCoins: (n) => {
    const cost = Math.max(0, Math.floor(n));
    const { bankCoins } = get();
    if (bankCoins < cost) return false;
    set({ bankCoins: bankCoins - cost });
    return true;
  },

  commitRunCoinsToBank: () => {
    // Move current run coins into persistent bank (use on gameover later)
    const { coins, bankCoins } = get();
    if (coins <= 0) return;
    set({ bankCoins: bankCoins + coins, coins: 0 });
  },

  setSpeed: (v) => set({ speed: v }),
  setLaneIndex: (i) => set({ laneIndex: i }),
  setPlayerY: (y) => set({ y }),
  setPlayerVy: (vy) => set({ vy }),
  setRolling: (on, rollT = 0) => set({ isRolling: on, rollT }),
  setZ: (z) => set({ z }),
}));

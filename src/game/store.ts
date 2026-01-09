import { create } from "zustand";
import { resetCollisionWorlds } from "./systems/useCollisions";

export type GamePhase = "menu" | "running" | "paused" | "gameover";

type GameState = {
  phase: GamePhase;
  score: number;
  coins: number;
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
  setSpeed: (v: number) => void;
  setLaneIndex: (i: number) => void;
  setPlayerY: (y: number) => void;
  setPlayerVy: (vy: number) => void;
  setRolling: (on: boolean, rollT?: number) => void;
  setZ: (z: number) => void;
};

const initial = {
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

export const useGame = create<GameState>((set) => ({
  ...initial,

  start: () => {
    // Start should always begin from a clean collision world
    resetCollisionWorlds();
    set({ phase: "running" });
  },

  restart: () => {
    // Restart should clear coins/obstacles + timers, then reset all game state
    resetCollisionWorlds();
    set({ ...initial, phase: "running" });
  },

  setPhase: (p) => set({ phase: p }),
  addScore: (d) => set((s) => ({ score: s.score + d })),
  addCoin: () => set((s) => ({ coins: s.coins + 1 })),
  setSpeed: (v) => set({ speed: v }),
  setLaneIndex: (i) => set({ laneIndex: i }),
  setPlayerY: (y) => set({ y }),
  setPlayerVy: (vy) => set({ vy }),
  setRolling: (on, rollT = 0) => set({ isRolling: on, rollT }),
  setZ: (z) => set({ z }),
}));

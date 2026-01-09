import { useEffect } from "react";
import { useGame } from "../store";
import { LANE_COUNT, WORLD } from "../constants";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function useInput() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const s = useGame.getState();

      // Pause toggle
      if (e.key.toLowerCase() === "p") {
        s.setPhase(s.phase === "running" ? "paused" : s.phase === "paused" ? "running" : s.phase);
        return;
      }

      // Start from menu
      if (s.phase === "menu" && (e.key === "Enter" || e.key === " ")) {
        s.setPhase("running");
        return;
      }

      if (s.phase !== "running") return;

      // ✅ FIX INVERTED CONTROLS:
      // A / ArrowLeft should move to the LEFT lane visually,
      // but your current behavior is inverted, so we flip the index direction.

      // A / ArrowLeft => go RIGHT in index space (fixes inversion)
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        s.setLaneIndex(clamp(s.laneIndex + 1, 0, LANE_COUNT - 1));
        return;
      }

      // D / ArrowRight => go LEFT in index space (fixes inversion)
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        s.setLaneIndex(clamp(s.laneIndex - 1, 0, LANE_COUNT - 1));
        return;
      }

      // Jump
      if (e.key === "ArrowUp" || e.key === " " || e.key.toLowerCase() === "w") {
        if (s.y <= 0.0001 && Math.abs(s.vy) < 0.01) {
          s.setPlayerVy(WORLD.jumpVelocity);
        }
        return;
      }

      // Roll / slide
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        s.setRolling(true, 0);
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

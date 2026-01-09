import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { WORLD } from "../constants";
import { useGame } from "../store";

export function useGameLoop() {
  const lastT = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(0.033, t - (lastT.current || t));
    lastT.current = t;

    const s = useGame.getState();
    if (s.phase !== "running") return;

    // difficulty ramp
    const nextSpeed = Math.min(WORLD.maxSpeed, s.speed + WORLD.speedRampPerSec * dt);

    // forward motion
    const nextZ = s.z + nextSpeed * dt;

    // score by distance
    const nextScore = s.score + nextSpeed * dt;

    // jump/gravity
    let nextVy = s.vy + WORLD.gravity * dt;
    let nextY = s.y + nextVy * dt;
    if (nextY < 0) {
      nextY = 0;
      nextVy = 0;
    }

    // roll timer
    let nextIsRolling = s.isRolling;
    let nextRollT = s.rollT;
    if (nextIsRolling) {
      nextRollT = nextRollT + dt;
      if (nextRollT >= WORLD.rollDuration) {
        nextIsRolling = false;
        nextRollT = 0;
      }
    }

    // Single state update (less rerenders, no stale values)
    useGame.setState({
      speed: nextSpeed,
      z: nextZ,
      score: nextScore,
      y: nextY,
      vy: nextVy,
      isRolling: nextIsRolling,
      rollT: nextRollT,
    });
  });
}

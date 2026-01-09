import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { LANES, WORLD } from "../constants";
import { useGame } from "../store";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Player() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    const g = ref.current;

    const s = useGame.getState();
    const laneIndex = Math.max(0, Math.min(LANES.length - 1, s.laneIndex));
    const targetX = LANES[laneIndex];

    const snap = 1 - Math.exp(-WORLD.laneSnap * dt);

    g.position.x = lerp(g.position.x, targetX, snap);
    g.position.y = s.y + (s.isRolling ? 0.1 : 0.9);
    g.position.z = s.z;
  });

  return (
    <group ref={ref}>
      {/* Placeholder player model */}
      <mesh userData={{ type: "player" }} name="player">
        {/* Keep geometry stable; we can animate scale instead if needed */}
        <capsuleGeometry args={[0.45, 0.9, 6, 12]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

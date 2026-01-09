import { useEffect, useMemo } from "react";
import { ObstacleWorld } from "../systems/useCollisions";

export type ObstacleProps = {
  id: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export function Obstacle({ id, x, y, z, w, h, d }: ObstacleProps) {
  const userData = useMemo(() => ({ type: "obstacle", id }), [id]);

  useEffect(() => {
    // Register (or refresh) obstacle in the collision world.
    ObstacleWorld.upsert({ id, x, y, z, w, h, d });

    // Cleanup on unmount / id change
    return () => {
      ObstacleWorld.remove(id);
    };
  }, [id, x, y, z, w, h, d]);

  return (
    <mesh position={[x, y, z]} userData={userData} name={`obstacle_${id}`}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial />
    </mesh>
  );
}

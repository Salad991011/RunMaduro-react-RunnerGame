import { useEffect, useMemo } from "react";
import { CoinWorld } from "../systems/useCollisions";

export function Coin({ id, x, y, z }: { id: string; x: number; y: number; z: number }) {
  // stable metadata for debugging & future collision styles
  const userData = useMemo(() => ({ type: "coin", id }), [id]);

  useEffect(() => {
    // Register (or refresh) coin in the collision world.
    CoinWorld.upsert({ id, x, y, z });

    return () => {
      // IMPORTANT for future economy:
      // If the coin was collected, keep its id in the collected ledger
      // for the rest of the run (so we can later compute rewards / upgrades / analytics).
      if (!CoinWorld.isCollected(id)) {
        CoinWorld.remove(id);
      }
    };
  }, [id, x, y, z]);

  // Hide coin visually once collected
  if (CoinWorld.isCollected(id)) return null;

  return (
    <mesh position={[x, y, z]} userData={userData} name={`coin_${id}`}>
      <torusGeometry args={[0.32, 0.12, 10, 18]} />
      <meshStandardMaterial />
    </mesh>
  );
}

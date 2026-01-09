import { Chunk } from "./Chunk";
import { useChunkSpawner } from "../systems/useChunkSpawner";

export function Chunks() {
  const chunks = useChunkSpawner();

  return (
    <group>
      {chunks.map((c) => (
        <Chunk key={c.id} z0={c.z0} seed={c.seed} />
      ))}
    </group>
  );
}

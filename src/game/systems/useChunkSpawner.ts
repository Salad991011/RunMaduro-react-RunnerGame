import { useMemo } from "react";
import { WORLD } from "../constants";
import { useGame } from "../store";

export type ChunkData = {
  id: string;
  z0: number;
  seed: number;
};

export function useChunkSpawner() {
  const z = useGame((s) => s.z);
  const phase = useGame((s) => s.phase); // 👈 important for restart consistency

  const chunks = useMemo(() => {
    // During menu / gameover, we don't need chunks
    if (phase !== "running") return [];

    const len = WORLD.chunkLength;

    const start = Math.floor((z - WORLD.despawnBehind) / len) * len;
    const end = z + WORLD.spawnAhead;

    const out: ChunkData[] = [];
    for (let cz = start; cz <= end; cz += len) {
      const idx = Math.floor(cz / len);

      out.push({
        id: `chunk_${idx}`, // stable, deterministic
        z0: cz,
        seed: (idx * 9301 + 49297) % 233280,
      });
    }

    return out;
  }, [z, phase]);

  return chunks;
}

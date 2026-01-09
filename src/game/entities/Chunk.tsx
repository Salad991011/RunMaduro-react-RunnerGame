import { LANES, WORLD } from "../constants";
import { Coin } from "./Coin";
import { Obstacle } from "./Obstacle";

function laneX(laneIdx: number) {
  return LANES[Math.max(0, Math.min(LANES.length - 1, laneIdx))];
}

function coinPattern(seed: number) {
  const a = seed % 3;
  const b = ((seed / 3) | 0) % 3;
  const c = ((seed / 9) | 0) % 3;
  return [a, b, c];
}

export function Chunk({ z0, seed }: { z0: number; seed: number }) {
  const len = WORLD.chunkLength;
  const lanes = coinPattern(seed);

  // Deterministic chunk index (stable across restarts)
  const chunkIndex = Math.floor(z0 / len);

  return (
    <group name={`chunk_${chunkIndex}`} userData={{ type: "chunk", chunkIndex }}>
      {/* Ground */}
      <mesh
        position={[0, -0.02, z0 + len / 2]}
        userData={{ type: "ground", chunkIndex }}
        name={`ground_${chunkIndex}`}
      >
        <boxGeometry args={[10, 0.04, len]} />
        <meshStandardMaterial />
      </mesh>

      {/* Lane lines */}
      {LANES.map((x, li) => (
        <mesh
          key={`${chunkIndex}_${li}`}
          position={[x, 0.001, z0 + len / 2]}
          userData={{ type: "laneLine", chunkIndex, lane: li }}
          name={`laneLine_${chunkIndex}_${li}`}
        >
          <boxGeometry args={[0.08, 0.002, len]} />
          <meshStandardMaterial />
        </mesh>
      ))}

      {/* Coins */}
      {Array.from({ length: 10 }).map((_, i) => {
        const lane = lanes[i % lanes.length];
        const x = laneX(lane);
        const z = z0 + 4 + i * 2.4;

        // Stable IDs (important for CoinWorld + collected-set consistency)
        const id = `coin_${chunkIndex}_${i}`;

        // IMPORTANT: y=0.9 must match collision baseY when running (Player offset)
        return <Coin key={id} id={id} x={x} y={0.9} z={z} />;
      })}

      {/* Obstacle every other chunk */}
      {seed % 2 === 0 ? (
        <Obstacle
          id={`ob_${chunkIndex}`}
          x={laneX(lanes[0])}
          y={0.65}
          z={z0 + len * 0.72}
          w={0.9}
          h={1.3}
          d={0.9}
        />
      ) : null}
    </group>
  );
}

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useInput } from "./input/useInput";
import { useGameLoop } from "./systems/useGameLoop";
import { Chunks } from "./entities/Chunks";
import { Player } from "./entities/Player";
import { useCollisions } from "./systems/useCollisions";
import { useGame } from "./store";
import { AudioBus } from "./audio/audio";

function Scene() {
  useInput();
  useGameLoop();
  useCollisions();

  // Camera follow (behind player)
  const camTarget = useRef(new THREE.Vector3());

  useFrame(({ camera }, dt) => {
    const z = useGame.getState().z;

    camTarget.current.set(0, 3.2, z - 8);
    camera.position.lerp(camTarget.current, 1 - Math.exp(-6 * dt));
    camera.lookAt(0, 1.5, z + 8);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 2]} intensity={0.9} />

      <Chunks />
      <Player />

      {/* A little fog helps sell speed */}
      <fog attach="fog" args={["#000", 10, 80]} />
    </>
  );
}

export default function GameRoot() {
  const phase = useGame((s) => s.phase);

  useEffect(() => {
    // Start music once user starts (browser autoplay rules)
    if (phase === "running") AudioBus.musicOn();
    else AudioBus.musicOff();
  }, [phase]);

  return (
    <Canvas
      camera={{ fov: 60, position: [0, 3.2, -8], near: 0.1, far: 500 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

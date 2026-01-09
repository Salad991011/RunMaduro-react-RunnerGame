export const LANES = [-2.2, 0, 2.2] as const;
export const LANE_COUNT = LANES.length;

export const WORLD = {
  gravity: -26,
  jumpVelocity: 10.5,
  rollDuration: 0.65,
  laneSnap: 18, // higher = snappier lateral movement
  baseSpeed: 10,
  maxSpeed: 28,
  speedRampPerSec: 0.18,
  spawnAhead: 120,
  despawnBehind: 40,
  chunkLength: 30,
} as const;

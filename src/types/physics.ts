export interface Vector2D {
  x: number;
  y: number;
}

export interface GasParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
}

export interface BrownianParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  initialX: number;
  initialY: number;
  trail: Vector2D[];
}

export interface CollisionRipple {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

export interface SimulationParameters {
  temperature: number; // 0 to 100 Celsius
  particleCount: number; // 10 to 300
  particleSize: number; // 2 to 10 px
  brownianMass: number; // 0.5 to 10
  simulationSpeed: number; // 0.25 to 3
  trailLength: number; // 0 to 30
  showTrails: boolean;
  showVelocityVectors: boolean;
  showCollisions: boolean;
}

export interface SimulationStatistics {
  simulationTime: number;
  averageParticleSpeed: number;
  brownianParticleSpeed: number;
  collisionCount: number;
  meanSquaredDisplacement: number;
  diffusionCoefficient: number;
  theoreticalMsd: number;
}

export interface MsdPoint {
  time: number;
  measuredMsd: number;
  theoreticalMsd: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  tag: string;
  params: SimulationParameters;
}

import {
  BrownianParticle,
  CollisionRipple,
  GasParticle,
  MsdPoint,
  SimulationParameters,
  SimulationStatistics,
} from '../types/physics';

export class WebPhysicsEngine {
  public width = 600;
  public height = 600;

  public parameters: SimulationParameters;
  public brownian: BrownianParticle;
  public gasParticles: GasParticle[] = [];
  public collisionRipples: CollisionRipple[] = [];

  public totalCollisions = 0;
  public simulationTime = 0;
  public msdHistory: MsdPoint[] = [];

  private lastMsdSampleTime = 0;

  constructor(initialParams: SimulationParameters) {
    this.parameters = { ...initialParams };
    this.brownian = {
      x: 300,
      y: 300,
      vx: 0,
      vy: 0,
      radius: 22,
      mass: initialParams.brownianMass,
      initialX: 300,
      initialY: 300,
      trail: [],
    };
    this.initGasParticles();
  }

  public setDimensions(w: number, h: number) {
    if (w <= 0 || h <= 0) return;
    const oldW = this.width;
    const oldH = this.height;
    this.width = w;
    this.height = h;

    if (oldW > 0 && oldH > 0) {
      this.brownian.x = Math.max(
        this.brownian.radius + 10,
        Math.min(w - this.brownian.radius - 10, (this.brownian.x / oldW) * w)
      );
      this.brownian.y = Math.max(
        this.brownian.radius + 10,
        Math.min(h - this.brownian.radius - 10, (this.brownian.y / oldH) * h)
      );
    }
  }

  public reset(params?: SimulationParameters) {
    if (params) {
      this.parameters = { ...params };
    }
    this.brownian.mass = this.parameters.brownianMass;
    this.brownian.radius = 20 + (this.parameters.brownianMass - 0.5) * 1.5;
    this.brownian.x = this.width / 2;
    this.brownian.y = this.height / 2;
    this.brownian.initialX = this.width / 2;
    this.brownian.initialY = this.height / 2;
    this.brownian.vx = 0;
    this.brownian.vy = 0;
    this.brownian.trail = [{ x: this.brownian.x, y: this.brownian.y }];

    this.totalCollisions = 0;
    this.simulationTime = 0;
    this.lastMsdSampleTime = 0;
    this.msdHistory = [];
    this.collisionRipples = [];

    this.initGasParticles();
  }

  public resetStatisticsOnly() {
    this.totalCollisions = 0;
    this.simulationTime = 0;
    this.lastMsdSampleTime = 0;
    this.msdHistory = [];
    this.collisionRipples = [];
    this.brownian.initialX = this.brownian.x;
    this.brownian.initialY = this.brownian.y;
    this.brownian.trail = [{ x: this.brownian.x, y: this.brownian.y }];
  }

  public updateParameters(newParams: SimulationParameters) {
    const oldParams = this.parameters;
    this.parameters = { ...newParams };

    this.brownian.mass = newParams.brownianMass;
    this.brownian.radius = 20 + (newParams.brownianMass - 0.5) * 1.5;

    if (newParams.particleCount !== oldParams.particleCount) {
      this.adjustParticleCount(newParams.particleCount);
    }

    if (newParams.temperature !== oldParams.temperature) {
      this.rescaleThermalVelocities(newParams.temperature);
    }

    if (newParams.particleSize !== oldParams.particleSize) {
      for (const p of this.gasParticles) {
        p.radius = newParams.particleSize;
      }
    }
  }

  private initGasParticles() {
    this.gasParticles = [];
    const count = this.parameters.particleCount;
    const tempKelvin = this.parameters.temperature + 273.15;
    const baseSpeed = Math.sqrt(tempKelvin * 0.75) * 4.2;

    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      let attempts = 0;
      do {
        x = Math.random() * (this.width - 40) + 20;
        y = Math.random() * (this.height - 40) + 20;
        attempts++;
      } while (
        attempts < 20 &&
        Math.hypot(x - this.brownian.x, y - this.brownian.y) <
          this.brownian.radius + this.parameters.particleSize + 15
      );

      // Box-Muller 2D Maxwell-Boltzmann distribution
      const u1 = Math.max(0.0001, Math.random());
      const u2 = Math.random();
      const speed = baseSpeed * Math.sqrt(-2.0 * Math.log(u1));
      const angle = u2 * 2 * Math.PI;

      this.gasParticles.push({
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: this.parameters.particleSize,
        mass: 0.12,
      });
    }
  }

  private adjustParticleCount(target: number) {
    const tempKelvin = this.parameters.temperature + 273.15;
    const baseSpeed = Math.sqrt(tempKelvin * 0.75) * 4.2;

    if (target > this.gasParticles.length) {
      const diff = target - this.gasParticles.length;
      for (let i = 0; i < diff; i++) {
        const x = Math.random() * (this.width - 40) + 20;
        const y = Math.random() * (this.height - 40) + 20;
        const angle = Math.random() * 2 * Math.PI;
        this.gasParticles.push({
          id: this.gasParticles.length + i,
          x,
          y,
          vx: Math.cos(angle) * baseSpeed,
          vy: Math.sin(angle) * baseSpeed,
          radius: this.parameters.particleSize,
          mass: 0.12,
        });
      }
    } else if (target < this.gasParticles.length) {
      this.gasParticles.splice(target);
    }
  }

  private rescaleThermalVelocities(tempC: number) {
    const tempKelvin = tempC + 273.15;
    const targetRms = Math.sqrt(tempKelvin * 0.75) * 4.2;

    for (const p of this.gasParticles) {
      const curSpeed = Math.hypot(p.vx, p.vy);
      if (curSpeed > 0.001) {
        const ratio = targetRms / curSpeed;
        p.vx *= 0.8 + 0.2 * ratio;
        p.vy *= 0.8 + 0.2 * ratio;
      } else {
        const angle = Math.random() * 2 * Math.PI;
        p.vx = Math.cos(angle) * targetRms;
        p.vy = Math.sin(angle) * targetRms;
      }
    }
  }

  public dragBrownian(x: number, y: number) {
    const r = this.brownian.radius;
    this.brownian.x = Math.max(r, Math.min(this.width - r, x));
    this.brownian.y = Math.max(r, Math.min(this.height - r, y));
    this.brownian.vx = 0;
    this.brownian.vy = 0;
  }

  public update(rawDt: number) {
    const dt = Math.max(0.001, Math.min(0.05, rawDt * this.parameters.simulationSpeed));
    const subSteps = 3;
    const subDt = dt / subSteps;

    const now = performance.now();
    this.collisionRipples = this.collisionRipples.filter((r) => now - r.timestamp < 350);

    for (let step = 0; step < subSteps; step++) {
      // 1. Move gas particles & chamber reflections
      for (const p of this.gasParticles) {
        p.x += p.vx * subDt;
        p.y += p.vy * subDt;

        if (p.x < p.radius) {
          p.x = p.radius;
          p.vx = -p.vx * 0.98;
        } else if (p.x > this.width - p.radius) {
          p.x = this.width - p.radius;
          p.vx = -p.vx * 0.98;
        }

        if (p.y < p.radius) {
          p.y = p.radius;
          p.vy = -p.vy * 0.98;
        } else if (p.y > this.height - p.radius) {
          p.y = this.height - p.radius;
          p.vy = -p.vy * 0.98;
        }
      }

      // 2. Stokes fluid damping on Brownian particle
      this.brownian.vx *= 0.9985;
      this.brownian.vy *= 0.9985;

      this.brownian.x += this.brownian.vx * subDt;
      this.brownian.y += this.brownian.vy * subDt;

      const br = this.brownian.radius;
      if (this.brownian.x < br) {
        this.brownian.x = br;
        this.brownian.vx = -this.brownian.vx * 0.85;
      } else if (this.brownian.x > this.width - br) {
        this.brownian.x = this.width - br;
        this.brownian.vx = -this.brownian.vx * 0.85;
      }

      if (this.brownian.y < br) {
        this.brownian.y = br;
        this.brownian.vy = -this.brownian.vy * 0.85;
      } else if (this.brownian.y > this.height - br) {
        this.brownian.y = this.height - br;
        this.brownian.vy = -this.brownian.vy * 0.85;
      }

      // 3. Brownian-gas elastic collision
      for (const p of this.gasParticles) {
        const dx = this.brownian.x - p.x;
        const dy = this.brownian.y - p.y;
        const distSq = dx * dx + dy * dy;
        const minDist = this.brownian.radius + p.radius;

        if (distSq < minDist * minDist && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;

          const relVx = this.brownian.vx - p.vx;
          const relVy = this.brownian.vy - p.vy;
          const velAlongNormal = relVx * nx + relVy * ny;

          if (velAlongNormal < 0) {
            const m1 = this.brownian.mass;
            const m2 = p.mass;
            const impulse = -(2 * velAlongNormal) / (m1 + m2);

            this.brownian.vx += (impulse * nx * m2) / m1;
            this.brownian.vy += (impulse * ny * m2) / m1;
            p.vx -= impulse * nx;
            p.vy -= impulse * ny;

            // Positional correction
            const overlap = minDist - dist;
            this.brownian.x += nx * overlap * 0.5 * (m2 / (m1 + m2));
            this.brownian.y += ny * overlap * 0.5 * (m2 / (m1 + m2));
            p.x -= nx * overlap * 0.5 * (m1 / (m1 + m2));
            p.y -= ny * overlap * 0.5 * (m1 / (m1 + m2));

            this.totalCollisions++;

            if (this.parameters.showCollisions && this.collisionRipples.length < 15) {
              this.collisionRipples.push({
                x: (this.brownian.x + p.x) / 2,
                y: (this.brownian.y + p.y) / 2,
                intensity: Math.min(1, Math.hypot(p.vx, p.vy) / 70),
                timestamp: performance.now(),
              });
            }
          }
        }
      }

      // 4. Gas-gas collisions using spatial partitioning
      this.resolveGasGasCollisions();
    }

    // Trajectory tracking
    if (this.parameters.showTrails && this.parameters.trailLength > 0) {
      this.brownian.trail.push({ x: this.brownian.x, y: this.brownian.y });
      while (this.brownian.trail.length > this.parameters.trailLength) {
        this.brownian.trail.shift();
      }
    } else {
      this.brownian.trail = [];
    }

    this.simulationTime += dt;

    if (this.simulationTime - this.lastMsdSampleTime >= 0.25) {
      this.lastMsdSampleTime = this.simulationTime;
      this.sampleMsd();
    }
  }

  private resolveGasGasCollisions() {
    const cellSize = 32;
    const cols = Math.max(1, Math.floor(this.width / cellSize) + 1);
    const rows = Math.max(1, Math.floor(this.height / cellSize) + 1);
    const grid: Map<number, GasParticle[]> = new Map();

    for (const p of this.gasParticles) {
      const c = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cellSize)));
      const r = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cellSize)));
      const key = r * cols + c;
      const bucket = grid.get(key);
      if (bucket) {
        bucket.push(p);
      } else {
        grid.set(key, [p]);
      }
    }

    grid.forEach((list, key) => {
      const r = Math.floor(key / cols);
      const c = key % cols;

      // Within-cell pairs
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          this.elasticPair(list[i], list[j]);
        }
      }

      // Neighbor cells
      const neighbors = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1],
      ];
      for (const [dr, dc] of neighbors) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const nList = grid.get(nr * cols + nc);
          if (nList) {
            for (const p1 of list) {
              for (const p2 of nList) {
                this.elasticPair(p1, p2);
              }
            }
          }
        }
      }
    });
  }

  private elasticPair(p1: GasParticle, p2: GasParticle) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distSq = dx * dx + dy * dy;
    const minDist = p1.radius + p2.radius;

    if (distSq < minDist * minDist && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const nx = dx / dist;
      const ny = dy / dist;

      const relVx = p1.vx - p2.vx;
      const relVy = p1.vy - p2.vy;
      const velAlongNormal = relVx * nx + relVy * ny;

      if (velAlongNormal < 0) {
        p1.vx -= velAlongNormal * nx;
        p1.vy -= velAlongNormal * ny;
        p2.vx += velAlongNormal * nx;
        p2.vy += velAlongNormal * ny;

        const overlap = minDist - dist;
        p1.x += nx * overlap * 0.5;
        p1.y += ny * overlap * 0.5;
        p2.x -= nx * overlap * 0.5;
        p2.y -= ny * overlap * 0.5;
      }
    }
  }

  private sampleMsd() {
    const dx = this.brownian.x - this.brownian.initialX;
    const dy = this.brownian.y - this.brownian.initialY;
    const measuredMsd = dx * dx + dy * dy;

    const tempK = this.parameters.temperature + 273.15;
    const diffusionD = (tempK * 0.08) / (this.brownian.radius * this.brownian.mass);
    const theoreticalMsd = 4.0 * diffusionD * this.simulationTime * 12.0;

    this.msdHistory.push({
      time: this.simulationTime,
      measuredMsd,
      theoreticalMsd,
    });

    if (this.msdHistory.length > 150) {
      this.msdHistory.shift();
    }
  }

  public getStatistics(): SimulationStatistics {
    let speedSum = 0;
    for (const p of this.gasParticles) {
      speedSum += Math.hypot(p.vx, p.vy);
    }
    const avgGasSpeed = this.gasParticles.length > 0 ? speedSum / this.gasParticles.length : 0;
    const brownianSpeed = Math.hypot(this.brownian.vx, this.brownian.vy);

    const dx = this.brownian.x - this.brownian.initialX;
    const dy = this.brownian.y - this.brownian.initialY;
    const msd = dx * dx + dy * dy;

    const tempK = this.parameters.temperature + 273.15;
    const diffusionD = (tempK * 0.08) / (this.brownian.radius * this.brownian.mass);
    const theoreticalMsd = 4.0 * diffusionD * this.simulationTime * 12.0;

    return {
      simulationTime: this.simulationTime,
      averageParticleSpeed: avgGasSpeed,
      brownianParticleSpeed: brownianSpeed,
      collisionCount: this.totalCollisions,
      meanSquaredDisplacement: msd,
      diffusionCoefficient: diffusionD,
      theoreticalMsd,
    };
  }
}

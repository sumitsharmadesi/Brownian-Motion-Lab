import React, { useEffect, useRef, useState } from 'react';
import { WebPhysicsEngine } from '../physics/WebPhysicsEngine';

interface ChamberCanvasProps {
  engine: WebPhysicsEngine;
  isRunning: boolean;
  onStatsUpdate: () => void;
}

export const ChamberCanvas: React.FC<ChamberCanvasProps> = ({
  engine,
  isRunning,
  onStatsUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Handle ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (displayWidth > 0 && displayHeight > 0) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        engine.setDimensions(displayWidth, displayHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(container);
    updateSize();

    return () => resizeObserver.disconnect();
  }, [engine]);

  // Main Render & Physics Loop
  useEffect(() => {
    let active = true;

    const render = (time: number) => {
      if (!active) return;

      const rawDt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isRunning) {
        engine.update(rawDt);
        onStatsUpdate();
      }

      // Draw frame on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.scale(dpr, dpr);

          const w = engine.width;
          const h = engine.height;

          // Background fill
          ctx.fillStyle = '#060a12';
          ctx.fillRect(0, 0, w, h);

          // Subtle scientific coordinate grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          const gridStep = 40;
          for (let x = gridStep; x < w; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = gridStep; y < h; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Collision ripples
          if (engine.parameters.showCollisions) {
            const now = performance.now();
            for (const ripple of engine.collisionRipples) {
              const age = now - ripple.timestamp;
              if (age >= 0 && age <= 350) {
                const progress = age / 350;
                const r = 5 + progress * 26;
                const alpha = (1 - progress) * 0.8;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
                ctx.lineWidth = 2 * (1 - progress);
                ctx.stroke();
              }
            }
          }

          // Trajectory Trails
          if (engine.parameters.showTrails && engine.brownian.trail.length > 1) {
            const trail = engine.brownian.trail;
            const tLen = trail.length;
            for (let i = 0; i < tLen - 1; i++) {
              const p1 = trail[i];
              const p2 = trail[i + 1];
              const alpha = Math.max(0.08, (i + 1) / tLen);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.85})`;
              ctx.lineWidth = 1.5 + (i / tLen) * 2.5;
              ctx.lineCap = 'round';
              ctx.stroke();
            }
          }

          // Gas Particles (Thermal bath)
          const pRadius = engine.parameters.particleSize;
          for (const p of engine.gasParticles) {
            // Subtle glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, pRadius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();

            // Velocity vectors on gas particles
            if (engine.parameters.showVelocityVectors) {
              const vx = p.vx * 0.25;
              const vy = p.vy * 0.25;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x + vx, p.y + vy);
              ctx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          // Brownian Particle
          const bp = engine.brownian;

          // Outer radiant halo glow
          const haloGrad = ctx.createRadialGradient(
            bp.x,
            bp.y,
            bp.radius * 0.3,
            bp.x,
            bp.y,
            bp.radius * 2.4
          );
          haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
          haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.beginPath();
          ctx.arc(bp.x, bp.y, bp.radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          // Outer boundary indicator ring
          ctx.beginPath();
          ctx.arc(bp.x, bp.y, bp.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Main sphere with 3D radial shading
          const sphereGrad = ctx.createRadialGradient(
            bp.x - bp.radius * 0.35,
            bp.y - bp.radius * 0.35,
            bp.radius * 0.1,
            bp.x,
            bp.y,
            bp.radius
          );
          sphereGrad.addColorStop(0, '#fef08a');
          sphereGrad.addColorStop(0.3, '#f59e0b');
          sphereGrad.addColorStop(0.8, '#d97706');
          sphereGrad.addColorStop(1, '#9a3412');

          ctx.beginPath();
          ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
          ctx.fillStyle = sphereGrad;
          ctx.fill();

          // Center precision crosshair
          const crosshairSize = 4.5;
          ctx.beginPath();
          ctx.moveTo(bp.x - crosshairSize, bp.y);
          ctx.lineTo(bp.x + crosshairSize, bp.y);
          ctx.moveTo(bp.x, bp.y - crosshairSize);
          ctx.lineTo(bp.x, bp.y + crosshairSize);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Brownian velocity vector
          if (engine.parameters.showVelocityVectors) {
            const vScale = 0.4;
            const endX = bp.x + bp.vx * vScale;
            const endY = bp.y + bp.vy * vScale;

            ctx.beginPath();
            ctx.moveTo(bp.x, bp.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(bp.vy, bp.vx);
            const headLen = 9;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - headLen * Math.cos(angle - Math.PI / 7),
              endY - headLen * Math.sin(angle - Math.PI / 7)
            );
            ctx.lineTo(
              endX - headLen * Math.cos(angle + Math.PI / 7),
              endY - headLen * Math.sin(angle + Math.PI / 7)
            );
            ctx.closePath();
            ctx.fillStyle = '#06b6d4';
            ctx.fill();
          }

          // Drag target hint if dragging
          if (isDragging) {
            ctx.beginPath();
            ctx.arc(bp.x, bp.y, bp.radius + 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.restore();
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    lastTimeRef.current = performance.now();
    animFrameId.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isRunning, engine, isDragging, onStatsUpdate]);

  // Pointer event handlers for interactive dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bp = engine.brownian;
    const dist = Math.hypot(x - bp.x, y - bp.y);
    if (dist <= bp.radius + 18) {
      setIsDragging(true);
      canvas.setPointerCapture(e.pointerId);
      engine.dragBrownian(x, y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    engine.dragBrownian(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden bg-[#060a12] border border-slate-800 shadow-2xl flex items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Interactive Helper Overlay */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chamber: 60 FPS Thermal Gas & Stokes Drag</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur-xs">
        Click & Drag Brownian Particle
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { MsdPoint } from '../types/physics';

interface MsdGraphCanvasProps {
  data: MsdPoint[];
  diffusionD: number;
}

export const MsdGraphCanvas: React.FC<MsdGraphCanvasProps> = ({
  data,
  diffusionD,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);

    if (w <= 0 || h <= 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark background
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 46;
    const padBottom = 28;
    const padTop = 18;
    const padRight = 20;

    const plotW = w - padLeft - padRight;
    const plotH = h - padBottom - padTop;

    if (plotW <= 0 || plotH <= 0) {
      ctx.restore();
      return;
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = padTop + (plotH / ySteps) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - padRight, h - padBottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', padLeft + plotW / 2, h - 8);

    ctx.save();
    ctx.translate(14, padTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('MSD (px²)', 0, 0);
    ctx.restore();

    if (data.length >= 2) {
      const maxTime = Math.max(2, data[data.length - 1].time);
      let maxMsd = 80;
      for (const pt of data) {
        if (pt.measuredMsd > maxMsd) maxMsd = pt.measuredMsd;
        if (pt.theoreticalMsd > maxMsd) maxMsd = pt.theoreticalMsd;
      }
      maxMsd *= 1.15; // padding

      // Y-axis tick values
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxMsd).toString(), padLeft - 6, padTop + 4);
      ctx.fillText('0', padLeft - 6, h - padBottom + 4);

      // X-axis tick value
      ctx.textAlign = 'right';
      ctx.fillText(`${maxTime.toFixed(1)}s`, w - padRight, h - 8);

      // 1. Draw Theoretical Einstein curve (4Dt)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      let first = true;
      for (const pt of data) {
        const x = padLeft + (pt.time / maxTime) * plotW;
        const y = Math.max(
          padTop,
          Math.min(h - padBottom, h - padBottom - (pt.theoreticalMsd / maxMsd) * plotH)
        );
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Measured MSD curve
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      first = true;
      for (const pt of data) {
        const x = padLeft + (pt.time / maxTime) * plotW;
        const y = Math.max(
          padTop,
          Math.min(h - padBottom, h - padBottom - (pt.measuredMsd / maxMsd) * plotH)
        );
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Current point highlight dot
      const latest = data[data.length - 1];
      const curX = padLeft + (latest.time / maxTime) * plotW;
      const curY = Math.max(
        padTop,
        Math.min(h - padBottom, h - padBottom - (latest.measuredMsd / maxMsd) * plotH)
      );

      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Collecting trajectory data points...', padLeft + plotW / 2, padTop + plotH / 2);
    }

    ctx.restore();
  }, [data, diffusionD]);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Mean Squared Displacement vs Time
          </h3>
          <p className="text-xs text-slate-400">
            Einstein relation: <span className="font-mono text-cyan-300">⟨(Δr)²⟩ ≈ 4Dt</span> (2D
            diffusion model)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block" />
            <span>Measured MSD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block" />
            <span>Theory (4Dt)</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-44 rounded-lg overflow-hidden border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="text-[12px] text-slate-400 leading-relaxed">
        Diffusive displacement scales linearly with elapsed time. Molecular bombardment causes
        instantaneous fluctuations around the theoretical ensemble mean.
      </div>
    </div>
  );
};

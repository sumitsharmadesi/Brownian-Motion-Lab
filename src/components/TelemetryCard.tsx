import React from 'react';
import { SimulationParameters, SimulationStatistics } from '../types/physics';

interface TelemetryCardProps {
  statistics: SimulationStatistics;
  parameters: SimulationParameters;
  onZeroStats: () => void;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  statistics,
  parameters,
  onZeroStats,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <h3 className="text-sm font-semibold text-slate-100">Live Experiment Telemetry</h3>
        <button
          onClick={onZeroStats}
          className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors px-2 py-1 rounded hover:bg-amber-400/10"
        >
          Reset Statistics
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Temperature</span>
          <span className="text-base font-semibold font-mono text-cyan-300">
            {parameters.temperature.toFixed(0)} °C
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Particle Density</span>
          <span className="text-base font-semibold font-mono text-cyan-300">
            {parameters.particleCount}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Avg Gas Speed</span>
          <span className="text-base font-semibold font-mono text-cyan-300">
            {statistics.averageParticleSpeed.toFixed(1)} m/s
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Brownian Speed</span>
          <span className="text-base font-semibold font-mono text-amber-300">
            {statistics.brownianParticleSpeed.toFixed(2)} m/s
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Total Collisions</span>
          <span className="text-base font-semibold font-mono text-slate-200">
            {statistics.collisionCount.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Mean Sq. Displ.</span>
          <span className="text-base font-semibold font-mono text-slate-200">
            {Math.round(statistics.meanSquaredDisplacement).toLocaleString()} px²
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Diffusion Coeff. (D)</span>
          <span className="text-base font-semibold font-mono text-slate-200">
            {statistics.diffusionCoefficient.toFixed(3)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-400">Elapsed Time</span>
          <span className="text-base font-semibold font-mono text-emerald-400">
            {statistics.simulationTime.toFixed(1)} s
          </span>
        </div>
      </div>
    </div>
  );
};

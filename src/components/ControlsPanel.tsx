import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SimulationParameters } from '../types/physics';

interface ControlsPanelProps {
  parameters: SimulationParameters;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onChangeParameters: (newParams: SimulationParameters) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  parameters,
  isRunning,
  onToggleRunning,
  onReset,
  onChangeParameters,
}) => {
  const update = <K extends keyof SimulationParameters>(
    key: K,
    value: SimulationParameters[K]
  ) => {
    onChangeParameters({
      ...parameters,
      [key]: value,
    });
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">Experiment Controls</h3>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {/* Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Temperature</span>
            <span className="font-mono text-cyan-300">{parameters.temperature.toFixed(0)} °C</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={parameters.temperature}
            onChange={(e) => update('temperature', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 °C</span>
            <span>100 °C</span>
          </div>
        </div>

        {/* Particle Count */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Particle Density</span>
            <span className="font-mono text-cyan-300">{parameters.particleCount} particles</span>
          </div>
          <input
            type="range"
            min={10}
            max={300}
            step={5}
            value={parameters.particleCount}
            onChange={(e) => update('particleCount', parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10</span>
            <span>300</span>
          </div>
        </div>

        {/* Particle Size */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Particle Size</span>
            <span className="font-mono text-cyan-300">{parameters.particleSize.toFixed(1)} px</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={0.5}
            value={parameters.particleSize}
            onChange={(e) => update('particleSize', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2 px</span>
            <span>10 px</span>
          </div>
        </div>

        {/* Brownian Particle Mass */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Brownian Mass Ratio</span>
            <span className="font-mono text-cyan-300">{parameters.brownianMass.toFixed(1)} M₀</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={parameters.brownianMass}
            onChange={(e) => update('brownianMass', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.5 M₀</span>
            <span>10 M₀</span>
          </div>
        </div>

        {/* Simulation Speed */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Simulation Speed</span>
            <span className="font-mono text-cyan-300">{parameters.simulationSpeed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.25}
            max={3}
            step={0.25}
            value={parameters.simulationSpeed}
            onChange={(e) => update('simulationSpeed', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.25x</span>
            <span>3.0x</span>
          </div>
        </div>

        {/* Trail Length */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Trail Length</span>
            <span className="font-mono text-cyan-300">{parameters.trailLength} pts</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={parameters.trailLength}
            onChange={(e) => update('trailLength', parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0</span>
            <span>30</span>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={parameters.showTrails}
            onChange={(e) => update('showTrails', e.target.checked)}
            className="accent-cyan-400 rounded"
          />
          <span>Particle Trails</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={parameters.showVelocityVectors}
            onChange={(e) => update('showVelocityVectors', e.target.checked)}
            className="accent-cyan-400 rounded"
          />
          <span>Velocity Vectors</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={parameters.showCollisions}
            onChange={(e) => update('showCollisions', e.target.checked)}
            className="accent-rose-400 rounded"
          />
          <span>Collision Indicators</span>
        </label>
      </div>
    </div>
  );
};

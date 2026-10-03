/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Atom,
  FolderCode,
  BookOpen,
  Download,
  Share2,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';
import { WebPhysicsEngine } from './physics/WebPhysicsEngine';
import { ChamberCanvas } from './components/ChamberCanvas';
import { MsdGraphCanvas } from './components/MsdGraphCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { TelemetryCard } from './components/TelemetryCard';
import { EducationDrawer } from './components/EducationDrawer';
import { AndroidProjectViewer } from './components/AndroidProjectViewer';
import { EXPERIMENT_PRESETS } from './data/presets';
import { PresetScenario, SimulationParameters } from './types/physics';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'android' | 'theory'>('simulation');
  const [isRunning, setIsRunning] = useState(true);

  // Initialize Physics Engine
  const engine = useMemo(() => {
    return new WebPhysicsEngine(EXPERIMENT_PRESETS[0].params);
  }, []);

  const [, setTick] = useState(0);

  const handleStatsUpdate = () => {
    // Light re-render tick for telemetry displays
    setTick((t) => (t + 1) % 1000);
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    engine.reset();
    setTick((t) => t + 1);
  };

  const handleZeroStats = () => {
    engine.resetStatisticsOnly();
    setTick((t) => t + 1);
  };

  const handleChangeParams = (newParams: SimulationParameters) => {
    engine.updateParameters(newParams);
    setTick((t) => t + 1);
  };

  const handleApplyPreset = (preset: PresetScenario) => {
    engine.updateParameters(preset.params);
    engine.resetStatisticsOnly();
    setIsRunning(true);
    setTick((t) => t + 1);
  };

  const handleExportCsv = () => {
    const stats = engine.getStatistics();
    let csv =
      'Time(s),Measured_MSD(px^2),Theoretical_MSD(px^2),Temperature(C),Particle_Count,Brownian_Mass\n';
    for (const pt of engine.msdHistory) {
      csv += `${pt.time.toFixed(2)},${pt.measuredMsd.toFixed(2)},${pt.theoreticalMsd.toFixed(
        2
      )},${engine.parameters.temperature},${engine.parameters.particleCount},${
        engine.parameters.brownianMass
      }\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `brownian_motion_telemetry_${Math.round(stats.simulationTime)}s.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentStats = engine.getStatistics();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Universal Top Bar Contract: 3 Zones */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm">
            <Atom className="w-4 h-4 text-slate-950" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-100">
            Brownian Motion Lab
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'simulation'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Virtual Chamber
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5" />
            <span>Android Studio Project</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Physics Theory</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            title="Export simulation data to CSV"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Preset quick-select strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Experiment Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {EXPERIMENT_PRESETS.map((p) => {
              const isActive =
                engine.parameters.temperature === p.params.temperature &&
                engine.parameters.particleCount === p.params.particleCount &&
                engine.parameters.brownianMass === p.params.brownianMass;

              return (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: Simulation Virtual Chamber */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Zone: Interactive Simulation Chamber Stage (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="h-[480px] sm:h-[540px] w-full">
                <ChamberCanvas
                  engine={engine}
                  isRunning={isRunning}
                  onStatsUpdate={handleStatsUpdate}
                />
              </div>

              {/* Real-time MSD vs Time Graph */}
              <MsdGraphCanvas
                data={engine.msdHistory}
                diffusionD={currentStats.diffusionCoefficient}
              />
            </div>

            {/* Right Zone: Control Deck, Telemetry & Educational Guidance (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Telemetry Readouts */}
              <TelemetryCard
                statistics={currentStats}
                parameters={engine.parameters}
                onZeroStats={handleZeroStats}
              />

              {/* Experiment Controls */}
              <ControlsPanel
                parameters={engine.parameters}
                isRunning={isRunning}
                onToggleRunning={handleToggleRunning}
                onReset={handleReset}
                onChangeParameters={handleChangeParams}
              />

              {/* Educational Drawer */}
              <EducationDrawer onApplyPreset={handleApplyPreset} />
            </div>
          </div>
        )}

        {/* TAB 2: Android Studio Project Explorer & Code Exporter */}
        {activeTab === 'android' && (
          <div className="flex flex-col gap-4">
            <AndroidProjectViewer />
          </div>
        )}

        {/* TAB 3: In-Depth Physics Theory & Mathematical Derivations */}
        {activeTab === 'theory' && (
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col gap-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                The Theoretical Foundations of Brownian Motion
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                From Robert Brown's 1827 botanical observations to Albert Einstein's 1905 molecular
                annus mirabilis formulation.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-cyan-300 text-base">
                  1. Microscopic Kinetic Origin
                </h3>
                <p>
                  Brownian motion emerges from the thermal motion of solvent particles. In any fluid
                  at temperature <span className="font-mono text-cyan-300">T</span>, molecules have an
                  average kinetic energy given by the equipartition theorem:
                </p>
                <div className="py-2 px-3 bg-slate-950 rounded border border-slate-800 font-mono text-cyan-300 text-center">
                  ⟨KE⟩ = ½ m ⟨v²⟩ = d/2 · k_B · T
                </div>
                <p>
                  Where <span className="font-mono text-slate-200">k_B = 1.380649 × 10⁻²³ J/K</span> is
                  the Boltzmann constant and <span className="font-mono text-slate-200">d</span> is the
                  degrees of freedom (d = 2 in our 2D chamber).
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-cyan-300 text-base">
                  2. Einstein-Smoluchowski Relation
                </h3>
                <p>
                  In 1905, Albert Einstein derived the diffusion coefficient{' '}
                  <span className="font-mono text-cyan-300">D</span> for spherical particles of radius{' '}
                  <span className="font-mono text-cyan-300">r</span> moving in a fluid of dynamic
                  viscosity <span className="font-mono text-cyan-300">η</span>:
                </p>
                <div className="py-2 px-3 bg-slate-950 rounded border border-slate-800 font-mono text-cyan-300 text-center text-base">
                  D = (k_B · T) / (6π · η · r)
                </div>
                <p>
                  This fundamental equation links microscopic fluctuations (thermal kicks from
                  solvent molecules) with macroscopic dissipation (fluid drag given by Stokes' law:{' '}
                  <span className="font-mono text-slate-200">F_drag = 6πηr · v</span>).
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-cyan-300 text-base">
                  3. Mean Squared Displacement (MSD)
                </h3>
                <p>
                  Because the net direction of a random walk is unbiased, the average vector
                  displacement is zero:
                  <span className="font-mono text-slate-200"> ⟨r(t) - r(0)⟩ = 0</span>. To quantify the
                  rate of spreading, physicists examine the Mean Squared Displacement:
                </p>
                <div className="py-2 px-3 bg-slate-950 rounded border border-slate-800 font-mono text-cyan-300 text-center text-base">
                  ⟨(Δr)²⟩ = 2 · d · D · t
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-center pt-1">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    1D Motion: ⟨(Δx)²⟩ = 2Dt
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-cyan-800/80 text-cyan-300">
                    2D Motion: ⟨(Δr)²⟩ = 4Dt
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    3D Motion: ⟨(Δr)²⟩ = 6Dt
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Our live experiment graph plots the measured 2D squared displacement in real-time
                  against the theoretical line <span className="font-mono text-amber-300">4Dt</span>.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-cyan-300 text-base">
                  4. The Langevin Equation Framework
                </h3>
                <p>
                  Paul Langevin (1908) formulated the dynamical equation of motion using Newton's
                  second law by splitting forces into systematic viscous drag and stochastic
                  bombardment:
                </p>
                <div className="py-2 px-3 bg-slate-950 rounded border border-slate-800 font-mono text-cyan-300 text-center">
                  m · (dv/dt) = -γ · v + ξ(t)
                </div>
                <p className="text-xs text-slate-400">
                  Where <span className="font-mono text-slate-200">-γ · v</span> is Stokes damping and{' '}
                  <span className="font-mono text-slate-200">ξ(t)</span> is a Gaussian white noise
                  representing molecular collisions with zero mean and delta-correlated variance.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Scientific Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Brownian Motion Lab</span>
          <span>·</span>
          <span>Educational Stochastic Kinetic Simulation</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Kotlin 2.1</span>
          <span>Jetpack Compose</span>
          <span>Material 3</span>
          <span>Android SDK 35</span>
        </div>
      </footer>
    </div>
  );
}

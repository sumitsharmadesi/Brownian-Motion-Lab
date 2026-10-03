import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { PresetScenario } from '../types/physics';
import { EXPERIMENT_PRESETS } from '../data/presets';

interface EducationDrawerProps {
  onApplyPreset: (preset: PresetScenario) => void;
}

export const EducationDrawer: React.FC<EducationDrawerProps> = ({ onApplyPreset }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
            What is Brownian Motion?
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-cyan-400">
          <span>{isOpen ? 'Collapse Guide' : 'Read Physics Guide & Experiments'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <p className="text-xs text-slate-300 leading-relaxed">
        Brownian motion is the random movement of microscopic particles suspended in a fluid. The
        motion occurs because the particle is continuously bombarded by surrounding molecules that
        are too small to see.
      </p>

      {isOpen && (
        <div className="flex flex-col gap-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-cyan-300">What are we observing?</span>
              <p className="text-slate-400 leading-relaxed">
                The central amber particle represents an observable colloidal entity (like a pollen
                grain, smoke particulate, or gold nanoparticle). The surrounding cyan particles
                represent fluid or solvent molecules undergoing continuous thermal agitation.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-cyan-300">Why does it move randomly?</span>
              <p className="text-slate-400 leading-relaxed">
                At any instantaneous microsecond, the momentum transfer from molecular impacts on
                one side does not cancel out the opposite side. The net stochastic force fluctuates
                continuously, producing a jagged random walk trajectory.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-cyan-300">
                What happens when temperature rises?
              </span>
              <p className="text-slate-400 leading-relaxed">
                Kinetic theory dictates that average kinetic energy is proportional to absolute
                temperature: <span className="font-mono text-slate-200">½mv² ∝ k_B T</span>. Higher
                temperature accelerates molecular collisions, leading to faster diffusion and a
                steeper MSD slope.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-cyan-300">
                What is Mean Squared Displacement (MSD)?
              </span>
              <p className="text-slate-400 leading-relaxed">
                Because directional displacement averages to zero in random walks, physicists
                evaluate the ensemble average of squared displacement:
                <span className="font-mono text-slate-200"> ⟨(Δr)²⟩ = 2dDt</span>. In a 2D plane (d =
                2), <span className="font-mono text-cyan-300">MSD = 4Dt</span>.
              </p>
            </div>
          </div>

          {/* Suggested Guided Experiments */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-xs font-semibold text-amber-400 tracking-wide uppercase">
              Guided Interactive Experiments
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {EXPERIMENT_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg p-3 flex flex-col justify-between gap-2.5 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200">{preset.title}</span>
                      <span className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                        {preset.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onApplyPreset(preset)}
                    className="w-full text-xs font-medium py-1.5 px-2 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 rounded transition-colors cursor-pointer border border-slate-700 hover:border-transparent text-center"
                  >
                    Load Scenario
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Real world applications */}
          <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg flex flex-col gap-1.5">
            <span className="font-semibold text-slate-200">Real-World Scientific Applications</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>
                <strong className="text-slate-300">Molecular Physics:</strong> Einstein's 1905 paper
                and Jean Perrin's 1908 experiments confirmed the physical reality of atoms and
                determined Avogadro's number.
              </li>
              <li>
                <strong className="text-slate-300">Biophysics & Medicine:</strong> Passive transport
                of drug carriers, proteins, and metabolites through cellular cytoplasm and lipid
                bilayers.
              </li>
              <li>
                <strong className="text-slate-300">Nanotechnology:</strong> Colloidal self-assembly,
                fluorescence correlation spectroscopy (FCS), and dynamic light scattering (DLS).
              </li>
              <li>
                <strong className="text-slate-300">Financial Mathematics:</strong> Geometric Brownian
                motion serves as a stochastic mathematical analogy (Black-Scholes model) for asset
                fluctuations, distinct from physical kinetic bombardment.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

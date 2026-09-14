import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Activity, ArrowRight } from 'lucide-react';

export const DigitalTwinTimeline: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            DIGITAL TWIN EVENT TIMELINE & TRACE PIPELINE
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Last 5 System Events Logged
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center space-x-3 py-2 min-w-[700px]">
          {state.events.slice(0, 5).map((evt, idx) => {
            const isLatest = idx === 0;
            return (
              <React.Fragment key={evt.id}>
                <div
                  className={`flex-1 p-2.5 rounded-lg border text-xs transition-all ${
                    isLatest
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-[#18233b] border-[#293a5e]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>{evt.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        evt.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400'
                          : evt.severity === 'WARNING'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 truncate">{evt.eventType}</div>
                  <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">{evt.description}</div>

                  <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{evt.gpioOrProtocol || 'GPIO/I2C'}</span>
                    <span className="text-cyan-400 truncate max-w-[110px]">{evt.firmwareFunction || 'loop()'}</span>
                  </div>
                </div>

                {idx < Math.min(4, state.events.length - 1) && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

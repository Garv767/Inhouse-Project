import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Layers, Zap } from 'lucide-react';

export const SignalOscilloscope: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>HARDWARE SIGNAL & LOGIC ANALYZER MONITOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time digital logic trace & continuous signal waveforms for ESP32 GPIO pins.
          </p>
        </div>
        <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-3 py-1 rounded font-mono">
          SAMPLING: 100 MS LOGIC ANALYZER
        </span>
      </div>

      {/* 4 LOGIC TRACE CHANNELS */}
      <div className="bg-[#0c1220] border border-[#1e293b] rounded-xl p-4 space-y-4 shadow-xl">
        {/* CHANNEL 1: DOOR GPIO 18 */}
        <div className="bg-[#121b2d] p-3 rounded-lg border border-[#233352]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <strong>CH 1: DOOR REED SWITCH (GPIO 18)</strong>
            </span>
            <span className="text-cyan-400 font-bold">{state.doorOpen ? 'LOGIC 0 (LOW)' : 'LOGIC 1 (HIGH)'}</span>
          </div>

          <div className="h-12 bg-[#080d19] rounded p-2 flex items-center overflow-hidden border border-[#182642]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
              <path
                d={
                  state.doorOpen
                    ? "M 0 25 L 100 25 L 105 5 L 300 5 L 305 25 L 400 25"
                    : "M 0 5 L 400 5"
                }
                fill="none"
                stroke={state.doorOpen ? '#f59e0b' : '#10b981'}
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* CHANNEL 2: BUZZER GPIO 21 */}
        <div className="bg-[#121b2d] p-3 rounded-lg border border-[#233352]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <strong>CH 2: BUZZER PWM ALARM (GPIO 21)</strong>
            </span>
            <span className="text-amber-400 font-bold">{state.hardwareOutputs.buzzer}</span>
          </div>

          <div className="h-12 bg-[#080d19] rounded p-2 flex items-center overflow-hidden border border-[#182642]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
              <path
                d={
                  state.hardwareOutputs.buzzer !== 'OFF'
                    ? "M 0 25 L 30 25 L 30 5 L 50 5 L 50 25 L 80 25 L 80 5 L 100 5 L 100 25 L 400 25"
                    : "M 0 25 L 400 25"
                }
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* CHANNEL 3: LED GPIO 2 */}
        <div className="bg-[#121b2d] p-3 rounded-lg border border-[#233352]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <strong>CH 3: STATUS LED OUTPUT (GPIO 2)</strong>
            </span>
            <span className="text-emerald-400 font-bold">{state.hardwareOutputs.led}</span>
          </div>

          <div className="h-12 bg-[#080d19] rounded p-2 flex items-center overflow-hidden border border-[#182642]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
              <path
                d={
                  state.hardwareOutputs.led === 'WARNING'
                    ? "M 0 25 L 50 25 L 50 5 L 100 5 L 100 25 L 150 25 L 150 5 L 200 5 L 200 25 L 400 25"
                    : "M 0 5 L 400 5"
                }
                fill="none"
                stroke={state.hardwareOutputs.led === 'WARNING' ? '#ef4444' : '#10b981'}
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* CHANNEL 4: LOAD CELL ADC GPIO 34 */}
        <div className="bg-[#121b2d] p-3 rounded-lg border border-[#233352]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <strong>CH 4: LOAD CELL DIFFERENTIAL ADC (GPIO 34)</strong>
            </span>
            <span className="text-blue-400 font-bold">{state.weight.toFixed(1)}g (ADC 0x07A4)</span>
          </div>

          <div className="h-12 bg-[#080d19] rounded p-2 flex items-center overflow-hidden border border-[#182642]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 30">
              <path
                d={
                  state.weight > 0
                    ? "M 0 5 L 400 5"
                    : "M 0 5 L 100 5 L 105 25 L 400 25"
                }
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* SIGNAL BUS DISPATCHER LOG TABLE */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
        <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>RECENT SIGNAL PULSE DISPATCH EVENTS</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e293b] text-slate-400 text-[11px]">
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">SOURCE</th>
                <th className="py-2 px-3">DESTINATION</th>
                <th className="py-2 px-3">SIGNAL TYPE</th>
                <th className="py-2 px-3">PIN / BUS</th>
                <th className="py-2 px-3">PAYLOAD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {state.activeSignals.length > 0 ? (
                state.activeSignals.map((sig) => (
                  <tr key={sig.id} className="text-slate-300 hover:bg-[#182542]">
                    <td className="py-2 px-3">{sig.formattedTime}</td>
                    <td className="py-2 px-3 text-cyan-400">{sig.source}</td>
                    <td className="py-2 px-3 text-emerald-400">{sig.destination}</td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                        {sig.signalType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-amber-300">{sig.pin || 'INTERNAL'}</td>
                    <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{sig.payload}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500 italic">
                    No active travelling signal pulses. Perform an action (e.g. Open Door, Remove Meds) to generate GPIO pulses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

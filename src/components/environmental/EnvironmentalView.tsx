import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Thermometer, Droplets, Flame } from 'lucide-react';

export const EnvironmentalView: React.FC = () => {
  const { state, raiseTemperature, lowerTemperature, raiseHumidity, lowerHumidity } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-cyan-400" />
            <span>ENVIRONMENTAL MONITORING & STORAGE HEALTH ENGINE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ambient climate monitoring, storage health scoring, and threshold violation detection.
          </p>
        </div>

        <div className="bg-amber-950/60 border border-amber-800 text-amber-300 px-3 py-1 rounded text-xs font-mono">
          DEMO LIMITS: 15°C–25°C | 30%–60% RH (NOT UNIVERSAL MEDICAL CERTIFICATION)
        </div>
      </div>

      {/* STORAGE HEALTH SCORE BREAKDOWN CARD */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left border-r border-[#1e293b] pr-6">
          <div className="text-xs text-slate-400 font-mono mb-1">PROJECT-DEFINED STORAGE HEALTH SCORE</div>
          <div className={`text-4xl font-extrabold font-mono ${state.storageHealth < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {state.storageHealth} <span className="text-xl text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Status: <strong className={state.storageHealth < 80 ? 'text-rose-400' : 'text-emerald-400'}>{state.storageHealth >= 90 ? 'OPTIMAL' : state.storageHealth >= 75 ? 'DEGRADED' : 'CRITICAL'}</strong>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3 text-xs">
          <div className="flex justify-between items-center bg-[#18233b] p-2.5 rounded border border-[#27375a]">
            <span className="text-slate-300">Temperature Stability Factor (Weight 50%):</span>
            <span className="font-mono font-bold text-cyan-300">
              {state.temperature >= state.settings.tempMin && state.temperature <= state.settings.tempMax ? '100%' : '50% (LIMIT VIOLATION)'}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#18233b] p-2.5 rounded border border-[#27375a]">
            <span className="text-slate-300">Humidity Stability Factor (Weight 30%):</span>
            <span className="font-mono font-bold text-cyan-300">
              {state.humidity >= state.settings.humidityMin && state.humidity <= state.settings.humidityMax ? '100%' : '70%'}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#18233b] p-2.5 rounded border border-[#27375a]">
            <span className="text-slate-300">Hardware & Sensor Integrity (Weight 20%):</span>
            <span className="font-mono font-bold text-emerald-400">
              {state.sensorsOnline ? '100% ONLINE' : '0% FAULT'}
            </span>
          </div>
        </div>
      </div>

      {/* CLIMATE CONTROLS & HEAT CHAMBER SIMULATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEMPERATURE CONTROL PANEL */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>TEMPERATURE CLIMATE CHAMBER</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{state.temperature}°C</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => raiseTemperature(3.5)}
              className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>SPIKE TEMP (+3.5°C)</span>
            </button>

            <button
              onClick={() => lowerTemperature(3.5)}
              className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>COOL TEMP (-3.5°C)</span>
            </button>
          </div>

          <div className="bg-[#18233b] p-3 rounded text-xs text-slate-300 space-y-1 font-mono">
            <div>Configured Min Limit: <strong>{state.settings.tempMin}°C</strong></div>
            <div>Configured Max Limit: <strong>{state.settings.tempMax}°C</strong></div>
          </div>
        </div>

        {/* HUMIDITY CONTROL PANEL */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>HUMIDITY CLIMATE CHAMBER</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{state.humidity}% RH</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => raiseHumidity(15)}
              className="bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800 p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>SPIKE HUMIDITY (+15%)</span>
            </button>

            <button
              onClick={() => lowerHumidity(15)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Droplets className="w-4 h-4 text-slate-400" />
              <span>LOWER HUMIDITY (-15%)</span>
            </button>
          </div>

          <div className="bg-[#18233b] p-3 rounded text-xs text-slate-300 space-y-1 font-mono">
            <div>Configured Min Limit: <strong>{state.settings.humidityMin}%</strong></div>
            <div>Configured Max Limit: <strong>{state.settings.humidityMax}%</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

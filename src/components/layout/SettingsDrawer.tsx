import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Settings, X, Save, RotateCcw } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings, saveLocalState, clearSavedState } = useSimulation();

  const [tempMax, setTempMax] = useState(state.settings.tempMax);
  const [tempMin, setTempMin] = useState(state.settings.tempMin);
  const [humidityMax, setHumidityMax] = useState(state.settings.humidityMax);
  const [humidityMin] = useState(state.settings.humidityMin);
  const [gracePeriod, setGracePeriod] = useState(state.settings.gracePeriodMinutes);
  const [samplingInterval, setSamplingInterval] = useState(state.settings.samplingIntervalMs);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      tempMax,
      tempMin,
      humidityMax,
      humidityMin,
      gracePeriodMinutes: gracePeriod,
      samplingIntervalMs: samplingInterval
    });
    saveLocalState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none">
      <div className="w-80 bg-[#0f0f0f] border-l border-[#222222] h-full p-5 flex flex-col justify-between shadow-2xl text-xs">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#222222] pb-3">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2 font-mono">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>SYSTEM SETTINGS</span>
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Max Temperature Limit (°C):</label>
              <input
                type="number"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#262626] text-slate-100 p-2 rounded focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Min Temperature Limit (°C):</label>
              <input
                type="number"
                value={tempMin}
                onChange={(e) => setTempMin(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#262626] text-slate-100 p-2 rounded focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Max Humidity Limit (% RH):</label>
              <input
                type="number"
                value={humidityMax}
                onChange={(e) => setHumidityMax(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#262626] text-slate-100 p-2 rounded focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Medication Grace Period (Minutes):</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#262626] text-slate-100 p-2 rounded focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Sampling Interval (ms):</label>
              <input
                type="number"
                value={samplingInterval}
                onChange={(e) => setSamplingInterval(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#262626] text-slate-100 p-2 rounded focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#141414] p-3 rounded border border-[#262626] text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">DEMO CONFIGURATION NOTICE</div>
            <p className="leading-relaxed">
              These threshold settings dictate local ESP32 edge alert triggers and storage health calculation rules.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#222222]">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded text-xs transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE CONFIGURATION</span>
          </button>

          <button
            onClick={clearSavedState}
            className="w-full flex items-center justify-center space-x-1.5 bg-[#181818] hover:bg-[#222222] text-slate-400 hover:text-slate-200 py-1.5 rounded text-xs font-mono transition-all border border-[#262626]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO BASELINE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Settings, Cpu, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, updateSettings, saveLocalState } = useSimulation();

  const [tempMax, setTempMax] = useState(state.settings.tempMax);
  const [tempMin, setTempMin] = useState(state.settings.tempMin);
  const [gracePeriod, setGracePeriod] = useState(state.settings.gracePeriodMinutes);

  const handleSave = () => {
    updateSettings({
      tempMax,
      tempMin,
      gracePeriodMinutes: gracePeriod
    });
    saveLocalState();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>PROJECT DEMONSTRATION SETTINGS & ESP32 MIGRATION</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure threshold parameters, grace period duration, and view real hardware migration architecture.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg text-xs"
        >
          <Save className="w-4 h-4" />
          <span>SAVE DEMO SETTINGS</span>
        </button>
      </div>

      {/* THRESHOLD CONFIGURATION FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider border-b border-[#1e293b] pb-2">
            ENVIRONMENTAL THRESHOLD PARAMETERS
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">Temperature Upper Maximum Limit (°C):</label>
              <input
                type="number"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full bg-[#16223b] border border-[#27385c] text-cyan-300 p-2 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Temperature Lower Minimum Limit (°C):</label>
              <input
                type="number"
                value={tempMin}
                onChange={(e) => setTempMin(Number(e.target.value))}
                className="w-full bg-[#16223b] border border-[#27385c] text-cyan-300 p-2 rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Medication Grace Period Duration (Minutes):</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full bg-[#16223b] border border-[#27385c] text-cyan-300 p-2 rounded font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* FROM SIMULATION TO REAL PHYSICAL ESP32 MIGRATION GUIDE */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4 text-xs">
          <h3 className="font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>FROM SIMULATION TO REAL PHYSICAL ESP32</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#16223b] p-3 rounded-lg border border-[#27385c] space-y-1">
              <div className="font-bold text-slate-200 font-mono">CURRENT ARCHITECTURE:</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Browser Simulation Engine → TypeScript State Store → Emulated HTTP REST API / WebSocket → Dashboard UI.
              </p>
            </div>

            <div className="bg-[#16223b] p-3 rounded-lg border border-[#27385c] space-y-1">
              <div className="font-bold text-emerald-400 font-mono">FUTURE PHYSICAL ESP32 DEPLOYMENT:</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Real Sensors (DHT22, HX711, Reed Switch) → Physical ESP32 Micro-controller → Native C++ Firmware → ESP32 AsyncWebServer (Port 80) → Same Dashboard UI!
              </p>
            </div>

            <div className="bg-[#10192e] p-2.5 rounded border border-[#1d2d52] text-[10px] text-slate-400">
              <strong>API Compatibility Note:</strong> The JSON data packet consumed by this Dashboard UI matches the exact payload structure output by the reference Embedded C firmware (`/api/status` & `/api/sensors`).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

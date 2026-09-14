import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Database, Radio } from 'lucide-react';

export const DatabaseInspector: React.FC = () => {
  const { state, clearSavedState, saveLocalState } = useSimulation();

  const [activeTable, setActiveTable] = useState<'sensor' | 'schedule' | 'history' | 'alerts' | 'events'>('history');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>DATABASE & SIMULATED PROTOCOL INSPECTOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal storage table inspector, simulated MQTT topic stream, and simulated REST API endpoints.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={saveLocalState}
            className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan-900"
          >
            SAVE LOCAL STATE
          </button>
          <button
            onClick={clearSavedState}
            className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            CLEAR DB STATE
          </button>
        </div>
      </div>

      {/* DATABASE TABLES TABS */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex space-x-2 border-b border-[#1e293b] pb-3 overflow-x-auto text-xs">
          {[
            { id: 'history', label: 'dose_history' },
            { id: 'schedule', label: 'medication_schedule' },
            { id: 'sensor', label: 'sensor_readings' },
            { id: 'alerts', label: 'alerts' },
            { id: 'events', label: 'system_events' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTable(tab.id as any)}
              className={`px-3 py-1.5 rounded font-mono font-semibold transition-all ${
                activeTable === tab.id
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : 'bg-[#18233b] text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLE DATA DISPLAY */}
        <div className="overflow-x-auto">
          {activeTable === 'history' && (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">SLOT</th>
                  <th className="py-2 px-3">MEDICINE</th>
                  <th className="py-2 px-3">SCHEDULED</th>
                  <th className="py-2 px-3">ACTUAL</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">DELAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {state.doseHistory.map((d) => (
                  <tr key={d.id} className="hover:bg-[#18233b]">
                    <td className="py-2 px-3 text-slate-500">{d.id}</td>
                    <td className="py-2 px-3 text-cyan-400">{d.compartmentId}</td>
                    <td className="py-2 px-3 text-slate-200 font-sans">{d.medicationName}</td>
                    <td className="py-2 px-3">{d.scheduledTime}</td>
                    <td className="py-2 px-3">{d.actualTime || '--'}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${d.status === 'TAKEN' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">{d.delayMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTable === 'sensor' && (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400">
                  <th className="py-2 px-3">TIMESTAMP</th>
                  <th className="py-2 px-3">TEMP (°C)</th>
                  <th className="py-2 px-3">HUMIDITY (%)</th>
                  <th className="py-2 px-3">WEIGHT (g)</th>
                  <th className="py-2 px-3">DOOR</th>
                  <th className="py-2 px-3">WI-FI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {state.sensorHistory.slice(-10).map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#18233b]">
                    <td className="py-2 px-3">{s.timestamp}</td>
                    <td className="py-2 px-3 text-cyan-400">{s.temperature}°C</td>
                    <td className="py-2 px-3 text-blue-400">{s.humidity}%</td>
                    <td className="py-2 px-3 text-emerald-400">{s.weight.toFixed(1)}g</td>
                    <td className="py-2 px-3">{s.doorOpen ? 'OPEN' : 'CLOSED'}</td>
                    <td className="py-2 px-3">{s.wifiConnected ? 'CONNECTED' : 'DISCONNECTED'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SIMULATED MQTT & REST API SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SIMULATED MQTT BROKER */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <span className="font-bold text-slate-200 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>SIMULATED MQTT BROKER STREAM</span>
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded">
              TOPIC: medicine/device01/telemetry
            </span>
          </div>

          <div className="bg-[#090e1a] p-3 rounded border border-[#17233d] text-cyan-300">
            <div className="text-slate-500 text-[10px] mb-1">QoS 1 | Retain: false</div>
            <pre className="text-[11px] leading-relaxed">
{JSON.stringify(
  {
    topic: 'medicine/device01/telemetry',
    publisher: 'ESP32-MED-001',
    payload: {
      temperature: state.temperature,
      humidity: state.humidity,
      doorState: state.doorOpen ? 'OPEN' : 'CLOSED',
      weight: state.weight
    }
  },
  null,
  2
)}
            </pre>
          </div>
          <div className="text-[10px] text-slate-500 italic">
            * Conceptual MQTT representation — emulated inside browser simulation.
          </div>
        </div>

        {/* SIMULATED REST API ENDPOINTS */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs">
          <div className="border-b border-[#1e293b] pb-2 font-bold text-slate-200">
            ESP32 EMBEDDED HTTP REST API ENDPOINTS
          </div>

          <div className="space-y-2">
            <div className="bg-[#18233b] p-2 rounded flex justify-between">
              <span className="text-emerald-400 font-bold">GET /api/status</span>
              <span className="text-slate-400">200 OK (Device State)</span>
            </div>
            <div className="bg-[#18233b] p-2 rounded flex justify-between">
              <span className="text-emerald-400 font-bold">GET /api/sensors</span>
              <span className="text-slate-400">200 OK (Temp, Hum, Weight)</span>
            </div>
            <div className="bg-[#18233b] p-2 rounded flex justify-between">
              <span className="text-emerald-400 font-bold">GET /api/medications</span>
              <span className="text-slate-400">200 OK (Schedules A1-A4)</span>
            </div>
            <div className="bg-[#18233b] p-2 rounded flex justify-between">
              <span className="text-cyan-400 font-bold">POST /api/simulation/event</span>
              <span className="text-slate-400">200 OK (Trigger Event)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

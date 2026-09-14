import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Database, Radio, Terminal, Filter, ChevronRight, ChevronDown } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { state, clearSavedState, saveLocalState } = useSimulation();

  const [filterCategory, setFilterCategory] = useState<'ALL' | 'HARDWARE' | 'DOSE' | 'ALARM' | 'SYSTEM'>('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'database' | 'protocol'>('events');

  const filteredEvents = state.events.filter((evt) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'HARDWARE') return evt.eventType.includes('DOOR') || evt.eventType.includes('HARDWARE') || evt.eventType.includes('SENSOR');
    if (filterCategory === 'DOSE') return evt.eventType.includes('MEDICINE') || evt.eventType.includes('DOSE');
    if (filterCategory === 'ALARM') return evt.severity === 'CRITICAL' || evt.severity === 'WARNING';
    if (filterCategory === 'SYSTEM') return evt.eventType.includes('SYSTEM') || evt.eventType.includes('WIFI');
    return true;
  });

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* TOP BAR */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>OPERATIONAL EVENT LOG & PROTOCOL INSPECTOR</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Hardware interrupt events, GPIO state transitions, dosage audit history, and MQTT/HTTP protocol payload traces.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-[#080808] border border-[#222222] rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${
              activeTab === 'events' ? 'bg-[#222222] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>EVENT TIMELINE ({state.events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${
              activeTab === 'database' ? 'bg-[#222222] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DATABASE TABLES</span>
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition-colors ${
              activeTab === 'protocol' ? 'bg-[#222222] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>MQTT / REST STREAM</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OPERATIONAL EVENT LOG TIMELINE */}
      {activeTab === 'events' && (
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
          {/* Controls & Filter */}
          <div className="flex flex-wrap justify-between items-center text-xs border-b border-[#222222] pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 uppercase text-[11px] font-bold">CATEGORY:</span>
              {(['ALL', 'HARDWARE', 'DOSE', 'ALARM', 'SYSTEM'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#222222] text-emerald-400 border border-emerald-800'
                      : 'bg-[#080808] text-slate-400 border border-[#1e1e1e] hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              <button
                onClick={saveLocalState}
                className="bg-[#181818] text-emerald-400 border border-[#2b2b2b] px-3 py-1 rounded font-bold hover:bg-[#222222]"
              >
                SAVE LOG
              </button>
              <button
                onClick={clearSavedState}
                className="bg-[#181818] text-slate-400 border border-[#2b2b2b] px-3 py-1 rounded font-bold hover:bg-[#222222]"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">NO EVENT RECORDS FOUND FOR SELECTED FILTER</div>
            ) : (
              filteredEvents.slice().reverse().map((evt) => {
                const isExpanded = expandedEventId === evt.id;

                return (
                  <div
                    key={evt.id}
                    className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-3 text-xs space-y-2 transition-colors hover:border-[#333333]"
                  >
                    <div
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="text-slate-500 font-mono text-[11px]">
                          [{evt.timestamp}]
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.severity === 'CRITICAL'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : evt.severity === 'WARNING'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {evt.eventType}
                        </span>
                        <span className="font-bold text-slate-200">{evt.description}</span>
                      </div>

                      {evt.gpioOrProtocol && (
                        <span className="bg-[#181818] text-emerald-400 border border-[#262626] px-2 py-0.5 rounded text-[10px]">
                          PIN: {evt.gpioOrProtocol}
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-[#1e1e1e] bg-[#050505] p-3 rounded space-y-2 text-[11px]">
                        <div className="grid grid-cols-2 gap-2 text-slate-400">
                          <div>
                            Event ID: <span className="text-slate-200 font-mono">{evt.id}</span>
                          </div>
                          <div>
                            Severity: <span className="text-emerald-400 font-bold uppercase">{evt.severity || 'INFO'}</span>
                          </div>
                        </div>

                        {evt.description && (
                          <div className="text-slate-300 font-sans text-xs bg-[#111111] p-2 rounded border border-[#222222]">
                            {evt.description}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 font-mono">
                          Firmware Handler Trace: <span className="text-amber-400 font-bold">{evt.firmwareFunction || 'loop()'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE TABLES */}
      {activeTab === 'database' && (
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex justify-between items-center text-xs border-b border-[#222222] pb-3">
            <span className="font-bold text-slate-300 uppercase">LOCAL STORAGE TABLES</span>
            <div className="flex space-x-2">
              <button onClick={saveLocalState} className="bg-[#181818] text-emerald-400 border border-[#2b2b2b] px-3 py-1 rounded font-bold hover:bg-[#222222]">
                SAVE DB
              </button>
              <button onClick={clearSavedState} className="bg-[#181818] text-slate-400 border border-[#2b2b2b] px-3 py-1 rounded font-bold hover:bg-[#222222]">
                CLEAR DB
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#222222] text-slate-500 text-[10px]">
                  <th className="py-2 px-3">SLOT</th>
                  <th className="py-2 px-3">MEDICINE</th>
                  <th className="py-2 px-3">SCHEDULED</th>
                  <th className="py-2 px-3">ACTUAL</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">DELAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {state.doseHistory.map((d) => (
                  <tr key={d.id} className="hover:bg-[#181818]">
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{d.compartmentId}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-sans">{d.medicationName}</td>
                    <td className="py-2.5 px-3">{d.scheduledTime}</td>
                    <td className="py-2.5 px-3">{d.actualTime || '--'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'TAKEN' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{d.delayMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MQTT / REST STREAM */}
      {activeTab === 'protocol' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex justify-between items-center border-b border-[#222222] pb-2 text-xs">
              <span className="font-bold text-slate-200 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>MQTT TOPIC TELEMETRY STREAM</span>
              </span>
              <span className="text-[10px] bg-[#181818] text-emerald-400 border border-[#2b2b2b] px-2 py-0.5 rounded">
                medicine/device01/telemetry
              </span>
            </div>

            <div className="bg-[#080808] p-3 rounded border border-[#1e1e1e] text-emerald-300">
              <div className="text-slate-500 text-[10px] mb-1">QoS 1 | Retain: false</div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto">
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
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
            <div className="border-b border-[#222222] pb-2 font-bold text-slate-200 text-xs">
              ESP32 HTTP REST ENDPOINTS
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#080808] p-2 rounded border border-[#1e1e1e] flex justify-between">
                <span className="text-emerald-400 font-bold">GET /api/status</span>
                <span className="text-slate-400">200 OK</span>
              </div>
              <div className="bg-[#080808] p-2 rounded border border-[#1e1e1e] flex justify-between">
                <span className="text-emerald-400 font-bold">GET /api/sensors</span>
                <span className="text-slate-400">200 OK</span>
              </div>
              <div className="bg-[#080808] p-2 rounded border border-[#1e1e1e] flex justify-between">
                <span className="text-emerald-400 font-bold">GET /api/medications</span>
                <span className="text-slate-400">200 OK</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

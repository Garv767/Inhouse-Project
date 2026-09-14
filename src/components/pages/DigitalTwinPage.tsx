import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { CircuitCanvas } from '../digitalTwin/CircuitCanvas';
import { ElectricalPartsTree } from '../digitalTwin/ElectricalPartsTree';
import { PhysicalBoxSplitView } from '../digitalTwin/PhysicalBoxSplitView';
import { ComponentDetailsModal } from '../digitalTwin/ComponentDetailsModal';
import {
  DoorOpen,
  DoorClosed,
  Pill,
  Thermometer,
  RotateCcw,
  WifiOff,
  Layers,
  Cpu
} from 'lucide-react';


export const DigitalTwinPage: React.FC = () => {
  const {
    state,
    openDoor,
    closeDoor,
    removeMedicine,
    restoreMedicine,
    raiseTemperature,
    lowerTemperature,
    toggleWifi,
    resetSimulation
  } = useSimulation();

  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'SCHEMATIC' | 'SPLIT'>('SCHEMATIC');

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* TOP SIMULATION CONTROL BAR */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: View Mode Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VIEW MODE:</span>
          <div className="flex bg-[#080808] border border-[#222222] rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('SCHEMATIC')}
              className={`px-3 py-1 rounded-md flex items-center space-x-1.5 transition-colors ${
                viewMode === 'SCHEMATIC' ? 'bg-[#222222] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CIRCUIT CANVAS</span>
            </button>
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`px-3 py-1 rounded-md flex items-center space-x-1.5 transition-colors ${
                viewMode === 'SPLIT' ? 'bg-[#222222] text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SPLIT SCHEMATIC + PHYSICAL</span>
            </button>
          </div>
        </div>

        {/* Right: Hardware Event Action Triggers */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => (state.doorOpen ? closeDoor() : openDoor())}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition-colors ${
              state.doorOpen
                ? 'bg-amber-950/40 text-amber-400 border-amber-800 hover:bg-amber-900/50'
                : 'bg-[#181818] text-slate-300 border-[#2b2b2b] hover:bg-[#222222]'
            }`}
          >
            {state.doorOpen ? <DoorClosed className="w-3.5 h-3.5 text-amber-400" /> : <DoorOpen className="w-3.5 h-3.5" />}
            <span>{state.doorOpen ? 'CLOSE DOOR' : 'OPEN DOOR'}</span>
          </button>

          <button
            onClick={() => {
              if (state.doorOpen) {
                if (state.compartments.A1.present) {
                  removeMedicine('A1');
                } else {
                  restoreMedicine('A1');
                }
              } else {
                openDoor();
                setTimeout(() => removeMedicine('A1'), 300);
              }
            }}
            className="px-3 py-1.5 rounded-lg border bg-[#181818] text-emerald-400 border-[#2b2b2b] hover:bg-[#222222] font-semibold flex items-center space-x-1.5"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>REMOVE MED A1</span>
          </button>

          <button
            onClick={() => (state.temperature > 28 ? lowerTemperature(8) : raiseTemperature(7))}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition-colors ${
              state.temperature > 28
                ? 'bg-red-950/50 text-red-400 border-red-800'
                : 'bg-[#181818] text-slate-300 border-[#2b2b2b] hover:bg-[#222222]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>{state.temperature > 28 ? 'COOL DOWN (22°C)' : 'HEAT BOX (31°C)'}</span>
          </button>

          <button
            onClick={() => toggleWifi()}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition-colors ${
              !state.wifiConnected
                ? 'bg-red-950/50 text-red-400 border-red-800'
                : 'bg-[#181818] text-slate-300 border-[#2b2b2b] hover:bg-[#222222]'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>{state.wifiConnected ? 'SIMULATE WIFI DROP' : 'RECONNECT WIFI'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="px-3 py-1.5 rounded-lg border bg-[#181818] text-slate-400 border-[#2b2b2b] hover:text-slate-200 hover:bg-[#222222] font-semibold flex items-center space-x-1"
            title="Reset Digital Twin State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* COMPONENT INSPECTION MODAL IF A COMPONENT IS SELECTED */}
      {selectedComp && <ComponentDetailsModal />}

      {/* MAIN DIGITAL TWIN WORKSPACE */}
      <div className="flex gap-4 min-h-[580px]">
        {viewMode === 'SCHEMATIC' && (
          <>
            <CircuitCanvas
              onSelectComponent={(name) => setSelectedComp(name)}
              selectedComponent={selectedComp}
            />
            <ElectricalPartsTree
              onSelectComponent={(name) => setSelectedComp(name)}
              selectedComponent={selectedComp}
            />
          </>
        )}

        {viewMode === 'SPLIT' && (
          <>
            <div className="w-1/2 flex flex-col">
              <CircuitCanvas
                onSelectComponent={(name) => setSelectedComp(name)}
                selectedComponent={selectedComp}
              />
            </div>
            <div className="w-1/2 flex flex-col">
              <PhysicalBoxSplitView />
            </div>
          </>
        )}
      </div>

      {/* BOTTOM HARDWARE SIGNAL TRACE LOG */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-3 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-[#222222] pb-1">
          <span>LIVE SIGNAL TRACE TIMELINE</span>
          <span className="text-emerald-400 font-normal">SAMPLING: 1000Hz EDGE LOGIC</span>
        </div>

        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2">
          {state.events.slice(-4).map((evt) => (
            <div key={evt.id} className="flex items-center justify-between text-[11px] bg-[#0a0a0a] px-3 py-1.5 rounded border border-[#1e1e1e]">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-mono">[{evt.timestamp}]</span>
                <span className={`font-bold ${evt.severity === 'CRITICAL' ? 'text-red-400' : evt.severity === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {evt.eventType}
                </span>
                <span className="text-slate-300">{evt.description}</span>
              </div>

              {evt.gpioOrProtocol && (
                <span className="bg-[#1a261f] text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono">
                  PIN: {evt.gpioOrProtocol}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

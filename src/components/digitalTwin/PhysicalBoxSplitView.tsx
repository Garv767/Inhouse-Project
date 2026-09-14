import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Pill, DoorOpen, DoorClosed } from 'lucide-react';

export const PhysicalBoxSplitView: React.FC = () => {
  const { state, openDoor, closeDoor, removeMedicine, restoreMedicine, selectHardwareComponent } = useSimulation();

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-xl space-y-4 select-none font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
        <span className="font-bold text-slate-200 flex items-center space-x-1.5 text-xs">
          <Pill className="w-4 h-4 text-emerald-400" />
          <span>PHYSICAL MEDICINE BOX ELEVATION</span>
        </span>
        <span className="text-[10px] text-slate-400">Total Chamber Weight: {state.weight.toFixed(1)}g</span>
      </div>

      {/* 4 Slots Grid A1-A4 */}
      <div className="grid grid-cols-2 gap-3">
        {(['A1', 'A2', 'A3', 'A4'] as const).map((cId) => {
          const comp = state.compartments[cId];
          return (
            <div
              key={cId}
              onClick={() => {
                selectHardwareComponent(`Compartment ${cId}`);
                if (comp.present) removeMedicine(cId);
                else restoreMedicine(cId);
              }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                comp.present
                  ? 'bg-[#161616] border-[#262626] hover:border-emerald-500'
                  : 'bg-amber-950/20 border-amber-800/80'
              }`}
            >
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-emerald-400 font-mono">SLOT {cId}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    comp.present ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}
                >
                  {comp.present ? 'PRESENT' : 'REMOVED'}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-200 truncate font-sans">{comp.medicineName}</div>
              <div className="text-[10px] text-slate-400 flex justify-between mt-2 font-mono">
                <span>{comp.present ? `${comp.weight.toFixed(1)}g` : '0.0g'}</span>
                <span className="text-[9px] text-slate-500">Toggle</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Door Access Switch Toggle */}
      <div
        onClick={() => (state.doorOpen ? closeDoor() : openDoor())}
        className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
          state.doorOpen ? 'bg-amber-950/30 border-amber-700' : 'bg-[#161616] border-[#262626] hover:border-emerald-500'
        }`}
      >
        <div className="flex items-center space-x-3">
          {state.doorOpen ? (
            <DoorOpen className="w-5 h-5 text-amber-400" />
          ) : (
            <DoorClosed className="w-5 h-5 text-emerald-400" />
          )}
          <div>
            <div className="font-bold text-slate-200">STORAGE DOOR SEAL</div>
            <div className="text-[10px] text-slate-400">
              State: <strong className={state.doorOpen ? 'text-amber-400' : 'text-emerald-400'}>{state.doorOpen ? 'OPEN (LOW)' : 'SEALED (HIGH)'}</strong>
            </div>
          </div>
        </div>

        <button className="bg-[#222222] hover:bg-[#333333] text-slate-200 px-3 py-1 rounded text-xs font-semibold border border-[#333333]">
          {state.doorOpen ? 'CLOSE DOOR' : 'OPEN DOOR'}
        </button>
      </div>
    </div>
  );
};

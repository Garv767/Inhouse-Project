import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Activity,
  Clock,
  Pill,
  AlertTriangle,
  Flame,
  ShieldCheck
} from 'lucide-react';
import type { CompartmentId } from '../../types/simulation';

export const MedicationPage: React.FC = () => {
  const { state, removeMedicine, restoreMedicine, simulateMissedDose } = useSimulation();

  const stateMachineNodes = [
    { id: 'SCHEDULED', label: '1. SCHEDULED', desc: 'Dose timing configured in RTC schedule.' },
    { id: 'DUE', label: '2. DUE', desc: 'Current RTC time matches scheduled dose.' },
    { id: 'REMINDER', label: '3. REMINDER', desc: 'LED & Buzzer indicators active.' },
    { id: 'PENDING', label: '4. PENDING', desc: 'Grace period window (±30 min).' },
    { id: 'TAKEN', label: '5A. TAKEN', desc: 'Door open + Load cell weight drop.' },
    { id: 'MISSED', label: '5B. MISSED', desc: 'Grace period expired without removal.' }
  ];

  const slots: CompartmentId[] = ['A1', 'A2', 'A3', 'A4'];

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* TOP HEADER & ADHERENCE METRICS STRIP */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Activity className="w-4 h-4" />
            <span>MEDICATION ADHERENCE & DOSE ENGINE</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time compliance tracking, dosage state machine evaluation, and load-cell verification.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#080808] border border-[#222222] px-3 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-slate-400">OVERALL ADHERENCE:</span>
            <span className="font-bold text-emerald-400 text-sm">{state.compliance}%</span>
          </div>

          <div className="bg-[#080808] border border-[#222222] px-3 py-2 rounded-lg flex items-center space-x-2">
            <span className="text-slate-400">ACTIVE STREAK:</span>
            <span className="font-bold text-amber-400 text-sm flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>7 DAYS</span>
            </span>
          </div>

          <button
            onClick={simulateMissedDose}
            className="bg-red-950/60 text-red-400 border border-red-800 hover:bg-red-900/50 px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SIMULATE MISSED DOSE</span>
          </button>
        </div>
      </div>

      {/* STATE MACHINE PIPELINE DIAGRAM */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 border-b border-[#222222] pb-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ESP32 FIRMWARE DOSE STATE MACHINE TRANSITIONS</span>
          </div>
          <span className="text-slate-500 font-normal text-[10px]">RTC CHECK FREQUENCY: 1.0Hz</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {stateMachineNodes.map((node) => {
            const isTaken = state.doseHistory.some((d) => d.status === 'TAKEN') && node.id === 'TAKEN';
            const isMissed = state.doseHistory.some((d) => d.status === 'MISSED') && node.id === 'MISSED';

            return (
              <div
                key={node.id}
                className={`p-3 rounded-lg border text-xs relative ${
                  isTaken
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : isMissed
                    ? 'bg-red-950/40 border-red-500 text-red-300'
                    : 'bg-[#0a0a0a] border-[#222222] text-slate-300'
                }`}
              >
                <div className="font-bold text-[11px] mb-1">{node.label}</div>
                <div className="text-[10px] text-slate-400 font-sans leading-tight">{node.desc}</div>

                {(isTaken || isMissed) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPARTMENT SLOTS A1-A4 & DOSE HISTORY TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* COMPARTMENT SLOTS (A1–A4) */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-1.5">
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>COMPARTMENT SLOTS (A1–A4)</span>
            </span>
            <span className="text-[10px] text-slate-500">4 SLOTS</span>
          </div>

          {slots.map((slotId) => {
            const comp = state.compartments[slotId];
            const sched = state.medicationSchedule.find((s) => s.compartmentId === slotId);

            return (
              <div
                key={slotId}
                className="bg-[#0a0a0a] border border-[#222222] p-3 rounded-lg text-xs space-y-2"
              >
                <div className="flex justify-between items-center font-bold text-slate-200">
                  <span className="text-emerald-400 font-mono">[{slotId}] {comp.medicineName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${comp.present ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {comp.present ? 'PRESENT' : 'REMOVED'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-sans">
                  Target Weight: <span className="font-mono text-slate-200">{comp.weight}g</span> | Sched: <span className="font-mono text-amber-400">{sched?.scheduledTime || '08:00 AM'}</span>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => (comp.present ? removeMedicine(slotId) : restoreMedicine(slotId))}
                    className="flex-1 bg-[#181818] hover:bg-[#222222] text-slate-300 border border-[#2b2b2b] py-1.5 rounded text-[10px] font-bold transition-all"
                  >
                    {comp.present ? `REMOVE (${slotId})` : `RESTORE (${slotId})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DOSE HISTORY TABLE */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>MEDICATION ADHERENCE DOSE LOG</span>
            </span>
            <span className="text-[10px] text-slate-500">AUDIT LOG</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#222222] text-slate-500 text-[10px]">
                  <th className="py-2 px-3">SLOT</th>
                  <th className="py-2 px-3">MEDICINE</th>
                  <th className="py-2 px-3">SCHEDULED</th>
                  <th className="py-2 px-3">ACTUAL</th>
                  <th className="py-2 px-3">DELAY</th>
                  <th className="py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {state.doseHistory.map((dose) => (
                  <tr key={dose.id} className="hover:bg-[#181818] text-slate-300">
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{dose.compartmentId}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-200">{dose.medicationName}</td>
                    <td className="py-2.5 px-3">{dose.scheduledTime}</td>
                    <td className="py-2.5 px-3">{dose.actualTime || '--:--'}</td>
                    <td className="py-2.5 px-3">{dose.delayMinutes > 0 ? `${dose.delayMinutes} min` : '0 min'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dose.status === 'TAKEN'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : dose.status === 'MISSED'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {dose.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

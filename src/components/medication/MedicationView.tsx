import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  HeartPulse,
  Clock,
  Pill,
  Info
} from 'lucide-react';

export const MedicationView: React.FC = () => {
  const { state, removeMedicine, simulateMissedDose } = useSimulation();

  const stateMachineNodes = [
    { id: 'SCHEDULED', label: '1. SCHEDULED', desc: 'Dose timing configured in RTC schedule.' },
    { id: 'DUE', label: '2. DUE', desc: 'Current RTC time reaches scheduled dose time.' },
    { id: 'REMINDER', label: '3. REMINDER', desc: 'Local LED & Buzzer indicators active.' },
    { id: 'PENDING', label: '4. PENDING', desc: 'Grace period running (15 min window).' },
    { id: 'TAKEN', label: '5A. TAKEN (SUCCESS)', desc: 'Valid container removal & weight drop.' },
    { id: 'MISSED', label: '5B. MISSED (EXPIRED)', desc: 'Grace period expires without removal.' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-cyan-400" />
            <span>MEDICATION COMPLIANCE & STATE MACHINE ENGINE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dose window detection logic, adherence rules, and patient dosage state tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#182542] border border-cyan-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            Overall Compliance: <strong className="text-cyan-400">{state.compliance}%</strong>
          </div>
          <button
            onClick={simulateMissedDose}
            className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-900"
          >
            SIMULATE MISSED DOSE
          </button>
        </div>
      </div>

      {/* MEDICATION STATE MACHINE DIAGRAM */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>ESP32 MEDICATION DOSAGE STATE MACHINE LOGIC</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 py-2">
          {stateMachineNodes.map((node) => {
            const isActive =
              node.id === 'TAKEN'
                ? state.doseHistory.some((d) => d.status === 'TAKEN')
                : node.id === 'MISSED'
                ? state.doseHistory.some((d) => d.status === 'MISSED')
                : true;

            return (
              <div
                key={node.id}
                className={`p-3 rounded-lg border text-xs transition-all relative ${
                  node.id === 'TAKEN'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : node.id === 'MISSED'
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                    : 'bg-[#18233b] border-[#293b61] text-slate-200'
                }`}
              >
                <div className="font-bold mb-1 font-mono text-[11px]">{node.label}</div>
                <p className="text-[10px] text-slate-400 leading-tight">{node.desc}</p>

                {isActive && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SCHEDULED MEDICATIONS LIST & TODAY'S DOSAGE TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SCHEDULED MEDS BY COMPARTMENT */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5 border-b border-[#1e293b] pb-2">
            <Pill className="w-4 h-4 text-cyan-400" />
            <span>CONFIGURED SCHEDULE (SLOTS A1–A4)</span>
          </h3>

          {state.medicationSchedule.map((med) => (
            <div
              key={med.id}
              className="bg-[#16223b] border border-[#253556] p-3 rounded-lg text-xs space-y-1"
            >
              <div className="flex justify-between items-center font-bold text-slate-200">
                <span className="text-cyan-400 font-mono">[{med.compartmentId}] {med.name}</span>
                <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  {med.scheduledTime}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">Dosage: {med.dosage} | Target Weight: {med.expectedWeight}g</div>
              <div className="text-[10px] text-slate-400 italic">{med.instructions}</div>

              <button
                onClick={() => removeMedicine(med.compartmentId)}
                className="mt-2 w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 py-1 rounded text-[11px] font-semibold transition-all"
              >
                Simulate Dose Removal (Slot {med.compartmentId})
              </button>
            </div>
          ))}
        </div>

        {/* DOSE HISTORY TABLE */}
        <div className="lg:col-span-2 bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5 border-b border-[#1e293b] pb-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>MEDICATION ADHERENCE DOSE LOG HISTORY</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1e293b] text-slate-400 text-[11px]">
                  <th className="py-2 px-3">SLOT</th>
                  <th className="py-2 px-3">MEDICINE</th>
                  <th className="py-2 px-3">SCHEDULED</th>
                  <th className="py-2 px-3">ACTUAL</th>
                  <th className="py-2 px-3">DELAY</th>
                  <th className="py-2 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {state.doseHistory.map((dose) => (
                  <tr key={dose.id} className="hover:bg-[#182542] text-slate-300">
                    <td className="py-2 px-3 text-cyan-400 font-bold">{dose.compartmentId}</td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-200">{dose.medicationName}</td>
                    <td className="py-2 px-3">{dose.scheduledTime}</td>
                    <td className="py-2 px-3">{dose.actualTime || '--:--'}</td>
                    <td className="py-2 px-3">{dose.delayMinutes > 0 ? `${dose.delayMinutes} min` : '0 min'}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dose.status === 'TAKEN'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : dose.status === 'MISSED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
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

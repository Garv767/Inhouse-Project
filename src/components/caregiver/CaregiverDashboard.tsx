import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bell, Clock, User, AlertTriangle } from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Caregiver Welcome Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>REMOTE CAREGIVER MONITORING DASHBOARD</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time patient medication compliance alerts and remote storage environment safety feed.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-[#182542] border border-cyan-800 text-cyan-300 px-3 py-1.5 rounded-lg font-mono">
            Patient ID: <strong>PAT-8902 (John Doe)</strong>
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-lg font-mono font-bold">
            MONITORING: ACTIVE
          </span>
        </div>
      </div>

      {/* TODAY'S DOSES CAREGIVER STATUS CARDS */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between border-b border-[#1e293b] pb-2">
          <span className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>TODAY'S SCHEDULED DOSAGE MONITOR</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Adherence Rate: {state.compliance}%</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.medicationSchedule.slice(0, 3).map((med, idx) => {
            const hist = state.doseHistory.find((d) => d.medicationId === med.id);
            const status = hist?.status || (idx === 2 ? 'PENDING' : 'TAKEN');

            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all ${
                  status === 'TAKEN'
                    ? 'bg-emerald-950/40 border-emerald-600/60'
                    : status === 'MISSED'
                    ? 'bg-rose-950/40 border-rose-600/60'
                    : 'bg-[#16223b] border-[#293a5e]'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-200 font-mono">{med.scheduledTime}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      status === 'TAKEN'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : status === 'MISSED'
                        ? 'bg-rose-950 text-rose-400 border border-rose-700'
                        : 'bg-amber-950 text-amber-400 border border-amber-700'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-cyan-300 truncate">{med.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">Slot {med.compartmentId} | {med.dosage}</div>

                {hist?.actualTime && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                    Taken at: {hist.actualTime} ({hist.delayMinutes}m delay)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE CAREGIVER ALERTS & NOTIFICATION STREAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ACTIVE ALERTS */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>ACTIVE CAREGIVER NOTIFICATIONS</span>
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {state.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                    : 'bg-[#18233b] border-[#293a5e] text-slate-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{alert.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">{alert.timestamp}</span>
                </div>
                <p className="text-[11px] mt-1 opacity-90">{alert.description}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>Category: {alert.category}</span>
                  <span>Source: {alert.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PATIENT CARE PROFILE & QUICK CONTACT */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>PATIENT & DEVICE PROFILE</span>
          </h3>

          <div className="bg-[#16223b] p-3 rounded-lg border border-[#27385c] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Patient Name:</span>
              <strong className="text-slate-200">John Doe (Age 68)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Physician:</span>
              <strong className="text-slate-200">Dr. Sarah Jenkins (Cardiology)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Caregiver Contact:</span>
              <strong className="text-cyan-400">+1 (555) 234-5678</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Smart Storage Device:</span>
              <strong className="font-mono text-emerald-400">{state.deviceId}</strong>
            </div>
          </div>

          <div className="bg-[#101b30] p-3 rounded-lg border border-[#1e2f54] text-xs space-y-1">
            <div className="font-bold text-cyan-300 mb-1">Caregiver Action Protocol:</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If medication is missed past 15 minute grace window or storage temperature exceeds 25°C for longer than 10 minutes, local ESP32 triggers buzzer alarm and dispatches SMS/email alert to caregiver console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

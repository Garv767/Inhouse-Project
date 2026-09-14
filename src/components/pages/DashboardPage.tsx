import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TempRegulatorGauge } from '../dashboard/TempRegulatorGauge';
import { HumidityTankGauge } from '../dashboard/HumidityTankGauge';
import {
  DoorClosed,
  DoorOpen,
  Weight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { state } = useSimulation();

  const activeAlerts = state.alerts.filter((a) => a.status === 'ACTIVE');
  const currentAlert = activeAlerts[0];

  return (
    <div className="space-y-6">
      {/* Top Instrument Grid: Temperature Regulator + Humidity Regulator + Today's Medication Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* TEMPERATURE GAUGE (4 cols) */}
        <div className="md:col-span-4">
          <TempRegulatorGauge
            temperature={state.temperature}
            minTemp={state.settings.tempMin}
            maxTemp={state.settings.tempMax}
          />
        </div>

        {/* HUMIDITY GAUGE (4 cols) */}
        <div className="md:col-span-4">
          <HumidityTankGauge
            humidity={state.humidity}
            minHumidity={state.settings.humidityMin}
            maxHumidity={state.settings.humidityMax}
          />
        </div>

        {/* TODAY'S MEDICATION STATUS LIST (4 cols) */}
        <div className="md:col-span-4 bg-[#121212] border border-[#222222] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-[#222222] pb-2 mb-3 text-xs">
            <span className="font-bold font-mono text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>MEDICATION TIMELINE</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Compliance: <strong className="text-emerald-400">{state.compliance}%</strong>
            </span>
          </div>

          {/* Simple Restrained List */}
          <div className="space-y-2.5 my-2">
            {state.medicationSchedule.slice(0, 3).map((med, idx) => {
              const hist = state.doseHistory.find((d) => d.medicationId === med.id);
              const status = hist?.status || (idx === 2 ? 'PENDING' : 'TAKEN');

              return (
                <div
                  key={med.id}
                  className="bg-[#161616] p-2.5 rounded border border-[#262626] flex justify-between items-center text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-slate-200">{med.scheduledTime}</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate max-w-[130px]">
                      Slot {med.compartmentId}: {med.name}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      status === 'TAKEN'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : status === 'MISSED'
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 font-mono border-t border-[#222222] pt-2">
            DS3231 RTC Time Sync Active
          </div>
        </div>
      </div>

      {/* SECONDARY INSTRUMENTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* DOOR STATUS */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>DOOR REED SWITCH</span>
            {state.doorOpen ? (
              <DoorOpen className="w-4 h-4 text-amber-400" />
            ) : (
              <DoorClosed className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="my-2">
            <div className={`text-xl font-bold font-mono ${state.doorOpen ? 'text-amber-400' : 'text-emerald-400'}`}>
              {state.doorOpen ? 'OPEN' : 'CLOSED'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">GPIO 18</span>
          </div>
        </div>

        {/* CHAMBER WEIGHT */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>HX711 LOAD CELL</span>
            <Weight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-slate-100 font-mono">
              {state.weight.toFixed(1)}g
            </div>
            <span className="text-[10px] text-slate-500 font-mono">GPIO 34 / ADC</span>
          </div>
        </div>

        {/* STORAGE HEALTH */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>STORAGE HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className={`text-xl font-bold font-mono ${state.storageHealth < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {state.storageHealth} / 100
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Project Score</span>
          </div>
        </div>

        {/* ACTIVE ALARM CARD */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>CURRENT ALARM</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-sm font-bold text-amber-400 font-mono truncate">
              {currentAlert ? currentAlert.title : 'NO ALERTS'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentAlert ? currentAlert.severity : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* TERTIARY SYSTEM HEALTH STRIP */}
      <div className="bg-[#0f0f0f] border border-[#222222] rounded-lg p-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <span className="text-slate-300 font-bold flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>SYSTEM HEALTH STRIP:</span>
        </span>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="text-slate-500">ESP32:</span>
            <strong className="text-emerald-400">● ONLINE</strong>
          </span>

          <span className="flex items-center space-x-1">
            <span className="text-slate-500">SENSORS:</span>
            <strong className="text-emerald-400">● CALIBRATED</strong>
          </span>

          <span className="flex items-center space-x-1">
            <span className="text-slate-500">RTC:</span>
            <strong className="text-emerald-400">● SYNCHRONIZED</strong>
          </span>

          <span className="flex items-center space-x-1">
            <span className="text-slate-500">WI-FI:</span>
            <strong className={state.wifiConnected ? 'text-emerald-400' : 'text-rose-400'}>
              {state.wifiConnected ? '● CONNECTED' : '○ DISCONNECTED'}
            </strong>
          </span>

          <span className="flex items-center space-x-1">
            <span className="text-slate-500">STORAGE:</span>
            <strong className="text-emerald-400">● SPIFFS READY</strong>
          </span>

          <span className="flex items-center space-x-1">
            <span className="text-slate-500">WEB SERVER:</span>
            <strong className="text-emerald-400">● PORT 80</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

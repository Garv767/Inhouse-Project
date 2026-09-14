import React from 'react';
import { Cpu, Database, Activity, ShieldCheck, ArrowRight, Server } from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  const nodes = [
    { title: '1. PHYSICAL MEDICINE STORAGE', desc: 'Medicine compartments A1-A4, magnet door seal, weight scale.', icon: Activity },
    { title: '2. HARDWARE SENSORS', desc: 'Reed switch (GPIO 18), DHT22 (GPIO 4), HX711 Load Cell (GPIO 34), DS3231 RTC (I2C).', icon: ShieldCheck },
    { title: '3. ESP32 EDGE CONTROLLER', desc: 'Dual-core FreeRTOS task scheduler processing GPIO interrupts & sensor sampling.', icon: Cpu },
    { title: '4. LOCAL EDGE LOGIC', desc: 'Medication window state machine & environmental threshold evaluation.', icon: Cpu },
    { title: '5. LOCAL STORAGE (NVS / SPIFFS)', desc: 'Buffered dosage records, system event logs, and settings.', icon: Database },
    { title: '6. ESP32 WEB SERVER', desc: 'Asynchronous HTTP WebServer & WebSocket broadcast engine on port 80.', icon: Server },
    { title: '7. CAREGIVER DASHBOARD', desc: 'Interactive Digital Twin UI providing real-time telemetry & alerts.', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>SYSTEM HARDWARE & SOFTWARE ARCHITECTURE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end block diagram detailing physical component signals through ESP32 edge processing to local web dashboard.
          </p>
        </div>

        <span className="bg-[#182542] border border-cyan-800 text-cyan-300 px-3 py-1 rounded text-xs font-mono">
          NO CLOUD DEPENDENCY — 100% LOCAL EDGE COMPUTING
        </span>
      </div>

      {/* ARCHITECTURE PIPELINE CARDS */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={idx}>
                <div className="bg-[#16223b] border border-[#27385c] p-3 rounded-lg text-center space-y-1.5 flex flex-col justify-between h-full hover:border-cyan-500 transition-all">
                  <Icon className="w-5 h-5 text-cyan-400 mx-auto" />
                  <div className="text-[11px] font-bold text-slate-200 leading-tight">{node.title}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">{node.desc}</p>
                </div>

                {idx < nodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-cyan-500 mx-auto hidden md:block shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

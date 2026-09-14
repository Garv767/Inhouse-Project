import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Activity,
  Zap,
  Cpu,
  Code2,
  Sliders,
  Database,
  BarChart3,
  Bell,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const VivaTracePanel: React.FC = () => {
  const { state } = useSimulation();

  const lastEvent = state.events[0] || {
    eventType: 'SYSTEM_STARTUP',
    source: 'ESP32 Core',
    gpioOrProtocol: 'UART 115200',
    firmwareFunction: 'setup()',
    description: 'System baseline operational.'
  };

  const chainNodes = [
    {
      step: '1. SENSOR',
      name: lastEvent.source || 'Reed Switch / DHT22',
      detail: lastEvent.relatedComponent || 'DOOR / SENSOR',
      icon: Activity,
      color: 'text-cyan-400 border-cyan-700 bg-cyan-950/60'
    },
    {
      step: '2. SIGNAL',
      name: lastEvent.gpioOrProtocol || 'GPIO 18 / ADC 34',
      detail: 'Electrical / Logic Pulse',
      icon: Zap,
      color: 'text-amber-400 border-amber-700 bg-amber-950/60'
    },
    {
      step: '3. ESP32 CPU',
      name: 'ESP32 Dual Core',
      detail: 'FreeRTOS Task ISR',
      icon: Cpu,
      color: 'text-blue-400 border-blue-700 bg-blue-950/60'
    },
    {
      step: '4. FIRMWARE',
      name: lastEvent.firmwareFunction || 'loop()',
      detail: 'C++ Task Execution',
      icon: Code2,
      color: 'text-purple-400 border-purple-700 bg-purple-950/60'
    },
    {
      step: '5. DECISION ENGINE',
      name: 'Edge Rule Evaluator',
      detail: 'Window & Temp Limits',
      icon: Sliders,
      color: 'text-emerald-400 border-emerald-700 bg-emerald-950/60'
    },
    {
      step: '6. SYSTEM EVENT',
      name: lastEvent.eventType,
      detail: lastEvent.description,
      icon: Activity,
      color: 'text-cyan-300 border-cyan-600 bg-cyan-950/80'
    },
    {
      step: '7. DATABASE',
      name: 'Local SPIFFS / NVS',
      detail: 'Dose Log & Event DB',
      icon: Database,
      color: 'text-indigo-400 border-indigo-700 bg-indigo-950/60'
    },
    {
      step: '8. ANALYTICS',
      name: `Compliance ${state.compliance}%`,
      detail: `Storage Health ${state.storageHealth}/100`,
      icon: BarChart3,
      color: 'text-emerald-300 border-emerald-600 bg-emerald-950/80'
    },
    {
      step: '9. ALERTS',
      name: state.alerts.length > 0 ? state.alerts[0].title : 'System Normal',
      detail: state.alerts.length > 0 ? state.alerts[0].severity : 'NO ALERTS',
      icon: Bell,
      color: 'text-rose-400 border-rose-700 bg-rose-950/60'
    },
    {
      step: '10. DASHBOARD',
      name: 'ESP32 Web Server UI',
      detail: 'Synchronized Twin',
      icon: LayoutDashboard,
      color: 'text-cyan-400 border-cyan-500 bg-cyan-950'
    }
  ];

  return (
    <div className="bg-[#0b1222] border border-purple-500/50 rounded-xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between border-b border-[#1b2b4d] pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider font-mono">
            VIVA ENGINEERING ARCHITECTURE TRACE PIPELINE
          </h3>
        </div>
        <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded font-mono">
          VIVA PRESENTATION MODE ACTIVE
        </span>
      </div>

      {/* 10-STEP VISUAL CHAIN */}
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-[1050px] py-2">
          {chainNodes.map((node, idx) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={idx}>
                <div className={`flex-1 p-2.5 rounded-lg border text-xs ${node.color} space-y-1`}>
                  <div className="text-[9px] font-mono opacity-80 uppercase tracking-wider">{node.step}</div>
                  <div className="font-bold truncate flex items-center space-x-1">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{node.name}</span>
                  </div>
                  <div className="text-[10px] opacity-90 truncate font-mono">{node.detail}</div>
                </div>

                {idx < chainNodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

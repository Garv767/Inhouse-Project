import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SettingsDrawer } from './SettingsDrawer';
import {
  Clock,
  Settings,
  GraduationCap,
  Sparkles,
  Battery
} from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'digitalTwin', onOpenSettings }) => {
  const { state, toggleVivaMode, runCompleteDemo } = useSimulation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    dashboard: 'DASHBOARD MONITORING CONSOLE',
    'digital-twin': 'DIGITAL TWIN SCHEMATIC WORKSPACE',
    medication: 'MEDICATION ADHERENCE STATE MACHINE',
    analytics: 'ENVIRONMENTAL & ADHERENCE ANALYTICS',
    events: 'SYSTEM OPERATIONAL LOG TIMELINE',
    code: 'REFERENCE EMBEDDED C/C++ FIRMWARE IDE'
  };

  return (
    <>
      <header className="bg-[#0f0f0f] border-b border-[#222222] px-4 py-2 flex flex-wrap items-center justify-between text-xs sticky top-0 z-30 select-none">
        {/* Left: Page Title */}
        <div className="flex items-center space-x-3">
          <h1 className="font-bold text-slate-100 uppercase tracking-wider font-mono text-sm">
            {pageTitles[activeTab] || 'ESP32 DIGITAL TWIN'}
          </h1>
        </div>

        {/* Right: Technical Indicators & System Strip */}
        <div className="flex items-center space-x-3">
          {/* Status Strip (Restrained Badges) */}
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono border-r border-[#222222] pr-3 text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="text-slate-500">ESP32</span>
              <span className={`w-1.5 h-1.5 rounded-full ${state.failures.powerFailed ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            </span>

            <span className="flex items-center space-x-1">
              <span className="text-slate-500">Wi-Fi</span>
              <span className={`w-1.5 h-1.5 rounded-full ${state.wifiConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            </span>

            <span className="flex items-center space-x-1">
              <span className="text-slate-500">RTC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>

            <span className="flex items-center space-x-1">
              <span className="text-slate-500">Sensors</span>
              <span className={`w-1.5 h-1.5 rounded-full ${state.sensorsOnline ? 'bg-emerald-400' : 'bg-amber-500'}`} />
            </span>

            <span className="flex items-center space-x-1 text-slate-300">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>{state.battery}%</span>
            </span>
          </div>

          {/* Simulation Clock */}
          <div className="flex items-center space-x-1 bg-[#161616] text-slate-200 px-2.5 py-1 rounded border border-[#262626] font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{state.currentSimulationTime.toLocaleTimeString()}</span>
          </div>

          {/* Complete Demo Trigger Button */}
          <button
            onClick={runCompleteDemo}
            className="flex items-center space-x-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold px-2.5 py-1 rounded text-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>RUN DEMO</span>
          </button>

          {/* Viva Mode Toggle */}
          <button
            onClick={toggleVivaMode}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-mono text-[11px] border transition-all ${
              state.isVivaMode
                ? 'bg-purple-950/80 text-purple-300 border-purple-600'
                : 'bg-[#161616] text-slate-400 border-[#262626] hover:text-slate-200'
            }`}
            title="Toggle Viva Presentation Architecture Overlay"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>VIVA MODE</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setIsSettingsOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-[#161616] hover:bg-[#222222] border border-[#262626] rounded transition-all"
            title="Open System Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

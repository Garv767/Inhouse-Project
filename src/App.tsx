import { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsDrawer } from './components/layout/SettingsDrawer';
import { DashboardPage } from './components/pages/DashboardPage';
import { DigitalTwinPage } from './components/pages/DigitalTwinPage';
import { MedicationPage } from './components/pages/MedicationPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { EventsPage } from './components/pages/EventsPage';
import { CodePage } from './components/pages/CodePage';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('digitalTwin');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state } = useSimulation();

  return (
    <div className="flex h-screen bg-[#080808] text-slate-100 overflow-hidden font-mono selection:bg-emerald-500 selection:text-slate-950">
      {/* PERSISTENT 56px LEFT NAVIGATION SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* SLIM TECHNICAL HEADER */}
        <Header activeTab={activeTab} onOpenSettings={() => setIsSettingsOpen(true)} />

        {/* VIVA MODE HIGHLIGHT BANNER */}
        {state.isVivaMode && (
          <div className="bg-[#10241b] border-b border-emerald-800/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-emerald-300 animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold">ENGINEERING VIVA / DEMO MODE ACTIVE</span>
              <span className="text-slate-400">| Signal tooltips, hardware pin traces, and FreeRTOS task details enabled.</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-[#0a1812] px-2 py-0.5 rounded border border-emerald-800">
              VIVA READY
            </span>
          </div>
        )}

        {/* MAIN SCROLLABLE CONTENT WORKSPACE */}
        <main className="flex-1 p-4 md:p-5 overflow-y-auto bg-[#080808]">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'digitalTwin' && <DigitalTwinPage />}
          {activeTab === 'medication' && <MedicationPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'events' && <EventsPage />}
          {activeTab === 'code' && <CodePage />}
        </main>
      </div>

      {/* SLIDE-OVER SETTINGS DRAWER MODAL */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  Play,
  Pause,
  FastForward,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flame,
  DoorOpen,
  DoorClosed,
  Pill,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { DEMO_STEPS } from '../../context/simulationLogic';

export const SimulationControls: React.FC = () => {
  const {
    state,
    startSimulation,
    pauseSimulation,
    stepSimulation,
    openDoor,
    closeDoor,
    removeMedicine,
    restoreMedicine,
    raiseTemperature,
    simulateMissedDose,
    toggleSensorFailure,
    toggleWifi,
    togglePower,
    toggleLowBattery,
    runCompleteDemo,
    stopDemo,
    nextDemoStep,
    prevDemoStep,
    setDemoStep
  } = useSimulation();

  const currentStepDef = state.isDemoRunning && state.currentDemoStep > 0
    ? DEMO_STEPS[state.currentDemoStep - 1]
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>LIVE SIMULATION COCKPIT & HARDWARE DEMO CONTROLS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operate the Digital Twin clock, step events, inject hardware faults, and run automated viva presentation mode.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={state.simulationRunning ? pauseSimulation : startSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              state.simulationRunning
                ? 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
            }`}
          >
            {state.simulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{state.simulationRunning ? 'PAUSE CLOCK' : 'START CLOCK'}</span>
          </button>

          <button
            onClick={stepSimulation}
            className="flex items-center space-x-1.5 bg-[#182542] hover:bg-[#25355c] text-cyan-300 border border-cyan-800 px-3 py-2 rounded-lg text-xs font-semibold"
          >
            <FastForward className="w-4 h-4" />
            <span>STEP EVENT</span>
          </button>
        </div>
      </div>

      {/* AUTOMATED 26-STEP VIVA DEMO RUNNER PANEL */}
      <div className="bg-[#111a2e] border border-cyan-500/50 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-[#1e293b] pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              AUTOMATED 26-STEP ENGINEERING DEMO & VIVA RUNNER
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {!state.isDemoRunning ? (
              <button
                onClick={runCompleteDemo}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-4 py-1.5 rounded text-xs shadow-md transition-all"
              >
                START 26-STEP DEMO
              </button>
            ) : (
              <button
                onClick={stopDemo}
                className="bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1.5 rounded text-xs font-bold hover:bg-rose-900"
              >
                STOP DEMO
              </button>
            )}
          </div>
        </div>

        {/* Demo Stepper Control & Narrator Banner */}
        {state.isDemoRunning && currentStepDef ? (
          <div className="bg-[#0c1424] border border-[#1b2b4d] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-cyan-400">
              <span>STEP {currentStepDef.stepIndex} / {currentStepDef.totalSteps}</span>
              <span>Firmware Function: <strong className="text-amber-400">{currentStepDef.firmwareFunction}</strong></span>
            </div>

            <h4 className="text-base font-bold text-slate-100">{currentStepDef.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStepDef.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#16233d] p-2.5 rounded border border-[#27395e]">
              <div>Target Hardware: <strong className="text-cyan-300">{currentStepDef.highlightedComponent}</strong></div>
              <div>Expected State: <strong className="text-emerald-300">{currentStepDef.expectedState}</strong></div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={prevDemoStep}
                disabled={state.currentDemoStep <= 1}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-1.5 rounded text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV STEP</span>
              </button>

              <div className="flex space-x-1">
                {DEMO_STEPS.map((s) => (
                  <button
                    key={s.stepIndex}
                    onClick={() => setDemoStep(s.stepIndex)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      s.stepIndex === state.currentDemoStep
                        ? 'bg-cyan-400 scale-125'
                        : s.stepIndex < state.currentDemoStep
                        ? 'bg-emerald-500'
                        : 'bg-slate-700'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>

              <button
                onClick={nextDemoStep}
                disabled={state.currentDemoStep >= DEMO_STEPS.length}
                className="flex items-center space-x-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white px-3 py-1.5 rounded text-xs font-semibold"
              >
                <span>NEXT STEP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Click 'START 26-STEP DEMO' to automatically step through system startup, sensor reads, dosage reminders, door opening, weight detection, missed dose grace period expiration, and environmental heat alerts.
          </p>
        )}
      </div>

      {/* MANUAL INTERACTIVE PHYSICAL TRIGGERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PHYSICAL ACTIONS */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <Pill className="w-4 h-4 text-cyan-400" />
            <span>MANUAL HARDWARE EVENT TRIGGERS</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={state.doorOpen ? closeDoor : openDoor}
              className="bg-[#16223b] hover:bg-[#25355c] text-slate-200 border border-[#27385c] p-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2"
            >
              {state.doorOpen ? <DoorClosed className="w-4 h-4 text-emerald-400" /> : <DoorOpen className="w-4 h-4 text-amber-400" />}
              <span>{state.doorOpen ? 'CLOSE DOOR' : 'OPEN DOOR'}</span>
            </button>

            <button
              onClick={() => (state.medicinePresent ? removeMedicine('A1') : restoreMedicine('A1'))}
              className="bg-[#16223b] hover:bg-[#25355c] text-emerald-300 border border-[#27385c] p-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2"
            >
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>{state.medicinePresent ? 'REMOVE MED A' : 'RESTORE MED A'}</span>
            </button>

            <button
              onClick={() => raiseTemperature(3.5)}
              className="bg-[#16223b] hover:bg-[#25355c] text-amber-300 border border-[#27385c] p-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>HEAT CHAMBER</span>
            </button>

            <button
              onClick={simulateMissedDose}
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 p-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>MISSED DOSE</span>
            </button>
          </div>
        </div>

        {/* HARDWARE FAILURE FAULT INJECTION */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>HARDWARE FAULT INJECTION & EDGE COMPUTING</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toggleSensorFailure('temp')}
              className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                state.failures.tempSensorFailed
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-[#16223b] text-slate-300 border-[#27385c]'
              }`}
            >
              Temp Sensor Fault: {state.failures.tempSensorFailed ? 'FAILED' : 'OK'}
            </button>

            <button
              onClick={toggleWifi}
              className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                !state.wifiConnected
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-[#16223b] text-slate-300 border-[#27385c]'
              }`}
            >
              Wi-Fi: {state.wifiConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </button>

            <button
              onClick={togglePower}
              className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                state.failures.powerFailed
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-[#16223b] text-slate-300 border-[#27385c]'
              }`}
            >
              Power: {state.failures.powerFailed ? 'BLACKOUT' : 'NORMAL (5V)'}
            </button>

            <button
              onClick={toggleLowBattery}
              className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                state.failures.lowBattery
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-[#16223b] text-slate-300 border-[#27385c]'
              }`}
            >
              Battery: {state.battery}%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

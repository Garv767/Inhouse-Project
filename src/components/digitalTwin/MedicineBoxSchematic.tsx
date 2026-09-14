import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  DoorClosed,
  DoorOpen,
  Thermometer,
  Weight,
  Volume2,
  Lightbulb,
  Cpu,
  Pill
} from 'lucide-react';

export const MedicineBoxSchematic: React.FC = () => {
  const {
    state,
    openDoor,
    closeDoor,
    removeMedicine,
    restoreMedicine,
    selectHardwareComponent,
    selectFirmwareFunction,
    triggerSignal
  } = useSimulation();

  const handleComponentClick = (
    name: string,
    firmwareFn: string,
    gpio: string,
    action?: () => void
  ) => {
    selectHardwareComponent(name);
    selectFirmwareFunction(firmwareFn);
    triggerSignal(name, 'ESP32', gpio.includes('I2C') ? 'I2C' : gpio.includes('ADC') ? 'ADC' : 'GPIO', gpio);
    if (action) action();
  };

  const isHighlighted = (compName: string) => state.highlightedHardwareComponent === compName;

  return (
    <div className="relative bg-[#0d1527] border border-[#1e293b] rounded-xl p-5 shadow-2xl overflow-hidden min-h-[460px]">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header Title & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-[#1e293b] pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>SMART MEDICINE ENCLOSURE — DIGITAL TWIN SCHEMATIC</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive physical schematic synchronized with ESP32 edge processing logic.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300">Active Sensor Signal</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Normal State</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">Warning / Violation</span>
            </span>
          </div>
        </div>

        {/* PHYSICAL BOX DIAGRAM CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: PHYSICAL COMPARTMENTS A1 - A4 */}
          <div className="lg:col-span-6 bg-[#131d33] border border-[#253556] rounded-lg p-4 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-[#253556] pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-cyan-400" />
                <span>STORAGE CHAMBER (COMPARTMENTS A1–A4)</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Weight Total: {state.weight.toFixed(1)}g
              </span>
            </div>

            {/* Compartment Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(['A1', 'A2', 'A3', 'A4'] as const).map((cId) => {
                const comp = state.compartments[cId];
                const isSelected = isHighlighted(`Compartment ${cId}`);
                return (
                  <div
                    key={cId}
                    onClick={() =>
                      handleComponentClick(
                        `Compartment ${cId}`,
                        'detectDoseEvent()',
                        'GPIO 34',
                        () => (comp.present ? removeMedicine(cId) : restoreMedicine(cId))
                      )
                    }
                    className={`cursor-pointer p-3 rounded-lg border transition-all relative ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-950'
                        : comp.present
                        ? 'bg-[#182542] border-[#2e4067] hover:border-cyan-500'
                        : 'bg-[#1e131d] border-amber-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-cyan-400 font-mono">SLOT {cId}</span>
                      {comp.present ? (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                          PRESENT
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded">
                          REMOVED
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-slate-200 truncate">{comp.medicineName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between mt-2 font-mono">
                      <span>{comp.present ? `${comp.weight.toFixed(1)}g` : '0.0g'}</span>
                      <span className="text-[10px] text-slate-500">Click to toggle</span>
                    </div>

                    {/* Sensor Wire Dot Indicator */}
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                );
              })}
            </div>

            {/* DOOR & REED SWITCH */}
            <div
              onClick={() =>
                handleComponentClick(
                  'DOOR / REED SWITCH',
                  'digitalRead(DOOR_PIN)',
                  'GPIO 18',
                  state.doorOpen ? closeDoor : openDoor
                )
              }
              className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all ${
                isHighlighted('DOOR / REED SWITCH')
                  ? 'bg-blue-950/80 border-blue-400 shadow-md shadow-blue-950'
                  : state.doorOpen
                  ? 'bg-amber-950/60 border-amber-600'
                  : 'bg-[#182542] border-[#2e4067] hover:border-blue-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                {state.doorOpen ? (
                  <DoorOpen className="w-6 h-6 text-amber-400 animate-bounce" />
                ) : (
                  <DoorClosed className="w-6 h-6 text-emerald-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <span>STORAGE DOOR & REED SWITCH</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      GPIO 18
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    State: <strong className={state.doorOpen ? 'text-amber-400' : 'text-emerald-400'}>{state.doorOpen ? 'OPEN (LOW)' : 'CLOSED (HIGH)'}</strong>
                  </div>
                </div>
              </div>
              <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded font-semibold border border-slate-700">
                {state.doorOpen ? 'CLOSE DOOR' : 'OPEN DOOR'}
              </button>
            </div>
          </div>

          {/* CENTER & RIGHT: ESP32 MICROCONTROLLER NODE & SENSORS */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            
            {/* ESP32 CONTROLLER BOARD NODE */}
            <div
              onClick={() =>
                handleComponentClick('ESP32', 'loop()', 'INTERNAL', undefined)
              }
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isHighlighted('ESP32')
                  ? 'bg-cyan-950 border-cyan-400 shadow-xl shadow-cyan-950/50'
                  : 'bg-gradient-to-br from-[#121c35] to-[#0f172a] border-cyan-700/60 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center justify-between border-b border-cyan-800/60 pb-2 mb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-cyan-300 font-mono">ESP32-WROOM-32 CONTROLLER</h4>
                    <p className="text-[10px] text-slate-400">Dual-Core Tensilica LX6 @ 240MHz | FreeRTOS</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                  CPU: {state.failures.powerFailed ? 'OFFLINE' : 'RUNNING'}
                </span>
              </div>

              {/* Pin Map Badges */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">GPIO 18:</span> <strong className="text-cyan-300">DOOR REED</strong>
                </div>
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">GPIO 4:</span> <strong className="text-cyan-300">DHT22 TEMP</strong>
                </div>
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">GPIO 34:</span> <strong className="text-cyan-300">LOAD CELL ADC</strong>
                </div>
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">I2C (0x68):</span> <strong className="text-cyan-300">DS3231 RTC</strong>
                </div>
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">GPIO 21:</span> <strong className="text-cyan-300">BUZZER</strong>
                </div>
                <div className="bg-[#182744] p-1.5 rounded border border-[#2b3e66]">
                  <span className="text-slate-400">GPIO 2:</span> <strong className="text-cyan-300">LED STATUS</strong>
                </div>
              </div>

              {/* Current Active Task */}
              <div className="mt-3 bg-slate-900/80 p-2 rounded text-xs flex items-center justify-between border border-slate-800">
                <span className="text-slate-400">Active Firmware Task:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {state.currentFirmwareFunction || 'loop()'}
                </span>
              </div>
            </div>

            {/* SENSORS & ACTUATORS PANEL */}
            <div className="grid grid-cols-2 gap-3">
              {/* DHT22 TEMP/HUMIDITY */}
              <div
                onClick={() =>
                  handleComponentClick('TEMPERATURE SENSOR', 'readSensors()', 'GPIO 4')
                }
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  isHighlighted('TEMPERATURE SENSOR')
                    ? 'bg-blue-950 border-blue-400'
                    : state.temperature > state.settings.tempMax
                    ? 'bg-rose-950/60 border-rose-600'
                    : 'bg-[#131d33] border-[#253556] hover:border-cyan-500'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-1">
                  <Thermometer className={`w-4 h-4 ${state.temperature > state.settings.tempMax ? 'text-rose-400' : 'text-cyan-400'}`} />
                  <span>DHT22 TEMP / HUMIDITY</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1 flex justify-between">
                  <span>Temp: <strong className="text-cyan-300">{state.temperature}°C</strong></span>
                  <span>RH: <strong className="text-cyan-300">{state.humidity}%</strong></span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Interface: GPIO 4 / OneWire</div>
              </div>

              {/* LOAD CELL WEIGHT */}
              <div
                onClick={() =>
                  handleComponentClick('LOAD CELL', 'readLoadCell()', 'GPIO 34 ADC')
                }
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  isHighlighted('LOAD CELL')
                    ? 'bg-blue-950 border-blue-400'
                    : 'bg-[#131d33] border-[#253556] hover:border-cyan-500'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-1">
                  <Weight className="w-4 h-4 text-emerald-400" />
                  <span>HX711 LOAD CELL</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  Weight: <strong className="text-emerald-300">{state.weight.toFixed(1)}g</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Interface: GPIO 34 / ADC</div>
              </div>

              {/* BUZZER */}
              <div
                onClick={() =>
                  handleComponentClick('BUZZER', 'triggerBuzzer()', 'GPIO 21')
                }
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  state.hardwareOutputs.buzzer !== 'OFF'
                    ? 'bg-amber-950/80 border-amber-500 animate-pulse'
                    : 'bg-[#131d33] border-[#253556] hover:border-cyan-500'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-1">
                  <Volume2 className={`w-4 h-4 ${state.hardwareOutputs.buzzer !== 'OFF' ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                  <span>BUZZER ALARM</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  State: <strong className={state.hardwareOutputs.buzzer !== 'OFF' ? 'text-amber-400' : 'text-slate-400'}>{state.hardwareOutputs.buzzer}</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Interface: GPIO 21 Output</div>
              </div>

              {/* LED STATUS */}
              <div
                onClick={() =>
                  handleComponentClick('LED', 'updateStatusLED()', 'GPIO 2')
                }
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  state.hardwareOutputs.led === 'WARNING'
                    ? 'bg-rose-950/80 border-rose-500'
                    : 'bg-[#131d33] border-[#253556] hover:border-cyan-500'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-1">
                  <Lightbulb className={`w-4 h-4 ${state.hardwareOutputs.led === 'WARNING' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                  <span>STATUS LED</span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  State: <strong className={state.hardwareOutputs.led === 'WARNING' ? 'text-rose-400' : 'text-emerald-400'}>{state.hardwareOutputs.led}</strong>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Interface: GPIO 2 Output</div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE TRAVELLING SIGNALS FOOTER STREAM */}
        <div className="mt-4 bg-[#0a101f] border border-[#1e2d4a] rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400">SIGNAL BUS:</span>
            {state.activeSignals.length > 0 ? (
              <span className="text-cyan-300 font-semibold truncate max-w-md">
                {state.activeSignals[state.activeSignals.length - 1].payload}
              </span>
            ) : (
              <span className="text-slate-500 italic">Bus idle — Continuous polling @ 1000ms</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Click any component to trace signal flow
          </span>
        </div>
      </div>
    </div>
  );
};

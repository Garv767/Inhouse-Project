import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Cpu,
  Thermometer,
  DoorOpen,
  Weight,
  Clock,
  Volume2,
  Battery
} from 'lucide-react';

interface CircuitCanvasProps {
  onSelectComponent: (compName: string) => void;
  selectedComponent: string | null;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  onSelectComponent,
  selectedComponent
}) => {
  const { state } = useSimulation();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const isSelected = (name: string) => selectedComponent === name;

  return (
    <div className="relative flex-1 bg-[#080808] border border-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between select-none min-h-[560px]">
      {/* Background Engineering Grid */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity ${
          showGrid ? 'opacity-100 engineering-grid' : 'opacity-0'
        }`}
      />

      {/* TOP CANVAS TOOLBAR */}
      <div className="relative z-20 bg-[#0f0f0f]/90 backdrop-blur-xs px-4 py-2 border-b border-[#222222] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">SCHEMATIC CANVAS WORKSPACE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Scale: {Math.round(zoomLevel * 100)}%</span>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-1 text-slate-400 hover:text-slate-200 bg-[#181818] border border-[#262626] rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1 text-slate-400 hover:text-slate-200 bg-[#181818] border border-[#262626] rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-slate-400 hover:text-slate-200 bg-[#181818] border border-[#262626] rounded text-[10px] font-bold px-1.5"
            title="Fit Canvas"
          >
            FIT
          </button>
          <button
            onClick={() => setShowGrid((g) => !g)}
            className={`p-1 border rounded ${showGrid ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-[#181818] text-slate-400 border-[#262626]'}`}
            title="Toggle Engineering Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG SCHEMATIC CANVAS AREA */}
      <div className="relative z-10 flex-1 overflow-auto p-6 flex items-center justify-center">
        <div
          className="relative transition-transform duration-300 transform-gpu w-[900px] h-[480px]"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* ORTHOGONAL SVG WIRES LAYER */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 900 480">
            {/* POWER WIRES (Amber dashed) */}
            {/* Power Reg OUT (130, 240) -> ESP32 5V (340, 240) */}
            <path d="M 130 240 L 340 240" className="wire-power-line" />
            <text x="220" y="233" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">5V</text>

            {/* ESP32 3.3V (440, 280) -> Sensors Bus Vertical (530) */}
            <path d="M 440 280 L 530 280 L 530 80 L 580 80" className="wire-power-line" />
            <path d="M 530 180 L 580 180" className="wire-power-line" />
            <path d="M 530 280 L 580 280" className="wire-power-line" />
            <path d="M 530 380 L 580 380" className="wire-power-line" />
            <text x="480" y="273" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">3.3V</text>

            {/* DATA WIRES (Solid Green) */}
            {/* Sensor 1: HX711 Load Cell (580, 80) -> ESP32 GPIO 34 (440, 210) */}
            <path d="M 580 80 L 490 80 L 490 210 L 440 210" className="wire-data-line" />
            <text x="500" y="73" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">gpio 34</text>

            {/* Sensor 2: Door Reed Switch (580, 180) -> ESP32 GPIO 18 (440, 230) */}
            <path d="M 580 180 L 470 180 L 470 230 L 440 230" className="wire-data-line" />
            <text x="500" y="173" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">gpio 18</text>

            {/* Sensor 3: RTC DS3231 I2C (580, 280) -> ESP32 I2C (440, 250) */}
            <path d="M 580 280 L 490 280 L 490 250 L 440 250" className="wire-data-line" />
            <text x="500" y="273" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">i2c</text>

            {/* Sensor 4: DHT22 Temp (580, 380) -> ESP32 GPIO 4 (440, 270) */}
            <path d="M 580 380 L 510 380 L 510 270 L 440 270" className="wire-data-line" />
            <text x="500" y="373" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">gpio 4</text>

            {/* Actuator 1: Buzzer (580, 40) -> ESP32 GPIO 21 (440, 190) */}
            <path d="M 440 190 L 530 190 L 530 40 L 750 40" className="wire-data-line" />
            <text x="610" y="33" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">gpio 21</text>

            {/* ANIMATED PULSE PARTICLES */}
            {state.activeSignals.map((sig) => {
              return (
                <circle
                  key={sig.id}
                  r="4"
                  fill="#34d399"
                  className="animate-ping"
                  cx={340 + (sig.progress / 100) * 100}
                  cy={240}
                />
              );
            })}
          </svg>

          {/* COMPONENT BLOCKS LAYER */}

          {/* 1. POWER / BATTERY REGULATOR (Left) */}
          <div
            onClick={() => onSelectComponent('POWER SUPPLY')}
            className={`absolute left-[20px] top-[170px] w-[140px] bg-[#121212] border rounded-lg p-3 cursor-pointer z-10 transition-all ${
              isSelected('POWER SUPPLY') ? 'border-amber-400 shadow-lg shadow-amber-950' : 'border-[#262626] hover:border-amber-500'
            }`}
          >
            <div className="text-[9px] font-mono text-amber-400 uppercase tracking-wider font-bold">POWER</div>
            <div className="text-xs font-bold text-slate-100 truncate">Battery Regulator</div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">TP4056 Charger</div>

            <div className="w-full h-14 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center p-1 my-1">
              <Battery className="w-8 h-8 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-1 text-[8px] font-mono mt-2">
              <span className="bg-[#181818] text-amber-400 px-1 py-0.5 rounded text-center">OUT+</span>
              <span className="bg-[#181818] text-slate-400 px-1 py-0.5 rounded text-center">GND</span>
            </div>
          </div>

          {/* 2. MCU / ESP32 EDGE LOGIC CONTROLLER (Center) */}
          <div
            onClick={() => onSelectComponent('ESP32')}
            className={`absolute left-[300px] top-[150px] w-[150px] bg-[#121212] border rounded-xl p-3.5 cursor-pointer z-10 transition-all ${
              isSelected('ESP32') ? 'border-emerald-400 shadow-xl shadow-emerald-950' : 'border-emerald-700/60 hover:border-emerald-400'
            }`}
          >
            <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
              <span>MCU</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs font-bold text-slate-100">Edge Logic Controller</div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">ESP32-WROOM-32E</div>

            <div className="w-full h-16 bg-[#0a0a0a] rounded border border-[#222222] flex flex-col items-center justify-center p-1 my-1">
              <Cpu className="w-8 h-8 text-emerald-400" />
              <span className="text-[9px] font-mono text-slate-400 mt-1">Dual-Core 240MHz</span>
            </div>

            {/* Pin Badges */}
            <div className="grid grid-cols-3 gap-1 text-[8px] font-mono mt-2">
              <span className="bg-[#1a2e26] text-emerald-300 px-1 py-0.5 rounded text-center">GPIO2</span>
              <span className="bg-[#1a2e26] text-emerald-300 px-1 py-0.5 rounded text-center">GPIO4</span>
              <span className="bg-[#1a2e26] text-emerald-300 px-1 py-0.5 rounded text-center">GPIO18</span>
              <span className="bg-[#1a2e26] text-emerald-300 px-1 py-0.5 rounded text-center">GPIO21</span>
              <span className="bg-[#1a2e26] text-emerald-300 px-1 py-0.5 rounded text-center">GPIO34</span>
              <span className="bg-[#2e261a] text-amber-400 px-1 py-0.5 rounded text-center">5V</span>
            </div>
          </div>

          {/* 3. SENSOR / PRESENCE LOAD CELL (Top Right) */}
          <div
            onClick={() => onSelectComponent('LOAD CELL')}
            className={`absolute left-[580px] top-[40px] w-[150px] bg-[#121212] border rounded-lg p-3 cursor-pointer z-10 transition-all ${
              isSelected('LOAD CELL') ? 'border-emerald-400 shadow-lg' : 'border-[#262626] hover:border-emerald-500'
            }`}
          >
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">SENSOR</div>
            <div className="text-xs font-bold text-slate-100 truncate">Presence Load Cell</div>
            <div className="text-[10px] text-slate-400 font-mono mb-1">HX711 Amplifier</div>

            <div className="w-full h-12 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center p-1">
              <Weight className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="grid grid-cols-4 gap-1 text-[7px] font-mono mt-2">
              <span className="bg-[#181818] text-amber-400 px-0.5 py-0.5 rounded text-center">VCC</span>
              <span className="bg-[#181818] text-slate-400 px-0.5 py-0.5 rounded text-center">GND</span>
              <span className="bg-[#181818] text-emerald-400 px-0.5 py-0.5 rounded text-center">DT</span>
              <span className="bg-[#181818] text-emerald-400 px-0.5 py-0.5 rounded text-center">SCK</span>
            </div>
          </div>

          {/* 4. SENSOR / DOOR ACCESS SENSOR (Middle Right) */}
          <div
            onClick={() => onSelectComponent('DOOR / REED SWITCH')}
            className={`absolute left-[580px] top-[145px] w-[150px] bg-[#121212] border rounded-lg p-3 cursor-pointer z-10 transition-all ${
              isSelected('DOOR / REED SWITCH') ? 'border-emerald-400 shadow-lg' : 'border-[#262626] hover:border-emerald-500'
            }`}
          >
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">SENSOR</div>
            <div className="text-xs font-bold text-slate-100 truncate">Door Access Sensor</div>
            <div className="text-[10px] text-slate-400 font-mono mb-1">Magnetic Reed Switch</div>

            <div className="w-full h-12 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center p-1">
              <DoorOpen className={`w-6 h-6 ${state.doorOpen ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>

            <div className="grid grid-cols-2 gap-1 text-[8px] font-mono mt-2">
              <span className="bg-[#181818] text-emerald-400 px-1 py-0.5 rounded text-center">SIG (GPIO18)</span>
              <span className="bg-[#181818] text-slate-400 px-1 py-0.5 rounded text-center">GND</span>
            </div>
          </div>

          {/* 5. MODULE / PRECISION CLOCK DS3231 (Lower Middle Right) */}
          <div
            onClick={() => onSelectComponent('RTC')}
            className={`absolute left-[580px] top-[250px] w-[150px] bg-[#121212] border rounded-lg p-3 cursor-pointer z-10 transition-all ${
              isSelected('RTC') ? 'border-emerald-400 shadow-lg' : 'border-[#262626] hover:border-emerald-500'
            }`}
          >
            <div className="text-[9px] font-mono text-purple-400 uppercase tracking-wider font-bold">MODULE</div>
            <div className="text-xs font-bold text-slate-100 truncate">Precision Clock</div>
            <div className="text-[10px] text-slate-400 font-mono mb-1">DS3231 RTC Module</div>

            <div className="w-full h-12 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center p-1">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>

            <div className="grid grid-cols-4 gap-1 text-[7px] font-mono mt-2">
              <span className="bg-[#181818] text-amber-400 px-0.5 py-0.5 rounded text-center">VCC</span>
              <span className="bg-[#181818] text-slate-400 px-0.5 py-0.5 rounded text-center">GND</span>
              <span className="bg-[#181818] text-purple-400 px-0.5 py-0.5 rounded text-center">SDA</span>
              <span className="bg-[#181818] text-purple-400 px-0.5 py-0.5 rounded text-center">SCL</span>
            </div>
          </div>

          {/* 6. SENSOR / ENVIRONMENT MONITOR DHT22 (Bottom Right) */}
          <div
            onClick={() => onSelectComponent('TEMPERATURE SENSOR')}
            className={`absolute left-[580px] top-[355px] w-[150px] bg-[#121212] border rounded-lg p-3 cursor-pointer z-10 transition-all ${
              isSelected('TEMPERATURE SENSOR') ? 'border-emerald-400 shadow-lg' : 'border-[#262626] hover:border-emerald-500'
            }`}
          >
            <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">SENSOR</div>
            <div className="text-xs font-bold text-slate-100 truncate">Environment Monitor</div>
            <div className="text-[10px] text-slate-400 font-mono mb-1">SHT31-D / DHT22</div>

            <div className="w-full h-12 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center p-1">
              <Thermometer className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="grid grid-cols-3 gap-1 text-[7px] font-mono mt-2">
              <span className="bg-[#181818] text-amber-400 px-0.5 py-0.5 rounded text-center">VCC</span>
              <span className="bg-[#181818] text-slate-400 px-0.5 py-0.5 rounded text-center">GND</span>
              <span className="bg-[#181818] text-emerald-400 px-0.5 py-0.5 rounded text-center">DAT(GPIO4)</span>
            </div>
          </div>

          {/* 7. ACTUATOR / AUDIBLE ALARM BUZZER (Far Top Right) */}
          <div
            onClick={() => onSelectComponent('BUZZER')}
            className={`absolute left-[750px] top-[15px] w-[130px] bg-[#121212] border rounded-lg p-2.5 cursor-pointer z-10 transition-all ${
              state.hardwareOutputs.buzzer !== 'OFF' ? 'border-amber-400 bg-amber-950/20' : 'border-[#262626]'
            }`}
          >
            <div className="text-[8px] font-mono text-amber-400 uppercase tracking-wider font-bold">ACTUATOR</div>
            <div className="text-xs font-bold text-slate-100 truncate">Audible Alarm</div>
            <div className="text-[9px] text-slate-400 font-mono mb-1">Piezo Buzzer</div>

            <div className="w-full h-10 bg-[#0a0a0a] rounded border border-[#222222] flex items-center justify-center">
              <Volume2 className={`w-5 h-5 ${state.hardwareOutputs.buzzer !== 'OFF' ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

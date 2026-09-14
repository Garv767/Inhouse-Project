import React from 'react';
import { Thermometer } from 'lucide-react';

interface TempGaugeProps {
  temperature: number;
  minTemp: number;
  maxTemp: number;
}

export const TempRegulatorGauge: React.FC<TempGaugeProps> = ({ temperature, minTemp, maxTemp }) => {
  const isHigh = temperature > maxTemp;
  const isLow = temperature < minTemp;

  // Map temperature range 10°C to 35°C to angle -120deg to +120deg
  const clampedTemp = Math.max(10, Math.min(35, temperature));
  const angle = ((clampedTemp - 10) / (35 - 10)) * 240 - 120;

  // Generate tick marks from 10 to 35
  const ticks = [10, 15, 20, 25, 30, 35];

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-xl p-5 shadow-lg flex flex-col justify-between items-center text-slate-100 relative">
      <div className="w-full flex justify-between items-center border-b border-[#222222] pb-2 mb-3 text-xs">
        <span className="font-bold font-mono text-slate-300 flex items-center space-x-1.5">
          <Thermometer className={`w-4 h-4 ${isHigh ? 'text-rose-400' : 'text-emerald-400'}`} />
          <span>TEMPERATURE REGULATOR</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">DHT22 (GPIO 4)</span>
      </div>

      {/* CIRCULAR ANALOG REGULATOR DIAL */}
      <div className="relative w-48 h-48 flex items-center justify-center my-2">
        {/* SVG Dial Face */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Arc */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="8"
            strokeDasharray="226 75"
          />

          {/* Normal Operating Zone Arc (15°C to 25°C) */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#059669"
            strokeWidth="8"
            strokeDasharray="90 211"
            strokeDashoffset="-30"
          />

          {/* Warning Over-Limit Zone Arc (25°C to 35°C) */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#dc2626"
            strokeWidth="8"
            strokeDasharray="90 211"
            strokeDashoffset="-120"
          />

          {/* Tick Marks */}
          {ticks.map((t) => {
            const tickAngle = (((t - 10) / 25) * 240 - 120) * (Math.PI / 180);
            const x1 = 60 + 40 * Math.cos(tickAngle);
            const y1 = 60 + 40 * Math.sin(tickAngle);
            const x2 = 60 + 46 * Math.cos(tickAngle);
            const y2 = 60 + 46 * Math.sin(tickAngle);
            return (
              <line
                key={t}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666666"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Center Needle Pointer */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none gauge-needle"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-1 h-20 bg-gradient-to-t from-slate-400 via-rose-500 to-rose-400 rounded-full shadow-md transform -translate-y-6" />
          <div className="absolute w-4 h-4 bg-slate-200 rounded-full border-2 border-[#121212] shadow-md" />
        </div>

        {/* Numeric Readout Overlay */}
        <div className="absolute bottom-4 text-center">
          <div className="text-2xl font-extrabold font-mono text-slate-100">
            {temperature.toFixed(1)}°C
          </div>
          <div
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-1 ${
              isHigh
                ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                : isLow
                ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
            }`}
          >
            {isHigh ? 'HIGH WARNING' : isLow ? 'LOW WARNING' : 'NORMAL'}
          </div>
        </div>
      </div>

      {/* Min / Max Range Info */}
      <div className="w-full flex justify-between text-[11px] font-mono text-slate-400 border-t border-[#222222] pt-2">
        <span>MIN: <strong className="text-slate-200">{minTemp}°C</strong></span>
        <span>RANGE: <strong className="text-emerald-400">15–25°C</strong></span>
        <span>MAX: <strong className="text-slate-200">{maxTemp}°C</strong></span>
      </div>
    </div>
  );
};

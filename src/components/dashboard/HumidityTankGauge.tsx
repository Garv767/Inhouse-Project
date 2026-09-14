import React from 'react';
import { Droplets } from 'lucide-react';

interface HumidityGaugeProps {
  humidity: number;
  minHumidity: number;
  maxHumidity: number;
}

export const HumidityTankGauge: React.FC<HumidityGaugeProps> = ({
  humidity,
  minHumidity,
  maxHumidity
}) => {
  const isNormal = humidity >= minHumidity && humidity <= maxHumidity;
  const percentage = Math.max(0, Math.min(100, humidity));

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-xl p-5 shadow-lg flex flex-col justify-between items-center text-slate-100 relative">
      <div className="w-full flex justify-between items-center border-b border-[#222222] pb-2 mb-3 text-xs">
        <span className="font-bold font-mono text-slate-300 flex items-center space-x-1.5">
          <Droplets className="w-4 h-4 text-emerald-400" />
          <span>HUMIDITY REGULATOR</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">DHT22 (GPIO 4)</span>
      </div>

      {/* SEMI-CIRCULAR GAUGE */}
      <div className="relative w-48 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full" viewBox="0 0 120 70">
          {/* Background Arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Optimal Target Zone Arc (30-60%) */}
          <path
            d="M 35 25 A 50 50 0 0 1 85 25"
            fill="none"
            stroke="#059669"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Value Progress Arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={isNormal ? '#10b981' : '#f59e0b'}
            strokeWidth="5"
            strokeDasharray="157"
            strokeDashoffset={157 - (percentage / 100) * 157}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Readout Overlay */}
        <div className="absolute bottom-2 text-center">
          <div className="text-2xl font-extrabold font-mono text-slate-100">
            {humidity}% <span className="text-xs text-slate-400 font-normal">RH</span>
          </div>
          <div
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-1 ${
              isNormal
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-amber-950/80 text-amber-400 border-amber-800'
            }`}
          >
            {isNormal ? 'OPTIMAL' : 'OUT OF LIMITS'}
          </div>
        </div>
      </div>

      {/* Min / Max Range Info */}
      <div className="w-full flex justify-between text-[11px] font-mono text-slate-400 border-t border-[#222222] pt-2">
        <span>MIN: <strong className="text-slate-200">{minHumidity}%</strong></span>
        <span>TARGET: <strong className="text-emerald-400">30–60% RH</strong></span>
        <span>MAX: <strong className="text-slate-200">{maxHumidity}%</strong></span>
      </div>
    </div>
  );
};

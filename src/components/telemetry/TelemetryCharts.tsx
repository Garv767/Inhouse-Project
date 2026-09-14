import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Thermometer, Weight } from 'lucide-react';

export const TelemetryCharts: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* TEMPERATURE & HUMIDITY CHART */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 mb-3">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>ENVIRONMENTAL TELEMETRY HISTORY (°C & % RH)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Rolling 50 Points</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.sensorHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="temp" domain={[10, 35]} stroke="#38bdf8" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="hum" orientation="right" domain={[20, 90]} stroke="#818cf8" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <ReferenceLine yAxisId="temp" y={state.settings.tempMax} label={{ value: 'Max Temp Limit (25°C)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
              <ReferenceLine yAxisId="temp" y={state.settings.tempMin} label={{ value: 'Min Temp Limit (15°C)', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="4 4" />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="hum" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#818cf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* WEIGHT TELEMETRY CHART */}
      <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 mb-3">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
            <Weight className="w-4 h-4 text-emerald-400" />
            <span>LOAD CELL CHAMBER WEIGHT HISTORY (GRAMS)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">HX711 ADC 34</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={state.sensorHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 80]} stroke="#34d399" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Line type="stepAfter" dataKey="weight" name="Weight (g)" stroke="#34d399" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

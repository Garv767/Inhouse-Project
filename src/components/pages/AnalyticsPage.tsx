import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { BarChart3, TrendingUp, Sparkles, Thermometer, Droplets, Weight } from 'lucide-react';
import { generateAnalyticsInsights, predictMissProbability } from '../../context/simulationLogic';

export const AnalyticsPage: React.FC = () => {
  const { state } = useSimulation();

  const insights = generateAnalyticsInsights(state.doseHistory, state.sensorHistory, state.alerts);
  const eveningRisk = predictMissProbability('EVENING', state.compliance, state.temperature > state.settings.tempMax);
  const morningRisk = predictMissProbability('MORNING', state.compliance, false);

  // SVG sparkline generator for telemetry charts
  const renderSparkline = (data: number[], min: number, max: number, color: string) => {
    if (!data || data.length === 0) return null;
    const width = 360;
    const height = 60;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const normalizedVal = (val - min) / (max - min || 1);
        const y = height - Math.max(0, Math.min(height, normalizedVal * height));
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-16 overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
      </svg>
    );
  };

  const tempPoints = state.sensorHistory.map((s) => s.temperature);
  const humPoints = state.sensorHistory.map((s) => s.humidity);
  const weightPoints = state.sensorHistory.map((s) => s.weight);

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* TOP HEADER */}
      <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>INDUSTRIAL TELEMETRY & ADHERENCE ANALYTICS</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Sensor historical trends, dosage delay metrics, and rule-based compliance prediction.
          </p>
        </div>

        <div className="bg-[#080808] border border-[#222222] text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-mono">
          EXPLAINABLE RULE-BASED ENGINE
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">AVG DOSAGE DELAY</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono my-1">
            {insights.averageDelayMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Within target ±15 min grace window</div>
        </div>

        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">EVENING MISS RATE</div>
          <div className="text-2xl font-bold text-amber-400 font-mono my-1">
            {insights.eveningMissRate}% <span className="text-xs text-slate-400 font-normal">rate</span>
          </div>
          <div className="text-[10px] text-slate-500 font-sans">vs {insights.morningMissRate}% Morning Miss Rate</div>
        </div>

        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">CONSECUTIVE MISSED DOSES</div>
          <div className={`text-2xl font-bold font-mono my-1 ${insights.consecutiveMisses >= 2 ? 'text-red-400' : 'text-emerald-400'}`}>
            {insights.consecutiveMisses} <span className="text-xs text-slate-400 font-normal">doses</span>
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Alert threshold trigger: ≥ 2 misses</div>
        </div>
      </div>

      {/* RESTRAINED BLACK-AND-WHITE SVG TELEMETRY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CHART 1: TEMPERATURE */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>CHAMBER TEMP (°C)</span>
            </span>
            <span className="text-emerald-400 font-bold">{state.temperature}°C</span>
          </div>
          <div className="bg-[#080808] p-3 rounded-lg border border-[#1e1e1e]">
            {renderSparkline(tempPoints, 15, 35, '#10b981')}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Range: 15°C - 35°C</span>
            <span>Target Operating Zone: 15–25°C</span>
          </div>
        </div>

        {/* CHART 2: HUMIDITY */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
              <Droplets className="w-4 h-4 text-amber-400" />
              <span>RELATIVE HUMIDITY (%RH)</span>
            </span>
            <span className="text-amber-400 font-bold">{state.humidity}%</span>
          </div>
          <div className="bg-[#080808] p-3 rounded-lg border border-[#1e1e1e]">
            {renderSparkline(humPoints, 30, 80, '#f59e0b')}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Range: 30% - 80%</span>
            <span>Max Threshold: 60% RH</span>
          </div>
        </div>

        {/* CHART 3: LOAD CELL WEIGHT */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-1.5 text-slate-300 font-bold">
              <Weight className="w-4 h-4 text-emerald-400" />
              <span>LOAD CELL WEIGHT (g)</span>
            </span>
            <span className="text-emerald-400 font-bold">{state.weight.toFixed(1)}g</span>
          </div>
          <div className="bg-[#080808] p-3 rounded-lg border border-[#1e1e1e]">
            {renderSparkline(weightPoints, 0, 150, '#10b981')}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>HX711 ADC Precision</span>
            <span>4 Compartments Total</span>
          </div>
        </div>
      </div>

      {/* RULE BASED INSIGHTS & SIMULATED ML PREDICTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RULE BASED INSIGHTS */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-[#222222] pb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>EXPLAINABLE RULE-BASED INSIGHTS</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222222]">
              <div className="font-bold text-emerald-400 mb-1">Primary Behavioral Observation:</div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{insights.primaryObservation}</p>
            </div>

            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222222]">
              <div className="font-bold text-emerald-400 mb-1">Dosage Timing Observation:</div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{insights.secondaryObservation}</p>
            </div>

            <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#222222]">
              <div className="font-bold text-emerald-400 mb-1">Environmental Stability:</div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{insights.environmentalStability}</p>
            </div>
          </div>
        </div>

        {/* SIMULATED ML PREDICTION */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-[#222222] pb-2">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>SIMULATED ML ADHERENCE PREDICTION</span>
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
              SIMULATED ML
            </span>
          </div>

          <div className="bg-[#0a0a0a] border border-[#222222] p-4 rounded-lg space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Morning Dose Risk Probability:</span>
              <strong className="text-emerald-400 font-mono text-sm">{morningRisk}% Low Risk</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Evening Dose Risk Probability:</span>
              <strong className="text-amber-400 font-mono text-sm">{eveningRisk}% Elevated Risk</strong>
            </div>

            <div className="mt-3 pt-2 border-t border-[#222222] text-[10px] text-slate-500 font-sans italic">
              * SIMULATED ML PREDICTION — Weighted adherence risk calculated based on historical delay window and temperature thresholds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

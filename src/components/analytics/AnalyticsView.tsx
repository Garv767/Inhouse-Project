import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { generateAnalyticsInsights, predictMissProbability } from '../../context/simulationLogic';

export const AnalyticsView: React.FC = () => {
  const { state } = useSimulation();

  const insights = generateAnalyticsInsights(state.doseHistory, state.sensorHistory, state.alerts);
  const eveningRisk = predictMissProbability('EVENING', state.compliance, state.temperature > state.settings.tempMax);
  const morningRisk = predictMissProbability('MORNING', state.compliance, false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>MEDICATION COMPLIANCE ANALYTICS & RULE-BASED INSIGHTS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Adherence patterns, dosage intake delays, deterministic rule engine, and simulated ML risk prediction.
          </p>
        </div>

        <span className="bg-[#182542] border border-cyan-800 text-cyan-300 px-3 py-1 rounded text-xs font-mono">
          EXPLAINABLE RULE-BASED ENGINE
        </span>
      </div>

      {/* 3 ANALYTICS KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 font-mono">AVERAGE DOSAGE DELAY</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono my-1">
            {insights.averageDelayMinutes} <span className="text-sm text-slate-400">minutes</span>
          </div>
          <div className="text-[11px] text-slate-400">Within optimal 15-min window</div>
        </div>

        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 font-mono">EVENING MISS FREQUENCY</div>
          <div className="text-2xl font-bold text-amber-400 font-mono my-1">
            {insights.eveningMissRate}% <span className="text-sm text-slate-400">miss rate</span>
          </div>
          <div className="text-[11px] text-slate-400">vs {insights.morningMissRate}% Morning Miss Rate</div>
        </div>

        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-4 shadow-xl">
          <div className="text-xs text-slate-400 font-mono">CONSECUTIVE MISSED DOSES</div>
          <div className={`text-2xl font-bold font-mono my-1 ${insights.consecutiveMisses >= 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {insights.consecutiveMisses} <span className="text-sm text-slate-400">consecutive</span>
          </div>
          <div className="text-[11px] text-slate-400">Alert threshold: ≥ 2 misses</div>
        </div>
      </div>

      {/* RULE-BASED INSIGHTS & SIMULATED ML PREDICTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RULE BASED INSIGHTS */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2 border-b border-[#1e293b] pb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>EXPLAINABLE RULE-BASED INSIGHTS</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-[#18233b] p-3 rounded-lg border border-[#27375a]">
              <div className="font-bold text-cyan-300 mb-1">Primary Behavioral Observation:</div>
              <p className="text-slate-300 leading-relaxed">{insights.primaryObservation}</p>
            </div>

            <div className="bg-[#18233b] p-3 rounded-lg border border-[#27375a]">
              <div className="font-bold text-cyan-300 mb-1">Dosage Timing Observation:</div>
              <p className="text-slate-300 leading-relaxed">{insights.secondaryObservation}</p>
            </div>

            <div className="bg-[#18233b] p-3 rounded-lg border border-[#27375a]">
              <div className="font-bold text-cyan-300 mb-1">Environmental Observation:</div>
              <p className="text-slate-300 leading-relaxed">{insights.environmentalStability}</p>
            </div>
          </div>
        </div>

        {/* SIMULATED ML PREDICTION */}
        <div className="bg-[#111a2e] border border-[#1e293b] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>SIMULATED ML ADHERENCE PREDICTION</span>
            </h3>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">
              SIMULATED ML MODEL
            </span>
          </div>

          <div className="bg-[#171329] border border-purple-900/60 p-4 rounded-lg space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Morning Dose Risk Probability:</span>
              <strong className="text-emerald-400 font-mono text-sm">{morningRisk}% Low Risk</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Evening Dose Risk Probability:</span>
              <strong className="text-amber-400 font-mono text-sm">{eveningRisk}% Elevated Risk</strong>
            </div>

            <div className="mt-3 pt-2 border-t border-purple-900/60 text-[10px] text-purple-300 italic">
              * SIMULATED ML PREDICTION — NOT CLINICALLY VALIDATED. Simple weighted adherence risk model.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

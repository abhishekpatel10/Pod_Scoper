import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Percent,
  RotateCcw,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { RoiAssumptions } from '../types/scope';

interface RoiSensitivityPanelProps {
  sampleId?: string | null;
  onAssumptionsChange?: (calculated: {
    grossAnnualValue: number;
    annualLaborSaved: number;
    annualPenaltiesAvoided: number;
    paybackWeeks: number;
    roiMultiple: number;
    assumptions: RoiAssumptions;
  }) => void;
}

const DEFAULT_ASSUMPTIONS_BY_SAMPLE: Record<string, RoiAssumptions> = {
  logistics: {
    monthlyVolume: 4000,
    specialistHourlyRate: 45,
    minutesPerUnit: 25,
    targetAutomationRate: 80,
    monthlyPenalties: 80000,
  },
  healthcare: {
    monthlyVolume: 2200,
    specialistHourlyRate: 62,
    minutesPerUnit: 25,
    targetAutomationRate: 75,
    monthlyPenalties: 150000,
  },
  fintech: {
    monthlyVolume: 8500,
    specialistHourlyRate: 55,
    minutesPerUnit: 15,
    targetAutomationRate: 85,
    monthlyPenalties: 65000,
  },
};

const GLOBAL_DEFAULT: RoiAssumptions = {
  monthlyVolume: 3500,
  specialistHourlyRate: 50,
  minutesPerUnit: 20,
  targetAutomationRate: 80,
  monthlyPenalties: 60000,
};

export const RoiSensitivityPanel: React.FC<RoiSensitivityPanelProps> = ({
  sampleId,
  onAssumptionsChange,
}) => {
  const getInitial = (): RoiAssumptions => {
    if (sampleId && DEFAULT_ASSUMPTIONS_BY_SAMPLE[sampleId]) {
      return { ...DEFAULT_ASSUMPTIONS_BY_SAMPLE[sampleId] };
    }
    return { ...GLOBAL_DEFAULT };
  };

  const [assumptions, setAssumptions] = useState<RoiAssumptions>(getInitial());
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'base' | 'aggressive'>('base');

  // Reset when sample changes
  useEffect(() => {
    const init = getInitial();
    setAssumptions(init);
    setActiveScenario('base');
  }, [sampleId]);

  // Financial Calculations
  const sprintCost = 38500; // Tenex Fixed 14-Day Pod Investment
  const annualUnits = assumptions.monthlyVolume * 12;
  const annualHours = (annualUnits * assumptions.minutesPerUnit) / 60;
  const annualGrossLaborWaste = annualHours * assumptions.specialistHourlyRate;
  const annualLaborSaved = annualGrossLaborWaste * (assumptions.targetAutomationRate / 100);

  const annualGrossPenalties = assumptions.monthlyPenalties * 12;
  const annualPenaltiesAvoided = annualGrossPenalties * (assumptions.targetAutomationRate / 100);

  const totalGrossAnnualBenefit = annualLaborSaved + annualPenaltiesAvoided;
  const netYear1Value = totalGrossAnnualBenefit - sprintCost;
  const roiMultiple = totalGrossAnnualBenefit > 0 ? totalGrossAnnualBenefit / sprintCost : 0;
  const paybackWeeks = totalGrossAnnualBenefit > 0 ? (sprintCost / totalGrossAnnualBenefit) * 52 : 0;

  // Propagate to parent if callback provided
  useEffect(() => {
    if (onAssumptionsChange) {
      onAssumptionsChange({
        grossAnnualValue: totalGrossAnnualBenefit,
        annualLaborSaved,
        annualPenaltiesAvoided,
        paybackWeeks,
        roiMultiple,
        assumptions,
      });
    }
  }, [assumptions, totalGrossAnnualBenefit, onAssumptionsChange]);

  const handleScenarioChange = (scenario: 'conservative' | 'base' | 'aggressive') => {
    setActiveScenario(scenario);
    const base = getInitial();

    if (scenario === 'conservative') {
      setAssumptions({
        ...base,
        monthlyVolume: Math.round(base.monthlyVolume * 0.75),
        targetAutomationRate: Math.max(40, base.targetAutomationRate - 15),
      });
    } else if (scenario === 'base') {
      setAssumptions(base);
    } else if (scenario === 'aggressive') {
      setAssumptions({
        ...base,
        monthlyVolume: Math.round(base.monthlyVolume * 1.25),
        targetAutomationRate: Math.min(95, base.targetAutomationRate + 10),
      });
    }
  };

  const handleReset = () => {
    setActiveScenario('base');
    setAssumptions(getInitial());
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Calculator className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive ROI Sensitivity & Financial Engine
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Real-Time Dynamic
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stress-test financial return by toggling friction volume, automation rates, and penalty avoidance.
          </p>
        </div>

        {/* Quick Scenario Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => handleScenarioChange('conservative')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeScenario === 'conservative'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conservative
            </button>
            <button
              type="button"
              onClick={() => handleScenarioChange('base')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeScenario === 'base'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Base Case
            </button>
            <button
              type="button"
              onClick={() => handleScenarioChange('aggressive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeScenario === 'aggressive'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aggressive
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            title="Reset to transcript baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-Time Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 relative overflow-hidden shadow-xs">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3" />
            Gross Annual Value
          </div>
          <div className="text-xl font-extrabold text-emerald-900 font-mono tracking-tight">
            {formatCurrency(totalGrossAnnualBenefit)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Labor + Penalty Avoidance</div>
        </div>

        <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3" />
            Tenex Pod ROI Multiple
          </div>
          <div className="text-xl font-extrabold text-indigo-900 font-mono tracking-tight">
            {roiMultiple.toFixed(1)}x
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Based on $38,500 Sprint Fee</div>
        </div>

        <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            Payback Period
          </div>
          <div className="text-xl font-extrabold text-cyan-900 font-mono tracking-tight">
            {paybackWeeks < 1 ? '< 1 week' : `${paybackWeeks.toFixed(1)} wks`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Breakeven on Pod Delivery</div>
        </div>

        <div className="bg-violet-50/60 border border-violet-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[10px] font-bold text-violet-800 uppercase tracking-wider flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3" />
            Net Year 1 Margin
          </div>
          <div className="text-xl font-extrabold text-violet-900 font-mono tracking-tight">
            {formatCurrency(netYear1Value)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Gross Impact minus Pod Fee</div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-xs">
        {/* Slider 1: Monthly Volume */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">Monthly Exception / Unit Volume:</span>
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-xs">
              {assumptions.monthlyVolume.toLocaleString()} units/mo
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={20000}
            step={250}
            value={assumptions.monthlyVolume}
            onChange={(e) => setAssumptions({ ...assumptions, monthlyVolume: Number(e.target.value) })}
            className="w-full accent-indigo-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>500</span>
            <span>10,000</span>
            <span>20,000 units</span>
          </div>
        </div>

        {/* Slider 2: Specialist Loaded Hourly Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">Fully Burdened Specialist Wage:</span>
            <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-xs">
              ${assumptions.specialistHourlyRate}/hr
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={150}
            step={5}
            value={assumptions.specialistHourlyRate}
            onChange={(e) => setAssumptions({ ...assumptions, specialistHourlyRate: Number(e.target.value) })}
            className="w-full accent-emerald-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>$25/hr</span>
            <span>$85/hr</span>
            <span>$150/hr</span>
          </div>
        </div>

        {/* Slider 3: Minutes Spent per Exception */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">Manual Time Spent per Unit:</span>
            <span className="font-mono font-bold text-cyan-800 bg-white px-2 py-0.5 rounded border border-cyan-200 shadow-xs">
              {assumptions.minutesPerUnit} mins / unit
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={assumptions.minutesPerUnit}
            onChange={(e) => setAssumptions({ ...assumptions, minutesPerUnit: Number(e.target.value) })}
            className="w-full accent-cyan-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>5 mins</span>
            <span>30 mins</span>
            <span>60 mins</span>
          </div>
        </div>

        {/* Slider 4: Pod Target Automation Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium flex items-center gap-1">
              <Percent className="w-3 h-3 text-indigo-600" />
              Target Pod Automation Rate:
            </span>
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-xs">
              {assumptions.targetAutomationRate}%
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            step={5}
            value={assumptions.targetAutomationRate}
            onChange={(e) => setAssumptions({ ...assumptions, targetAutomationRate: Number(e.target.value) })}
            className="w-full accent-indigo-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>40% (Conservative)</span>
            <span>80% (Base)</span>
            <span>95% (High-Bar)</span>
          </div>
        </div>

        {/* Slider 5: Avoidable Monthly Penalties / Disputes */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Monthly Penalty / Detention / Demurrage / Dispute Bleed:
            </span>
            <span className="font-mono font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200 shadow-xs">
              {formatCurrency(assumptions.monthlyPenalties)}/mo
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={5000}
            value={assumptions.monthlyPenalties}
            onChange={(e) => setAssumptions({ ...assumptions, monthlyPenalties: Number(e.target.value) })}
            className="w-full accent-rose-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>$0/mo</span>
            <span>$100,000/mo</span>
            <span>$200,000/mo</span>
          </div>
        </div>
      </div>

      {/* Formula Transparency Callout */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-800">C-Suite Grounding Methodology:</span>
          <p>
            Labor savings calculated as <code className="text-slate-800 bg-white border border-slate-200 px-1 py-0.5 rounded font-mono">({assumptions.monthlyVolume.toLocaleString()} units × 12 × {assumptions.minutesPerUnit} min ÷ 60) × ${assumptions.specialistHourlyRate}/hr × {assumptions.targetAutomationRate}% = {formatCurrency(annualLaborSaved)}/yr</code>. Penalty recovery: <code className="text-slate-800 bg-white border border-slate-200 px-1 py-0.5 rounded font-mono">{formatCurrency(assumptions.monthlyPenalties)} × 12 × {assumptions.targetAutomationRate}% = {formatCurrency(annualPenaltiesAvoided)}/yr</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

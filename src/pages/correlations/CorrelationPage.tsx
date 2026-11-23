import React, { useEffect, useState } from 'react';
import {
  Network,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CorrelationAnalysis, Parameter, DefectCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';

export const CorrelationPage: React.FC = () => {
  const { selectedLine } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine !== 'ALL' ? selectedLine : 'D2');
  const [parameterCode, setParameterCode] = useState<string>('MOISTURE');
  const [defectCode, setDefectCode] = useState<string>('POROSITY');
  const [lagHours, setLagHours] = useState<number>(12);

  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [defects, setDefects] = useState<DefectCategory[]>([]);
  const [analysis, setAnalysis] = useState<CorrelationAnalysis | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [pData, dData] = await Promise.all([
          api.getParameters('PHYSICAL'),
          api.getDefects()
        ]);
        setParameters(pData);
        setDefects(dData);
      } catch (err) {
        console.error('Failed to load lookups', err);
      }
    };
    loadLookups();
  }, []);

  const loadCorrelation = async () => {
    setLoading(true);
    try {
      const [pairRes, candidatesRes] = await Promise.all([
        api.getCorrelationPair(lineCode, parameterCode, defectCode, lagHours),
        api.getCandidateRootCauses(lineCode, lagHours)
      ]);
      setAnalysis(pairRes);
      setCandidates(candidatesRes.candidates || []);
    } catch (err) {
      console.error('Failed to load correlation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCorrelation();
  }, [lineCode, parameterCode, defectCode, lagHours]);

  const lags = [0, 6, 12, 24, 48, 72];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-600" />
            SAND QUALITY & CASTING DEFECT CORRELATION ENGINE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Time-lagged association analysis between upstream green sand parameters and downstream casting defects.
          </p>
        </div>

        {/* Lag Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Process Lag Window:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {lags.map(lag => (
              <button
                key={lag}
                onClick={() => setLagHours(lag)}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                  lagHours === lag
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lag === 0 ? 'Same Shift' : `${lag}h`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Production Line</label>
          <select
            value={lineCode}
            onChange={e => setLineCode(e.target.value)}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2"
          >
            <option value="D1">Line D1 (Automotive Blocks)</option>
            <option value="D2">Line D2 (Transmission Housings)</option>
            <option value="D3">Line D3 (Hydraulic Pumps)</option>
            <option value="D4">Line D4 (Valve Bodies)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sand Parameter (X-Axis)</label>
          <select
            value={parameterCode}
            onChange={e => setParameterCode(e.target.value)}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2"
          >
            {parameters.map(p => (
              <option key={p.code} value={p.code}>{p.name} ({p.unit})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Defect Category (Y-Axis)</label>
          <select
            value={defectCode}
            onChange={e => setDefectCode(e.target.value)}
            className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2"
          >
            {defects.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            onClick={() => loadCorrelation()}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Compute Correlation
          </button>
        </div>
      </div>

      {/* Mandatory Non-Causal Regulatory Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-blue-800">
          <Info className="w-4 h-4 text-blue-600" />
          Statistical Methodology & Non-Causal Standard
        </div>
        <p className="text-[11px] text-blue-800 leading-relaxed">
          <b>Important:</b> Correlation does not prove causation. Statistical associations identified by this engine represent potential contributing factors to guide structured engineering investigations (8D/Fishbone). Never claim a sand parameter caused a defect without independent metallurgical and physical root-cause verification.
        </p>
      </div>

      {/* Statistical Metrics Summary Banner */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Pearson Coefficient (r)</div>
            <div className={`text-2xl font-black mt-1 ${Math.abs(analysis.pearson_r) >= 0.5 ? 'text-blue-700' : 'text-slate-800'}`}>
              {analysis.pearson_r > 0 ? `+${analysis.pearson_r}` : analysis.pearson_r}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">p-value: <b>{analysis.pearson_p_value}</b> ({analysis.is_statistically_significant ? 'p < 0.05 Sig.' : 'Not Sig.'})</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Spearman Rank (ρ)</div>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {analysis.spearman_rho > 0 ? `+${analysis.spearman_rho}` : analysis.spearman_rho}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Monotonic Relationship Test</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Scrap Risk Ratio</div>
            <div className={`text-2xl font-black mt-1 ${analysis.group_comparison.rejection_ratio && analysis.group_comparison.rejection_ratio > 1.5 ? 'text-rose-600' : 'text-slate-800'}`}>
              {analysis.group_comparison.rejection_ratio ? `${analysis.group_comparison.rejection_ratio}x` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              High Group ({analysis.group_comparison.mean_rejection_high_group || 0}%) vs Normal ({analysis.group_comparison.mean_rejection_normal_group || 0}%)
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Relationship Strength</div>
            <div className="mt-2">
              <StatusBadge status={analysis.relationship_strength} />
            </div>
            <div className="text-[10px] text-slate-400 mt-2">Sample Size: {analysis.sample_size} paired records</div>
          </div>
        </div>
      )}

      {/* Main Scatter Plot & Candidate Causes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Time-Lagged Scatter Plot ({analysis?.parameter_name} vs {analysis?.defect_name} Rejection Rate)
              </h2>
              <p className="text-xs text-slate-400">
                Lag: {lagHours} hours on Line {lineCode}. Red dots denote observations where sand measured out of specification.
              </p>
            </div>
          </div>

          <div className="h-72">
            {analysis?.scatter_points && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="x_sand"
                    name={analysis.parameter_name}
                    unit={` ${analysis.parameter_unit}`}
                    tick={{ fontSize: 10 }}
                    label={{ value: `${analysis.parameter_name} (${analysis.parameter_unit})`, position: 'insideBottom', offset: -10, fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y_rejection"
                    name="Scrap %"
                    unit="%"
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Rejection Rate (%)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any, name?: any) => [val, name ?? '']}
                  />

                  {/* Specification Boundaries */}
                  {analysis.usl && (
                    <ReferenceLine x={analysis.usl} stroke="#e11d48" strokeDasharray="3 3" label={{ value: `USL ${analysis.usl}`, fill: '#e11d48', fontSize: 10 }} />
                  )}
                  {analysis.lsl && (
                    <ReferenceLine x={analysis.lsl} stroke="#e11d48" strokeDasharray="3 3" label={{ value: `LSL ${analysis.lsl}`, fill: '#e11d48', fontSize: 10 }} />
                  )}

                  <Scatter
                    name="Observations"
                    data={analysis.scatter_points}
                    fill="#3b82f6"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={payload.is_out_of_spec ? 6 : 4}
                          fill={payload.is_out_of_spec ? '#e11d48' : '#2563eb'}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Structured Analytical Insight Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Engineered Correlation Insight:
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {analysis?.insight}
            </p>
          </div>
        </div>

        {/* Candidate Root Causes Scan (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Candidate Root Causes ({candidates.length})
              </h3>
              <p className="text-[11px] text-slate-400">Automated multi-factor scan</p>
            </div>
            <Link to="/root-cause" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              5-Why <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {candidates.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No strong statistical correlations detected at {lagHours}h lag on Line {lineCode}.
              </div>
            ) : (
              candidates.map((c, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setParameterCode(c.parameter_code);
                    setDefectCode(c.defect_code);
                  }}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 cursor-pointer transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{c.parameter_name} &rarr; {c.defect_name}</span>
                    <span className="font-black text-rose-600 font-mono">r = +{c.pearson_r}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Rejection Ratio: <b>{c.rejection_ratio}x higher</b> when sand out of spec
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold pt-1">
                    Click to load scatter details &rarr;
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

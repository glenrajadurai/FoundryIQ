import React, { useEffect, useState } from 'react';
import {
  LineChart as LineChartIcon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Info,
  Sliders,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Scatter
} from 'recharts';
import { api } from '../../services/api';
import { IMRChartData, Parameter } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';

export const SPCAnalyticsPage: React.FC = () => {
  const { selectedLine, quickView } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine !== 'ALL' ? selectedLine : 'D1');
  const [parameterCode, setParameterCode] = useState<string>('MOISTURE');
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [chartData, setChartData] = useState<IMRChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load Parameters
  useEffect(() => {
    const loadParams = async () => {
      try {
        const data = await api.getParameters('PHYSICAL');
        setParameters(data);
        if (data.length > 0 && !parameterCode) {
          setParameterCode(data[0].code);
        }
      } catch (err) {
        console.error('Failed to load parameters', err);
      }
    };
    loadParams();
  }, []);

  const loadChart = async () => {
    if (!parameterCode) return;
    setLoading(true);
    try {
      const data = await api.getIMRChart(lineCode, parameterCode);
      setChartData(data);
    } catch (err) {
      console.error('Failed to load I-MR chart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart();
  }, [lineCode, parameterCode]);

  // Points with Nelson rule violations
  const violationPoints = chartData?.points.filter(p => p.is_out_of_control || p.violations.length > 0) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-600" />
            AUTOMATED STATISTICAL PROCESS CONTROL (SPC) ENGINE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Individuals and Moving Range (I-MR) control charts with Nelson 8 Rules automated out-of-control detection.
          </p>
        </div>

        {/* Line & Parameter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['D1', 'D2', 'D3', 'D4'].map(code => (
              <button
                key={code}
                onClick={() => setLineCode(code)}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                  lineCode === code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Line {code}
              </button>
            ))}
          </div>

          <select
            value={parameterCode}
            onChange={e => setParameterCode(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            {parameters.map(p => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>

          <button
            onClick={() => loadChart()}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200"
            title="Refresh SPC"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Control Summary Banner */}
      {chartData && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Center Line (X̄)</div>
            <div className="text-xl font-black text-slate-900">{chartData.mean} <span className="text-xs font-normal text-slate-500">{chartData.unit}</span></div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Upper Control Limit (UCL)</div>
            <div className="text-xl font-black text-rose-700">{chartData.i_chart?.ucl}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Lower Control Limit (LCL)</div>
            <div className="text-xl font-black text-rose-700">{chartData.i_chart?.lcl}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Sigma Within (σ̂w = MR̄/d2)</div>
            <div className="text-xl font-black text-blue-700">{chartData.sigma_within}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Statistical Stability</div>
            <div className="mt-0.5">
              <StatusBadge status={chartData.is_stable ? 'CONFORMING' : 'CRITICAL'} size="sm" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Nelson Violations</div>
            <div className={`text-xl font-black ${chartData.violations_count > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {chartData.violations_count} points
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODE for SPC: Concise pass/fail matrix */}
      {quickView && chartData && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-slate-700 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              ★ SHOP-FLOOR QUICK PROCESS SUMMARY — {chartData.parameter_name} ({lineCode})
            </span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded ${chartData.is_stable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {chartData.is_stable ? 'PROCESS STABLE' : 'OUT OF STATISTICAL CONTROL'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">CURRENT MEAN</div>
              <div className="text-2xl font-black text-yellow-400">{chartData.mean} {chartData.unit}</div>
              <div className="text-[10px] text-slate-400 mt-1">Target: {chartData.points[0]?.cl ?? '—'}</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">CONTROL LIMITS (3σ)</div>
              <div className="text-sm font-bold text-slate-200 mt-1">
                LCL <span className="font-black text-rose-400">{chartData.i_chart.lcl}</span> — UCL <span className="font-black text-rose-400">{chartData.i_chart.ucl}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Tolerance: {chartData.lsl ?? '—'} to {chartData.usl ?? '—'}</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">MOVING RANGE MR̄</div>
              <div className="text-2xl font-black text-blue-400">{chartData.mean_mr}</div>
              <div className="text-[10px] text-slate-400 mt-1">Short-term variability</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] font-bold text-slate-400 uppercase">OUT OF CONTROL POINTS</div>
              <div className={`text-2xl font-black ${chartData.violations_count > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {chartData.violations_count}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {chartData.violations_count > 0 ? 'Action required immediately' : 'Process running smoothly'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts: Individuals Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Individuals (I) Chart — {chartData?.parameter_name} ({lineCode})
            </h2>
            <p className="text-xs text-slate-400">
              UCL/LCL calculated from moving range (d2=1.128). Nelson rule violations flagged in red.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-0.5 bg-blue-600"></span> Value
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-0.5 bg-rose-500 stroke-dashed"></span> Control Limits (UCL/LCL)
            </span>
            <span className="flex items-center gap-1.5 text-slate-800">
              <span className="w-3 h-0.5 bg-slate-900 stroke-dotted"></span> Spec Limits (USL/LSL)
            </span>
          </div>
        </div>

        <div className="h-80">
          {chartData?.points && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData.points} margin={{ top: 15, right: 35, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth={1} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }}
                  domain={[
                    (dataMin: number) => Math.min(dataMin, chartData.i_chart.lcl, chartData.lsl ?? 999) - 0.1,
                    (dataMax: number) => Math.max(dataMax, chartData.i_chart.ucl, chartData.usl ?? 0) + 0.1
                  ]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-950 text-white p-3 rounded-lg text-xs shadow-2xl border-2 border-slate-700 space-y-1">
                          <div className="font-bold text-sky-400 text-sm">Point #{p.index} ({p.timestamp})</div>
                          <div className="text-base font-black">Value: <span className="text-yellow-300">{p.value} {chartData.unit}</span></div>
                          <div className="text-slate-300">Center (CL): {p.cl} | UCL: {p.ucl} | LCL: {p.lcl}</div>
                          {p.usl && <div className="text-slate-300">Spec Range: {p.lsl} to {p.usl}</div>}
                          {p.violations && p.violations.length > 0 && (
                            <div className="text-rose-400 font-bold border-t border-slate-700 pt-1 mt-1 text-xs">
                              ⚠️ Violations: {p.violations.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Statistical Control Limits */}
                <ReferenceLine y={chartData.i_chart.ucl} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" label={{ value: `UCL ${chartData.i_chart.ucl}`, fill: '#dc2626', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine y={chartData.i_chart.cl} stroke="#16a34a" strokeWidth={2} label={{ value: `CL ${chartData.i_chart.cl}`, fill: '#16a34a', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine y={chartData.i_chart.lcl} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" label={{ value: `LCL ${chartData.i_chart.lcl}`, fill: '#dc2626', fontSize: 11, fontWeight: 700 }} />

                {/* Engineering Specification Limits (Distinct from control limits!) */}
                {chartData.usl !== undefined && (
                  <ReferenceLine y={chartData.usl} stroke="#0f172a" strokeWidth={2} strokeDasharray="3 3" label={{ value: `USL ${chartData.usl}`, fill: '#0f172a', fontSize: 11, fontWeight: 700 }} />
                )}
                {chartData.lsl !== undefined && (
                  <ReferenceLine y={chartData.lsl} stroke="#0f172a" strokeWidth={2} strokeDasharray="3 3" label={{ value: `LSL ${chartData.lsl}`, fill: '#0f172a', fontSize: 11, fontWeight: 700 }} />
                )}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (payload.is_out_of_control) {
                      return <circle cx={cx} cy={cy} r={7} fill="#dc2626" stroke="#ffffff" strokeWidth={2.5} />;
                    }
                    return <circle cx={cx} cy={cy} r={3.5} fill="#2563eb" />;
                  }}
                  activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Moving Range (MR) Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Moving Range (MR) Chart — Short-Term Process Variation
            </h2>
            <p className="text-xs text-slate-400">
              MR = |Xi - Xi-1| (n=2). UCL = 3.267 × MR̄. LCL = 0.
            </p>
          </div>
          <div className="text-xs text-slate-600 font-semibold">
            Average Moving Range (MR̄): <b>{chartData?.mean_mr}</b>
          </div>
        </div>

        <div className="h-56">
          {chartData?.points && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData.points.slice(1)} margin={{ top: 10, right: 35, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth={1} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }} domain={[0, 'auto']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-950 text-white p-3 rounded-lg text-xs border border-slate-700 shadow-xl">
                          <div className="font-bold text-sky-400">Point #{p.index} ({p.timestamp})</div>
                          <div className="text-base font-black">Moving Range: <span className="text-amber-300">{p.mr}</span></div>
                          <div className="text-slate-300">MR Center: {chartData.mr_chart.cl} | MR UCL: {chartData.mr_chart.ucl}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={chartData.mr_chart.ucl} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" label={{ value: `MR UCL ${chartData.mr_chart.ucl}`, fill: '#dc2626', fontSize: 11, fontWeight: 700 }} />
                <ReferenceLine y={chartData.mr_chart.cl} stroke="#16a34a" strokeWidth={2} label={{ value: `MR̄ ${chartData.mr_chart.cl}`, fill: '#16a34a', fontSize: 11, fontWeight: 700 }} />
                <Line type="monotone" dataKey="mr" stroke="#334155" strokeWidth={2.5} dot={{ r: 3.5, fill: '#334155' }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Flagged Nelson Rule Violations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Detected Statistical Rule Violations ({violationPoints.length})
          </h3>
          <span className="text-[11px] text-slate-500">Nelson 8-Rule Standard</span>
        </div>

        {violationPoints.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Zero statistical rule violations detected. Process is in statistical control.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Point #</th>
                  <th className="px-4 py-2.5 font-bold">Timestamp</th>
                  <th className="px-4 py-2.5 font-bold">Measured Value</th>
                  <th className="px-4 py-2.5 font-bold">Tolerance Deviation</th>
                  <th className="px-4 py-2.5 font-bold">Triggered Nelson Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {violationPoints.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono font-bold text-slate-800">#{p.index}</td>
                    <td className="px-4 py-2 text-slate-600">{p.timestamp}</td>
                    <td className="px-4 py-2 font-black text-rose-700">{p.value} {chartData?.unit}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={p.spec_status} size="sm" />
                    </td>
                    <td className="px-4 py-2 font-semibold text-rose-700">
                      {p.violations.join(', ') || 'Statistical excursion'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

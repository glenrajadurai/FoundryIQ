import React, { useEffect, useState } from 'react';
import { PieChart as PieChartIcon, Filter, Info, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { api } from '../../services/api';
import { ParetoResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const DefectParetoPage: React.FC = () => {
  const { selectedLine, quickView } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine);
  const [paretoData, setParetoData] = useState<ParetoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPareto = async () => {
    setLoading(true);
    try {
      const data = await api.getPareto(lineCode);
      setParetoData(data);
    } catch (err) {
      console.error('Failed to load Pareto chart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLineCode(selectedLine);
  }, [selectedLine]);

  useEffect(() => {
    loadPareto();
  }, [lineCode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            DEFECT PARETO ANALYSIS (80/20 RULE)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritizes the "vital few" casting defects causing 80% of scrap volume over the "trivial many".
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {['ALL', 'D1', 'D2', 'D3', 'D4'].map(code => (
            <button
              key={code}
              onClick={() => setLineCode(code)}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                lineCode === code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Main Pareto Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Defect Volume Frequency & Cumulative Percentage ({lineCode})
            </h2>
            <p className="text-xs text-slate-400">
              Bars indicate scrap piece count (left axis); curve indicates cumulative % (right axis). 80% threshold line highlighted.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600">
            Total Scrap Analyzed: <b>{paretoData?.total_rejected.toLocaleString() || 0} pieces</b>
          </div>
        </div>

        <div className="h-88">
          {paretoData?.items && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={paretoData.items} margin={{ top: 20, right: 35, left: 15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth={1} />
                <XAxis dataKey="defect_name" tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 700 }} interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }} label={{ value: 'Scrap Quantity', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#0f172a', fontWeight: 700 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 600 }} unit="%" label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fontSize: 12, fill: '#0f172a', fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600 }}
                  formatter={(val: any, name?: any) => [name === 'cumulative_percentage' ? `${val}%` : `${val} pcs`, name === 'cumulative_percentage' ? 'Cumulative %' : 'Rejected Qty']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '10px' }} />
                <ReferenceLine yAxisId="right" y={80} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" label={{ value: '80% Pareto Cutoff', fill: '#dc2626', fontSize: 11, fontWeight: 700 }} />
                <Bar yAxisId="left" dataKey="rejected_qty" fill="#2563eb" name="Rejected Quantity" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative_percentage" stroke="#dc2626" strokeWidth={3} dot={{ r: 5, fill: '#dc2626' }} name="Cumulative %" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODE for Pareto: Instant Vital Few Spotlight */}
      {quickView && paretoData && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border-2 border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              ★ SHOP-FLOOR ACTION PRIORITY: TOP SCRAP DEFECTS
            </span>
            <span className="text-xs font-bold text-slate-300">
              Total Scrap: {paretoData.total_rejected.toLocaleString()} pieces
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paretoData.items.slice(0, 3).map((item, index) => (
              <div key={item.defect_id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400">PRIORITY #{index + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500">
                      {item.percentage}% OF SCRAP
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">{item.defect_name}</h4>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{item.defect_code}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Scrap Count:</span>
                  <span className="text-xl font-black text-rose-400">{item.rejected_qty.toLocaleString()} pcs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pareto Table Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Defect Contribution Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Rank</th>
                <th className="px-4 py-3 font-bold">Defect Name</th>
                <th className="px-4 py-3 font-bold">Defect Code</th>
                <th className="px-4 py-3 font-bold text-right">Rejected Quantity</th>
                <th className="px-4 py-3 font-bold text-right">Individual %</th>
                <th className="px-4 py-3 font-bold text-right">Cumulative %</th>
                <th className="px-4 py-3 font-bold">Category Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paretoData?.items.map((item, idx) => {
                const isVitalFew = item.cumulative_percentage <= 80 || (idx === 0);
                return (
                  <tr key={item.defect_id} className={`hover:bg-slate-50/60 ${isVitalFew ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-2.5 font-bold font-mono text-slate-700">#{idx + 1}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{item.defect_name}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{item.defect_code}</td>
                    <td className="px-4 py-2.5 text-right font-black text-rose-600">{item.rejected_qty.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-slate-700">{item.percentage}%</td>
                    <td className="px-4 py-2.5 text-right font-black text-slate-900">{item.cumulative_percentage}%</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isVitalFew ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                        {isVitalFew ? 'Vital Few (Top 80%)' : 'Secondary'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

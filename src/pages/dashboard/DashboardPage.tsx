import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Database,
  ArrowRight,
  Flame,
  LineChart as LineChartIcon,
  Eye,
  Check,
  AlertOctagon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../../services/api';
import { DashboardMetrics, LineCardInfo, QualityAlert } from '../../types';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { selectedLine, refreshAlertsCount, quickView } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [lines, setLines] = useState<LineCardInfo[]>([]);
  const [rejectionTrends, setRejectionTrends] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<QualityAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardSummary();
      setMetrics(data.metrics);
      setLines(data.lines);
      setRejectionTrends(data.rejection_trends);

      const alerts = await api.getAlerts(selectedLine !== 'ALL' ? selectedLine : undefined, undefined, undefined);
      setRecentAlerts(alerts.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLine]);

  const handleSeedData = async () => {
    if (!confirm('Re-seed realistic Quality 4.0 foundry dataset for lines D1, D2, D3, D4?')) return;
    setSeeding(true);
    try {
      await api.seedData(true);
      await loadData();
      refreshAlertsCount();
      alert('Demo dataset successfully refreshed!');
    } catch (err: any) {
      alert(`Error seeding: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const filteredLines = selectedLine === 'ALL' ? lines : lines.filter(l => l.line_code === selectedLine);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">FOUNDRY QUALITY 4.0 OVERVIEW</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 tracking-wider">
              REAL-TIME SPC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Integrated Digital Sand Testing, Process Capability & Downstream Rejection Analytics for Lines D1, D2, D3 & D4.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            {seeding ? 'Seeding...' : 'Reset Demo Data'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tests Conforming"
          value={`${metrics?.conforming_percentage || 0}%`}
          subtext="Past 7 Days (In-Spec)"
          icon={CheckCircle2}
          color="emerald"
          trend="up"
          trendText="Within Tolerance"
        />
        <StatCard
          title="Scrap / Rejection Rate"
          value={`${metrics?.overall_rejection_rate || 0}%`}
          subtext={`Rejected: ${metrics?.total_rejected_qty || 0} / Inspected: ${metrics?.total_inspected_qty || 0}`}
          icon={TrendingDown}
          color={Number(metrics?.overall_rejection_rate || 0) > 3.0 ? 'rose' : 'blue'}
        />
        <StatCard
          title="Open Quality Alerts"
          value={metrics?.open_alerts || 0}
          subtext="Nelson rules & spec violations"
          icon={AlertTriangle}
          color={(metrics?.open_alerts || 0) > 0 ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Customer Complaints"
          value={metrics?.active_complaints || 0}
          subtext="Active 8D CAPA investigations"
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      {/* QUICK VIEW MODE: High-visibility, giant status board for factory floor */}
      {quickView && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-2 border-slate-700 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-black tracking-widest text-amber-400 uppercase">
                ★ SHOP-FLOOR GLANCE BOARD (ACCESSIBILITY VIEW)
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">
                MOLDING LINES DISAMATIC D1 - D4 STATUS
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400">SHIFT #{metrics?.total_tests_today ?? 1}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLines.map(line => {
              const isBad = line.health === 'CRITICAL';
              const isWarn = line.health === 'WARNING';
              return (
                <div
                  key={line.line_code}
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between ${isBad
                      ? 'bg-rose-950/80 border-rose-500 text-white'
                      : isWarn
                        ? 'bg-amber-950/80 border-amber-500 text-white'
                        : 'bg-emerald-950/80 border-emerald-500 text-white'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black">{line.line_code}</span>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-md tracking-wider uppercase ${isBad ? 'bg-rose-500 text-white' : isWarn ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                        }`}
                    >
                      {line.health}
                    </span>
                  </div>

                  <div className="my-3 space-y-1.5">
                    <div className="text-xs font-bold text-slate-300 flex justify-between">
                      <span>SCRAP RATE:</span>
                      <span className="text-base font-black text-white">{line.rejection_rate}%</span>
                    </div>
                    <div className="text-xs font-bold text-slate-300 flex justify-between">
                      <span>ACTIVE ALERTS:</span>
                      <span className="text-base font-black text-white">{line.open_alerts}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-300 flex justify-between">
                      <span>LAST TEST:</span>
                      <span className="font-bold text-white">{line.latest_test_status}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex gap-2">
                    <Link
                      to={`/sand-tests/entry?line=${line.line_code}`}
                      className="flex-1 text-center py-2 bg-white text-slate-950 font-black rounded text-xs hover:bg-slate-200"
                    >
                      LOG TEST
                    </Link>
                    <Link
                      to={`/spc/charts?line=${line.line_code}`}
                      className="flex-1 text-center py-2 bg-blue-600 text-white font-black rounded text-xs hover:bg-blue-500"
                    >
                      VIEW SPC
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Production Lines Status Cards (D1, D2, D3, D4) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
            Production Lines Quality Status
          </h2>
          <span className="text-xs text-slate-400 font-medium">Automatic Green Sand Molding Plants</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLines.map(line => (
            <div
              key={line.line_code}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all hover:shadow-md ${line.health === 'CRITICAL'
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : line.health === 'WARNING'
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                    {line.line_code}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{line.molding_line}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Muller Plant Active</div>
                  </div>
                </div>
                <StatusBadge status={line.health} size="sm" />
              </div>

              <div className="space-y-2 py-2 border-y border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Rejection Rate:</span>
                  <span className={`font-bold ${line.rejection_rate > 3.0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {line.rejection_rate}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Open Alerts:</span>
                  <span className={`font-bold ${line.open_alerts > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {line.open_alerts}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Latest Test:</span>
                  <StatusBadge status={line.latest_test_status} size="sm" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-1">
                <Link
                  to={`/spc/charts?line=${line.line_code}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                  View SPC
                </Link>
                <Link
                  to={`/sand-tests/entry?line=${line.line_code}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                >
                  Log Test <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts & Data Feeds Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rejection Trends (Clean Table by default, optional graph) (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
                14-Day Line Scrap Rate Performance (%)
              </h3>
              <p className="text-xs text-slate-400">Shop-floor defect rates across lines D1, D2, D3, D4</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGraph(g => !g)}
                className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                {showGraph ? 'SHOW DATA TABLE' : 'SHOW GRAPH'}
              </button>
              <Link to="/rejections" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                Details &rarr;
              </Link>
            </div>
          </div>

          {showGraph ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rejectionTrends} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeWidth={1} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} tickFormatter={d => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} unit="%" domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600 }}
                    formatter={(val: any) => [`${val}%`, 'Scrap Rate']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
                  <Line type="monotone" dataKey="D1" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Line D1 (Auto Blocks)" />
                  <Line type="monotone" dataKey="D2" stroke="#e11d48" strokeWidth={3.5} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Line D2 (Transmission - Drift)" />
                  <Line type="monotone" dataKey="D3" stroke="#d97706" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Line D3 (Hydraulics)" />
                  <Line type="monotone" dataKey="D4" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Line D4 (Commercial)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            /* Clean Industrial High-Density Metric Table (No graph clutter) */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Line D1 (Engine)</th>
                    <th className="py-2.5 px-3 text-right">Line D2 (Trans)</th>
                    <th className="py-2.5 px-3 text-right">Line D3 (Hydr)</th>
                    <th className="py-2.5 px-3 text-right">Line D4 (Comm)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {rejectionTrends.slice(-7).reverse().map((r, i) => {
                    const maxVal = Math.max(r.D1, r.D2, r.D3, r.D4);
                    const isSpike = maxVal > 3.0;
                    return (
                      <tr key={i} className={`hover:bg-slate-50 ${isSpike ? 'bg-amber-50/40' : ''}`}>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{r.date}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-700">{r.D1}%</td>
                        <td className={`py-2.5 px-3 text-right font-black ${r.D2 > 3.0 ? 'text-rose-600' : 'text-slate-700'}`}>{r.D2}%</td>
                        <td className={`py-2.5 px-3 text-right font-semibold ${r.D3 > 3.0 ? 'text-amber-600' : 'text-slate-700'}`}>{r.D3}%</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-700">{r.D4}%</td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSpike ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isSpike ? 'DRIFT ALERT' : 'CONFORMING'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
            <b>Engineer Insight:</b> Notice the scrap spike on <b>Line D2</b> between days 13-15 (~6.2%). This directly correlates with moisture surge deviations in the sand laboratory. Check the <b>Correlation Engine</b> for details.
          </div>
        </div>

        {/* Recent Quality Alerts Feed (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
                Active Alerts Feed
              </h3>
              <p className="text-xs text-slate-400">Spec & Nelson Rule Triggers</p>
            </div>
            <Link to="/alerts" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              View All ({metrics?.open_alerts || 0})
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px]">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No active quality alerts. All lines conforming.
              </div>
            ) : (
              recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Line {alert.line_code}
                    </span>
                    <StatusBadge status={alert.severity} size="sm" />
                  </div>
                  <p className="text-slate-600 line-clamp-2">{alert.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <Link to="/alerts" className="text-blue-600 font-bold hover:underline">
                      Acknowledge &rarr;
                    </Link>
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

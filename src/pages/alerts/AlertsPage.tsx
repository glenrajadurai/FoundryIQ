import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertTriangle, MessageSquare, Filter, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { QualityAlert } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const AlertsPage: React.FC = () => {
  const { selectedLine, refreshAlertsCount, user } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [alerts, setAlerts] = useState<QualityAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Acknowledge Modal
  const [ackAlert, setAckAlert] = useState<QualityAlert | null>(null);
  const [ackNotes, setAckNotes] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Resolve Modal
  const [resAlert, setResAlert] = useState<QualityAlert | null>(null);
  const [resNotes, setResNotes] = useState<string>('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts(
        lineCode !== 'ALL' ? lineCode : undefined,
        statusFilter !== 'ALL' ? statusFilter : undefined
      );
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLineCode(selectedLine);
  }, [selectedLine]);

  useEffect(() => {
    loadAlerts();
  }, [lineCode, statusFilter]);

  const handleAcknowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackAlert) return;
    setActionLoading(true);
    try {
      await api.acknowledgeAlert(ackAlert.id, ackNotes);
      alert('Alert acknowledged successfully.');
      setAckAlert(null);
      setAckNotes('');
      loadAlerts();
      refreshAlertsCount();
    } catch (err: any) {
      alert(`Error acknowledging: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resAlert || !resNotes.trim()) return;
    setActionLoading(true);
    try {
      await api.resolveAlert(resAlert.id, resNotes);
      alert('Alert resolved and containment verified.');
      setResAlert(null);
      setResNotes('');
      loadAlerts();
      refreshAlertsCount();
    } catch (err: any) {
      alert(`Error resolving: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            QUALITY ALERT CENTER & OUT-OF-CONTROL MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts triggered by parameter tolerance violations, Nelson statistical rules, and process drifts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button
            onClick={() => loadAlerts()}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No quality alerts found for the current selection.
          </div>
        ) : (
          alerts.map(a => (
            <div
              key={a.id}
              className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                a.status === 'OPEN'
                  ? 'border-rose-300 bg-rose-50/15 ring-1 ring-rose-200'
                  : a.status === 'ACKNOWLEDGED'
                  ? 'border-amber-300 bg-amber-50/15'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {a.alert_code}
                  </span>
                  <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                    {a.line_code}
                  </span>
                  <StatusBadge status={a.severity} size="sm" />
                  <StatusBadge status={a.status} size="sm" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(a.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="font-semibold text-slate-800 text-xs">
                  {a.description}
                </div>

                {a.nelson_rule_triggered && (
                  <div className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    SPC Rule: {a.nelson_rule_triggered}
                  </div>
                )}

                {a.resolution_notes && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 italic">
                    {a.resolution_notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {a.status === 'OPEN' && (
                  <button
                    onClick={() => {
                      setAckAlert(a);
                      setAckNotes('');
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    Acknowledge
                  </button>
                )}

                {(a.status === 'OPEN' || a.status === 'ACKNOWLEDGED') && (
                  <button
                    onClick={() => {
                      setResAlert(a);
                      setResNotes('');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs"
                  >
                    Resolve Alert
                  </button>
                )}

                {a.status === 'RESOLVED' && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Acknowledge Modal */}
      {ackAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase">Acknowledge Quality Alert</h3>
            <p className="text-xs text-slate-600">{ackAlert.description}</p>
            <form onSubmit={handleAcknowledge} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Operator / Inspector Notes
                </label>
                <textarea
                  rows={3}
                  value={ackNotes}
                  onChange={e => setAckNotes(e.target.value)}
                  placeholder="e.g. Alert acknowledged. Checked sand cooler and notified sand plant supervisor."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setAckAlert(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded text-xs">
                  {actionLoading ? 'Saving...' : 'Confirm Acknowledgment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase">Resolve Quality Alert</h3>
            <p className="text-xs text-slate-600">{resAlert.description}</p>
            <form onSubmit={handleResolve} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Resolution & Containment Notes (Mandatory)
                </label>
                <textarea
                  rows={3}
                  required
                  value={resNotes}
                  onChange={e => setResNotes(e.target.value)}
                  placeholder="e.g. Water addition adjusted on muller PLC. Next 2 verification tests measured within tolerance (3.38%). Closed."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setResAlert(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
                <button type="submit" disabled={actionLoading} className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded text-xs">
                  {actionLoading ? 'Saving...' : 'Resolve & Close'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { History, Shield, Filter, Search, RefreshCw, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { AuditLog } from '../../types';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs(
        entityFilter !== 'ALL' ? entityFilter : undefined,
        actionFilter !== 'ALL' ? actionFilter : undefined
      );
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [entityFilter, actionFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            DIGITAL AUDIT TRAIL (IATF 16949 COMPLIANT)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all user transactions: Test entry, specification changes, alert approvals, and data corrections.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Entities</option>
            <option value="SandTestRecord">Sand Test Records</option>
            <option value="ParameterSpecification">Specifications</option>
            <option value="QualityAlert">Quality Alerts</option>
            <option value="CustomerComplaint">Complaints & 8D</option>
            <option value="RejectionRecord">Rejections</option>
          </select>

          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="ACKNOWLEDGE">ACKNOWLEDGE</option>
            <option value="EXPORT">EXPORT</option>
          </select>

          <button
            onClick={() => loadLogs()}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Audit Events ({logs.length})
          </h2>
          <span className="text-xs text-slate-500">Immutable Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Timestamp (UTC)</th>
                <th className="px-4 py-3 font-bold">Actor</th>
                <th className="px-4 py-3 font-bold">Role</th>
                <th className="px-4 py-3 font-bold">Action</th>
                <th className="px-4 py-3 font-bold">Target Entity</th>
                <th className="px-4 py-3 font-bold">Entity ID</th>
                <th className="px-4 py-3 font-bold">Audit Reason / Description</th>
                <th className="px-4 py-3 font-bold text-right">Diff Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">{log.user_name}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-700">{log.action}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{log.entity_type}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{log.entity_id || '-'}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={log.reason || ''}>
                    {log.reason || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(log.old_value || log.new_value) && (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 rounded border border-blue-200"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Diff Viewer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Audit Record Diff: Event #{selectedLog.id}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>Actor: <b>{selectedLog.user_name}</b> ({selectedLog.user_role})</div>
              <div>Action: <b>{selectedLog.action}</b> on <b>{selectedLog.entity_type} #{selectedLog.entity_id}</b></div>
              <div>Reason: <i>"{selectedLog.reason}"</i></div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-rose-700 uppercase mb-1">Previous State (Old Value)</label>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-[10px] overflow-auto max-h-60 font-mono">
                  {selectedLog.old_value ? JSON.stringify(JSON.parse(selectedLog.old_value), null, 2) : '(None - Created)'}
                </pre>
              </div>

              <div>
                <label className="block font-bold text-emerald-700 uppercase mb-1">New State (Modified Value)</label>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-[10px] overflow-auto max-h-60 font-mono">
                  {selectedLog.new_value ? JSON.stringify(JSON.parse(selectedLog.new_value), null, 2) : '(None - Deleted)'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

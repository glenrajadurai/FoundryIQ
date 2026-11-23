import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal,
  Edit3,
  History,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { Parameter, SpecificationRevision } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const SpecificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Specification Dialog
  const [editingParam, setEditingParam] = useState<Parameter | null>(null);
  const [targetVal, setTargetVal] = useState<number>(0);
  const [lslVal, setLslVal] = useState<number>(0);
  const [uslVal, setUslVal] = useState<number>(0);
  const [changeReason, setChangeReason] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  // Revision History Modal
  const [historyParam, setHistoryParam] = useState<Parameter | null>(null);
  const [revisions, setRevisions] = useState<SpecificationRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState<boolean>(false);

  const loadParams = async () => {
    setLoading(true);
    try {
      const data = await api.getParameters();
      setParameters(data);
    } catch (err) {
      console.error('Failed to load parameters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParams();
  }, []);

  const openEditModal = (p: Parameter) => {
    setEditingParam(p);
    setTargetVal(p.target_value);
    setLslVal(p.lsl);
    setUslVal(p.usl);
    setChangeReason('');
  };

  const openHistoryModal = async (p: Parameter) => {
    setHistoryParam(p);
    setLoadingRevisions(true);
    try {
      const revs = await api.getParameterRevisions(p.id);
      setRevisions(revs);
    } catch (err) {
      console.error('Failed to load revisions', err);
    } finally {
      setLoadingRevisions(false);
    }
  };

  const handleSaveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParam || !changeReason.trim()) return;
    setSaving(true);
    try {
      await api.updateSpecification(editingParam.id, {
        target_value: targetVal,
        lsl: lslVal,
        usl: uslVal,
        revision_reason: changeReason
      });
      alert(`Specification updated for ${editingParam.name}! New Revision created in audit history.`);
      setEditingParam(null);
      loadParams();
    } catch (err: any) {
      alert(`Error updating specification: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const canEdit = user && ['quality_engineer', 'quality_manager', 'admin'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            PARAMETER SPECIFICATIONS & TOLERANCE LIMITS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering specification limits (LSL, USL, Target) distinct from statistical control limits (LCL, UCL), with revision tracking.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-blue-600" />
          IATF 16949 Revision Traceability
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Approved Foundry Testing Parameters ({parameters.length})
          </h2>
          <span className="text-xs text-slate-500">Historical records preserve applicable specification revision</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Code</th>
                <th className="px-4 py-3 font-bold">Parameter Name</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Unit</th>
                <th className="px-4 py-3 font-bold text-center">Lower Spec (LSL)</th>
                <th className="px-4 py-3 font-bold text-center text-blue-600">Target Value</th>
                <th className="px-4 py-3 font-bold text-center">Upper Spec (USL)</th>
                <th className="px-4 py-3 font-bold text-center">Rev #</th>
                <th className="px-4 py-3 font-bold">Standard Testing Method</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parameters.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{p.code}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.category === 'PHYSICAL' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{p.unit}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">{p.lsl}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50/50">{p.target_value}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">{p.usl}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openHistoryModal(p)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200"
                      title="View Revision History"
                    >
                      Rev {p.current_revision}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={p.testing_method}>
                    {p.testing_method || 'Standard Method'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openHistoryModal(p)}
                        className="text-slate-500 hover:text-slate-800 p-1"
                        title="History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-xs border border-blue-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Revise
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Specification Modal */}
      {editingParam && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Revise Specification: {editingParam.name}
              </h3>
              <button onClick={() => setEditingParam(null)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <div className="text-xs bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 space-y-1">
              <b>Important:</b> Updating specifications will increment the revision number (Current: Rev {editingParam.current_revision} &rarr; Rev {editingParam.current_revision + 1}). Past historical tests will remain tied to their respective historical revisions.
            </div>

            <form onSubmit={handleSaveSpec} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Lower Spec (LSL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lslVal}
                    onChange={e => setLslVal(Number(e.target.value))}
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-lg p-2 text-right"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={targetVal}
                    onChange={e => setTargetVal(Number(e.target.value))}
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-lg p-2 text-right text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Upper Spec (USL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={uslVal}
                    onChange={e => setUslVal(Number(e.target.value))}
                    className="w-full text-sm font-bold bg-white border border-slate-300 rounded-lg p-2 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Engineering Change Reason (Mandatory for IATF Audit)
                </label>
                <textarea
                  rows={3}
                  required
                  value={changeReason}
                  onChange={e => setChangeReason(e.target.value)}
                  placeholder="e.g. Tightened moisture band per customer quality requirement TM-V6-ENG revision 3 to eliminate microporosity."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingParam(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {saving ? 'Saving Revision...' : 'Save & Increment Revision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {historyParam && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Specification Revision History: {historyParam.name}
              </h3>
              <button onClick={() => setHistoryParam(null)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            {loadingRevisions ? (
              <div className="py-10 text-center text-xs text-slate-400">Loading revision history...</div>
            ) : revisions.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">No revisions found.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {revisions.map(rev => (
                  <div key={rev.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                        Revision {rev.revision_number}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Effective: {new Date(rev.effective_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      LSL: <b>{rev.lsl}</b> | Target: <b className="text-blue-600">{rev.target_value}</b> | USL: <b>{rev.usl}</b>
                    </div>
                    <div className="text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                      "{rev.change_reason}"
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setHistoryParam(null)}
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

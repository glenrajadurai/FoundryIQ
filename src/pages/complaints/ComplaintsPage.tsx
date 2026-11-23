import React, { useEffect, useState } from 'react';
import { ShieldAlert, Plus, CheckCircle2, Clock, AlertTriangle, FileText, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { CustomerComplaint, DefectCategory, CastingProduct } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [defects, setDefects] = useState<DefectCategory[]>([]);
  const [products, setProducts] = useState<CastingProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 8D Editor Modal
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);
  const [d1Team, setD1Team] = useState<string>('');
  const [d2Problem, setD2Problem] = useState<string>('');
  const [d3Containment, setD3Containment] = useState<string>('');
  const [d4RootCause, setD4RootCause] = useState<string>('');
  const [d5Corrective, setD5Corrective] = useState<string>('');
  const [d6Validation, setD6Validation] = useState<string>('');
  const [d7Preventive, setD7Preventive] = useState<string>('');
  const [d8Closure, setD8Closure] = useState<string>('');
  const [statusVal, setStatusVal] = useState<string>('OPEN');
  const [saving8D, setSaving8D] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, dData, pData] = await Promise.all([
        api.getComplaints(),
        api.getDefects(),
        api.getProducts()
      ]);
      setComplaints(cData);
      setDefects(dData);
      setProducts(pData);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const open8DModal = (c: CustomerComplaint) => {
    setSelectedComplaint(c);
    setD1Team(c.d1_team || '');
    setD2Problem(c.d2_problem || c.description);
    setD3Containment(c.d3_containment || '');
    setD4RootCause(c.d4_root_cause || '');
    setD5Corrective(c.d5_corrective_action || '');
    setD6Validation(c.d6_validation || '');
    setD7Preventive(c.d7_preventive_action || '');
    setD8Closure(c.d8_closure || '');
    setStatusVal(c.status);
  };

  const handleSave8D = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSaving8D(true);
    try {
      await api.updateComplaint8D(selectedComplaint.id, {
        d1_team: d1Team,
        d2_problem: d2Problem,
        d3_containment: d3Containment,
        d4_root_cause: d4RootCause,
        d5_corrective_action: d5Corrective,
        d6_validation: d6Validation,
        d7_preventive_action: d7Preventive,
        d8_closure: d8Closure,
        status: statusVal
      });
      alert(`8D CAPA updated for complaint ${selectedComplaint.complaint_number}!`);
      setSelectedComplaint(null);
      loadData();
    } catch (err: any) {
      alert(`Error updating 8D: ${err.message}`);
    } finally {
      setSaving8D(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            CUSTOMER COMPLAINT & 8D CAPA MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            IATF 16949 compliant customer quality resolution workflow: Containment, Root Cause, Corrective & Preventive Action (D1-D8).
          </p>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Customer Complaints Register ({complaints.length})
          </h2>
          <span className="text-xs text-slate-500">Linked to Sand Batches & Rejection Lots</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Complaint No</th>
                <th className="px-4 py-3 font-bold">Customer Name</th>
                <th className="px-4 py-3 font-bold">Received Date</th>
                <th className="px-4 py-3 font-bold">Casting Part</th>
                <th className="px-4 py-3 font-bold">Defect Category</th>
                <th className="px-4 py-3 font-bold text-center">Affected Qty</th>
                <th className="px-4 py-3 font-bold">Severity</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{c.complaint_number}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{c.customer_name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.received_date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{c.product_name}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{c.defect_name}</td>
                  <td className="px-4 py-3 text-center font-black text-rose-600">{c.affected_qty} pcs</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => open8DModal(c)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-xs border border-blue-200 inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      8D CAPA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8D CAPA Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  8D Problem Solving Dossier: {selectedComplaint.complaint_number}
                </h3>
                <p className="text-xs text-slate-500">Customer: {selectedComplaint.customer_name} | Part: {selectedComplaint.product_name}</p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSave8D} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">D1. Team Members</label>
                  <input
                    type="text"
                    value={d1Team}
                    onChange={e => setD1Team(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                    placeholder="e.g. Lead QE, Metallurgist, Foundry Incharge"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Investigation Status</label>
                  <select
                    value={statusVal}
                    onChange={e => setStatusVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-bold"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
                    <option value="CAPA_PENDING">CAPA PENDING</option>
                    <option value="CLOSED">CLOSED (APPROVED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">D2. Problem Description</label>
                <textarea
                  rows={2}
                  value={d2Problem}
                  onChange={e => setD2Problem(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">D3. Immediate Containment Action</label>
                <textarea
                  rows={2}
                  value={d3Containment}
                  onChange={e => setD3Containment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  placeholder="e.g. Quarantined 450 finished castings at customer port. Inspected 100% of warehouse inventory."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">D4. Verified Root Cause (Sand & Molding)</label>
                <textarea
                  rows={2}
                  value={d4RootCause}
                  onChange={e => setD4RootCause(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  placeholder="e.g. High sand moisture excursion (>4.0%) combined with reduced mold permeability (<110) caused gas entrapment."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">D5. Permanent Corrective Action (PCA)</label>
                  <textarea
                    rows={2}
                    value={d5Corrective}
                    onChange={e => setD5Corrective(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">D6. Validation of Effectiveness</label>
                  <textarea
                    rows={2}
                    value={d6Validation}
                    onChange={e => setD6Validation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">D7. Preventive Action (FMEA / Control Plan)</label>
                  <textarea
                    rows={2}
                    value={d7Preventive}
                    onChange={e => setD7Preventive(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">D8. Team Recognition & Closure</label>
                  <textarea
                    rows={2}
                    value={d8Closure}
                    onChange={e => setD8Closure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving8D}
                  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-xs"
                >
                  {saving8D ? 'Saving...' : 'Save 8D Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

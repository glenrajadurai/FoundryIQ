import React, { useEffect, useState } from 'react';
import { FlaskConical, Plus, Calendar, Clock, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { SandTestRecord, Parameter } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export const ChemicalTestsPage: React.FC = () => {
  const { selectedLine } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine !== 'ALL' ? selectedLine : 'D1');
  const [records, setRecords] = useState<SandTestRecord[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Chemical Test Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shift, setShift] = useState<number>(1);
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [chemValues, setChemValues] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, tData] = await Promise.all([
        api.getParameters('CHEMICAL', 'SHIFT'),
        api.getSandTests({ line_code: lineCode, test_type: 'SHIFT_CHEMICAL', limit: 50 })
      ]);
      setParameters(pData);
      setRecords(tData);

      const init: Record<number, string> = {};
      pData.forEach(p => init[p.id] = p.target_value.toString());
      setChemValues(init);
    } catch (err) {
      console.error('Failed to load chemical tests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [lineCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payloadValues = parameters.map(p => ({
        parameter_id: p.id,
        measured_value: parseFloat(chemValues[p.id] || p.target_value.toString())
      }));

      await api.createSandTest({
        line_code: lineCode,
        test_type: 'SHIFT_CHEMICAL',
        test_date: testDate,
        shift: shift,
        test_hour: shift * 8,
        notes: 'Shift laboratory chemical analysis',
        values: payloadValues
      });

      alert('Shift chemical test recorded successfully!');
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(`Error saving test: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            SHIFT-WISE CHEMICAL SAND TESTING
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laboratory composite chemical measurements: Volatile Matter, Dead Clay %, and Bentonite Active Replenishment Rate.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Chemical Test
          </button>
        </div>
      </div>

      {/* Chemical Parameters Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {parameters.map(param => (
          <div key={param.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{param.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                {param.code}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800">
              {param.target_value} <span className="text-sm font-medium text-slate-500">{param.unit}</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
              <span>LSL: <b>{param.lsl}</b></span>
              <span>Target: <b className="text-blue-600">{param.target_value}</b></span>
              <span>USL: <b>{param.usl}</b></span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-2 pt-1">{param.description}</p>
          </div>
        ))}
      </div>

      {/* Historical Chemical Test Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Shift Laboratory Test Records (Line {lineCode})
          </h2>
          <span className="text-xs text-slate-500">{records.length} records retrieved</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Test Number</th>
                <th className="px-4 py-3 font-bold">Date & Shift</th>
                <th className="px-4 py-3 font-bold">Volatile Matter (%)</th>
                <th className="px-4 py-3 font-bold">Dead Clay (%)</th>
                <th className="px-4 py-3 font-bold">Bentonite Add (%)</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => {
                const vol = r.values.find(v => v.parameter_code === 'VOLATILE');
                const dead = r.values.find(v => v.parameter_code === 'DEAD_CLAY');
                const bent = r.values.find(v => v.parameter_code === 'BENTONITE');

                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600">{r.test_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{r.test_date}</div>
                      <div className="text-[10px] text-slate-400">Shift {r.shift}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {vol?.measured_value ?? '-'} %
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {dead?.measured_value ?? '-'} %
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {bent?.measured_value ?? '-'} %
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.operator_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Log Shift Chemical Analysis
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={e => setShift(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value={1}>Shift 1</option>
                    <option value={2}>Shift 2</option>
                    <option value={3}>Shift 3</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {parameters.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{p.name} ({p.unit})</span>
                      <span className="text-[10px] text-slate-400">Spec: {p.lsl} - {p.usl}</span>
                    </div>
                    <input
                      type="number"
                      step="any"
                      required
                      value={chemValues[p.id] || ''}
                      onChange={e => setChemValues({ ...chemValues, [p.id]: e.target.value })}
                      className="w-full text-sm font-bold bg-white border border-slate-300 rounded-md p-2 text-right"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {submitting ? 'Saving...' : 'Record Chemical Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

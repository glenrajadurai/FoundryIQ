import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { Parameter } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';

export const SandTestEntryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { selectedLine, selectedShift } = useAuth();

  const [lineCode, setLineCode] = useState<string>(searchParams.get('line') || (selectedLine !== 'ALL' ? selectedLine : 'D1'));
  const [shift, setShift] = useState<number>(selectedShift || 1);
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [testHour, setTestHour] = useState<number>(new Date().getHours());
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const data = await api.getParameters('PHYSICAL', 'HOURLY');
        setParameters(data);

        // Pre-fill with reasonable nominal target values for fast testing convenience
        const initial: Record<number, string> = {};
        data.forEach(p => {
          initial[p.id] = p.target_value.toString();
        });
        setValues(initial);
        setBatchNumber(`BAT-${lineCode}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-S${shift}`);
      } catch (err) {
        console.error('Failed to load parameters', err);
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [lineCode, shift]);

  const handleValueChange = (paramId: number, val: string) => {
    setValues(prev => ({ ...prev, [paramId]: val }));
  };

  const getValidationState = (param: Parameter, valStr: string) => {
    if (!valStr || isNaN(Number(valStr))) return { status: 'EMPTY', text: 'Required' };
    const num = Number(valStr);

    if (param.usl !== undefined && num > param.usl) {
      return { status: 'OUT_OF_SPEC', text: `Exceeds USL (${param.usl})`, color: 'text-rose-600 bg-rose-50 border-rose-300' };
    }
    if (param.lsl !== undefined && num < param.lsl) {
      return { status: 'OUT_OF_SPEC', text: `Below LSL (${param.lsl})`, color: 'text-rose-600 bg-rose-50 border-rose-300' };
    }
    if ((param.usl !== undefined && num > param.usl - 0.15 * (param.usl - param.lsl)) ||
        (param.lsl !== undefined && num < param.lsl + 0.15 * (param.usl - param.lsl))) {
      return { status: 'WARNING', text: 'Near Spec Margin', color: 'text-amber-600 bg-amber-50 border-amber-300' };
    }
    return { status: 'OK', text: 'In Spec', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const payloadValues = parameters.map(p => ({
        parameter_id: p.id,
        measured_value: parseFloat(values[p.id] || p.target_value.toString())
      }));

      const res = await api.createSandTest({
        line_code: lineCode,
        test_type: 'HOURLY_PHYSICAL',
        test_date: testDate,
        shift: shift,
        test_hour: testHour,
        batch_number: batchNumber,
        notes: notes,
        values: payloadValues
      });

      setFeedback({
        type: 'success',
        message: `Sand test entry #${res.test_number} recorded successfully! Status: ${res.status}. Automatic SPC rules evaluated.`
      });

      // Update hour for next entry
      setTestHour(h => (h + 1) % 24);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit test entry.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            DIGITAL SAND TEST ENTRY (SHOP FLOOR TABLET)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly physical green sand parameter verification with instant tolerance limit validation and duplicate prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-600 border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Hour {testHour}:00
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-medium">{feedback.message}</div>
        </div>
      )}

      {/* Main Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Context Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Molding Line</label>
            <select
              value={lineCode}
              onChange={e => setLineCode(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="D1">Line D1 (Automotive Engine Blocks)</option>
              <option value="D2">Line D2 (Transmission Housings)</option>
              <option value="D3">Line D3 (Hydraulic Pumps)</option>
              <option value="D4">Line D4 (Valve Bodies)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Shift</label>
            <select
              value={shift}
              onChange={e => setShift(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Shift 1 (06:00 - 14:00)</option>
              <option value={2}>Shift 2 (14:00 - 22:00)</option>
              <option value={3}>Shift 3 (22:00 - 06:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Test Date</label>
            <input
              type="date"
              value={testDate}
              onChange={e => setTestDate(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Test Hour (1-24)</label>
            <input
              type="number"
              min={1}
              max={24}
              value={testHour}
              onChange={e => setTestHour(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sand Batch / Muller No.</label>
            <input
              type="text"
              value={batchNumber}
              onChange={e => setBatchNumber(e.target.value)}
              placeholder="e.g. BAT-D1-01"
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Parameters Input Grid */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
              Physical Sand Measurements
            </h2>
            <span className="text-xs text-slate-500">Values are compared to engineering specifications (LSL & USL)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parameters.map(param => {
              const val = values[param.id] || '';
              const validation = getValidationState(param, val);

              return (
                <div
                  key={param.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{param.name}</span>
                      <div className="text-[10px] text-slate-400 font-mono">{param.code} ({param.unit})</div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${validation.color || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {validation.text}
                    </span>
                  </div>

                  {/* Big Touch-Friendly Number Input */}
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={e => handleValueChange(param.id, e.target.value)}
                      required
                      className="w-full text-lg font-black text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 text-right tracking-tight focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">
                      {param.unit}
                    </span>
                  </div>

                  {/* Target & Limits Guide Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1">
                    <span>LSL: <b className="text-slate-700">{param.lsl}</b></span>
                    <span>Target: <b className="text-blue-600">{param.target_value}</b></span>
                    <span>USL: <b className="text-slate-700">{param.usl}</b></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes Textarea */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Shop Floor Notes / Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Added 5L temper water at muller. Ambient temp high (38°C)."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              const resetVals: Record<number, string> = {};
              parameters.forEach(p => resetVals[p.id] = p.target_value.toString());
              setValues(resetVals);
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Targets
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Submitting Test...' : 'Save & Evaluate SPC'}
          </button>
        </div>
      </form>
    </div>
  );
};

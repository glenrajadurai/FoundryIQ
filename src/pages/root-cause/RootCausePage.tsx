import React, { useState } from 'react';
import { GitBranch, HelpCircle, Save, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RootCausePage: React.FC = () => {
  const [problemStatement, setProblemStatement] = useState<string>(
    'Spike in Porosity defects on Line D2 (Transmission Housings) reaching 6.2% on Days 13-15.'
  );

  const [whys, setWhys] = useState<string[]>([
    'Why 1: Why did porosity reject rate increase? -> Excessive steam bubbles trapped during mold filling.',
    'Why 2: Why was excess steam generated? -> Green sand moisture content exceeded 4.0% (USL is 3.7%).',
    'Why 3: Why was sand moisture over 4.0%? -> Automated water dosing valve at Muller #2 remained open 8 seconds too long.',
    'Why 4: Why did the valve stay open? -> Optical moisture sensor lens was coated in bentonite dust, misreading return sand as dry.',
    'Why 5 (Root Cause): Why was the lens coated? -> Scheduled bi-weekly air purge jet cleaning maintenance was skipped during shift transition.'
  ]);

  const [fishbone, setFishbone] = useState({
    man: 'Skipped maintenance log; Operator did not manually cross-verify moisture on Moisture Teller balance.',
    machine: 'Muller-2 automated water solenoid valve stuck; air purge nozzle pressure low (1.8 bar vs 4.0 bar).',
    material: 'Incoming bentonite shipment had higher fines percentage; return sand temperature elevated to 42°C.',
    method: 'Mulling cycle completed before full water absorption; fast-track cycle was enabled.',
    measurement: 'Optical moisture probe calibrated 45 days ago; baseline drift of +0.35% detected.',
    environment: 'Monsoon season; ambient air relative humidity was 88% in the sand preparation hall.'
  });

  const [countermeasure, setCountermeasure] = useState<string>(
    'Implemented daily automated sensor air-purge check at shift handover. Added PLC hard interlock: if muller moisture > 3.70%, mixer will not discharge until quality engineer overrides.'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            STRUCTURED ROOT CAUSE INVESTIGATION (5-WHY & ISHIKAWA)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic investigation workspace translating statistical correlation findings into verified mechanical root causes and CAPA actions.
          </p>
        </div>

        <Link
          to="/complaints"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Link to 8D CAPA Register
        </Link>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Problem Description (Observation & Defect Spike)
        </label>
        <textarea
          rows={2}
          value={problemStatement}
          onChange={e => setProblemStatement(e.target.value)}
          className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 5-Why Investigation Tree */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              5-Why Sequential Root Cause Tree
            </h2>
            <p className="text-xs text-slate-400">Drill down from defect symptom to fundamental system failure</p>
          </div>
          <button
            onClick={() => setWhys([...whys, `Why ${whys.length + 1}: `])}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>

        <div className="space-y-3">
          {whys.map((w, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                idx === whys.length - 1 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                W{idx + 1}
              </span>
              <input
                type="text"
                value={w}
                onChange={e => {
                  const updated = [...whys];
                  updated[idx] = e.target.value;
                  setWhys(updated);
                }}
                className={`flex-1 text-xs p-2 rounded-lg border font-medium ${
                  idx === whys.length - 1
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ishikawa 6M Fishbone Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Ishikawa Fishbone (6M Cause-and-Effect Matrix)
          </h2>
          <p className="text-xs text-slate-400">Comprehensive contributing factor analysis across foundry operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Man (Operator / Skills)
            </span>
            <textarea
              rows={3}
              value={fishbone.man}
              onChange={e => setFishbone({ ...fishbone, man: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 2. Machine (Mullers / Mold Lines)
            </span>
            <textarea
              rows={3}
              value={fishbone.machine}
              onChange={e => setFishbone({ ...fishbone, machine: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 3. Material (Sand, Clay, Coal)
            </span>
            <textarea
              rows={3}
              value={fishbone.material}
              onChange={e => setFishbone({ ...fishbone, material: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 4. Method (Mulling Cycle & SOP)
            </span>
            <textarea
              rows={3}
              value={fishbone.method}
              onChange={e => setFishbone({ ...fishbone, method: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 5. Measurement (Calibration / Sensors)
            </span>
            <textarea
              rows={3}
              value={fishbone.measurement}
              onChange={e => setFishbone({ ...fishbone, measurement: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 6. Milieu (Ambient Humidity & Temp)
            </span>
            <textarea
              rows={3}
              value={fishbone.environment}
              onChange={e => setFishbone({ ...fishbone, environment: e.target.value })}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Verified Countermeasure */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Verified Permanent Countermeasure & Preventive Action (D7)
        </h3>
        <textarea
          rows={2}
          value={countermeasure}
          onChange={e => setCountermeasure(e.target.value)}
          className="w-full text-xs font-medium bg-white border border-emerald-300 rounded-lg p-2.5 text-slate-800"
        />
        <div className="flex justify-end">
          <button
            onClick={() => alert('Investigation and Countermeasure saved to Quality Knowledge Base.')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs"
          >
            Save Investigation
          </button>
        </div>
      </div>
    </div>
  );
};

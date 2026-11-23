import React, { useState } from 'react';
import { Layers, Clock, Droplets, RotateCcw, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SandBatchPage: React.FC = () => {
  const { selectedLine } = useAuth();
  const [lineCode, setLineCode] = useState<string>(selectedLine !== 'ALL' ? selectedLine : 'D1');

  // Realistic mock of live muller batches
  const batches = [
    { id: 1, batchNumber: `BAT-${lineCode}-20261121-081`, muller: 'Muller-A (Simpson 2G)', weight: 2000, bentonite: 25.5, coalDust: 12.0, water: 34.5, cycleTime: 120, time: '21:15' },
    { id: 2, batchNumber: `BAT-${lineCode}-20261121-080`, muller: 'Muller-A (Simpson 2G)', weight: 2000, bentonite: 25.0, coalDust: 12.2, water: 35.0, cycleTime: 125, time: '20:45' },
    { id: 3, batchNumber: `BAT-${lineCode}-20261121-079`, muller: 'Muller-B (Eirich R19)', weight: 2000, bentonite: 26.0, coalDust: 11.8, water: 34.0, cycleTime: 120, time: '20:15' },
    { id: 4, batchNumber: `BAT-${lineCode}-20261121-078`, muller: 'Muller-A (Simpson 2G)', weight: 2000, bentonite: 25.0, coalDust: 12.0, water: 34.2, cycleTime: 122, time: '19:45' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            SAND BATCH & MULLER PREPARATION MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time batch tracking: Bentonite bonding additions, lustrous coal dust dosing, water temper additions, and cycle mix durations.
          </p>
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Muller Batch Weight</div>
          <div className="text-2xl font-black text-slate-800 mt-1">2,000 <span className="text-xs font-normal">kg</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Nominal Pan Capacity</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Bentonite Dosing</div>
          <div className="text-2xl font-black text-slate-800 mt-1">25.0 <span className="text-xs font-normal">kg/batch</span></div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active Clay Target 7.2%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Coal Dust Addition</div>
          <div className="text-2xl font-black text-slate-800 mt-1">12.0 <span className="text-xs font-normal">kg/batch</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Volatiles Target 2.4%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Cycle Mix Duration</div>
          <div className="text-2xl font-black text-slate-800 mt-1">120 <span className="text-xs font-normal">sec</span></div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Optimal Shear Bond</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recent Muller Mix Batches (Line {lineCode})
          </h2>
          <span className="text-xs text-slate-500">Live PLC Ingestion Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">Batch Number</th>
                <th className="px-4 py-3 font-bold">Muller Equipment</th>
                <th className="px-4 py-3 font-bold">Batch Mass</th>
                <th className="px-4 py-3 font-bold">Bentonite</th>
                <th className="px-4 py-3 font-bold">Coal Dust</th>
                <th className="px-4 py-3 font-bold">Water Addition</th>
                <th className="px-4 py-3 font-bold">Cycle Time</th>
                <th className="px-4 py-3 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {batches.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{b.batchNumber}</td>
                  <td className="px-4 py-3 text-slate-700">{b.muller}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{b.weight} kg</td>
                  <td className="px-4 py-3 text-slate-800">{b.bentonite} kg</td>
                  <td className="px-4 py-3 text-slate-800">{b.coalDust} kg</td>
                  <td className="px-4 py-3 text-blue-700 font-bold">{b.water} L</td>
                  <td className="px-4 py-3 text-emerald-700 font-bold">{b.cycleTime} s</td>
                  <td className="px-4 py-3 text-slate-500">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

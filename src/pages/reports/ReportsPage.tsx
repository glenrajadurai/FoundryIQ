import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, Table, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ReportsPage: React.FC = () => {
  const { selectedLine } = useAuth();
  const [reportType, setReportType] = useState<string>('SAND_TEST_SHEET');
  const [lineCode, setLineCode] = useState<string>(selectedLine);
  const [downloading, setDownloading] = useState<string | null>(null);

  const reportTypes = [
    { id: 'SAND_TEST_SHEET', title: 'Hourly Sand Test Log Sheet', desc: 'Complete physical sand measurements with specification conformity and operator stamps.' },
    { id: 'REJECTION_PARETO', title: 'Casting Rejection & Defect Report', desc: 'Shift-wise scrap piece counts, scrap percentages, and Pareto rankings.' },
    { id: 'AUDIT_TRAIL', title: 'IATF 16949 Digital Audit Trail', desc: 'Immutable log of all user modifications, specification revisions, and test approvals.' },
    { id: 'COMPLAINTS', title: 'Customer Complaints & 8D CAPA Log', desc: 'Customer quality claims, 8D containment, root cause verification, and closure notes.' },
  ];

  const handleExport = (fmt: 'pdf' | 'excel' | 'csv') => {
    setDownloading(fmt);
    const url = api.getExportUrl(reportType, fmt, lineCode);
    // Trigger direct browser download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${lineCode}.${fmt === 'excel' ? 'xlsx' : fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            QUALITY REPORTS & AUDIT EXPORT CENTER
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Export timestamped IATF-ready documentation in PDF, Excel (.xlsx), and RFC-compliant CSV formats.
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
              Line {code}
            </button>
          ))}
        </div>
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map(rt => (
          <div
            key={rt.id}
            onClick={() => setReportType(rt.id)}
            className={`p-5 rounded-xl border cursor-pointer transition-all shadow-xs ${
              reportType === rt.id
                ? 'bg-blue-50/40 border-blue-400 ring-2 ring-blue-100'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-800">{rt.title}</span>
              {reportType === rt.id && (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <p className="text-xs text-slate-500">{rt.desc}</p>
          </div>
        ))}
      </div>

      {/* Export Action Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Download Selected Report: {reportTypes.find(r => r.id === reportType)?.title}
            </h2>
            <p className="text-xs text-slate-500">Facility: Foundry Lines {lineCode} | System: PS-010 Quality 4.0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* PDF */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!downloading}
            className="p-5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-all flex flex-col items-center justify-center gap-2 text-rose-800 shadow-xs group"
          >
            <FileText className="w-8 h-8 text-rose-600 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs uppercase tracking-wider">Publication PDF Document</div>
            <span className="text-[10px] text-slate-500 text-center">Styled report with compliance signatures</span>
          </button>

          {/* Excel */}
          <button
            onClick={() => handleExport('excel')}
            disabled={!!downloading}
            className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 text-emerald-800 shadow-xs group"
          >
            <FileSpreadsheet className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs uppercase tracking-wider">Excel Workbook (.XLSX)</div>
            <span className="text-[10px] text-slate-500 text-center">Multi-tab formatted spreadsheet data</span>
          </button>

          {/* CSV */}
          <button
            onClick={() => handleExport('csv')}
            disabled={!!downloading}
            className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-blue-800 shadow-xs group"
          >
            <Table className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs uppercase tracking-wider">Raw Comma-Separated (CSV)</div>
            <span className="text-[10px] text-slate-500 text-center">RFC 4180 format for data pipelines</span>
          </button>
        </div>
      </div>
    </div>
  );
};

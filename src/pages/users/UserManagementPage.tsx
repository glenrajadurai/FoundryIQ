import React from 'react';
import { Users, Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const UserManagementPage: React.FC = () => {
  const { user, switchRole } = useAuth();

  const demoUsers = [
    { username: 'operator', name: 'Ramesh Kumar', role: 'operator' as UserRole, desc: 'Digital sand test entry on tablet, shift physical checks.' },
    { username: 'quality_engineer', name: 'Dr. Priya Sundaram', role: 'quality_engineer' as UserRole, desc: 'SPC chart analysis, specification adjustments, rejection investigation, 8D CAPA lead.' },
    { username: 'supervisor', name: 'Anand Verma', role: 'supervisor' as UserRole, desc: 'Production floor oversight, shift handover monitoring, alert verification.' },
    { username: 'admin', name: 'S. Natarajan', role: 'quality_manager' as UserRole, desc: 'Plant Quality Head. Administrative permissions, specification approvals, audit management.' },
  ];

  const permissionsMatrix = [
    { feature: 'Enter Hourly Sand Test Results', operator: true, qe: true, super: true, admin: true },
    { feature: 'Enter Shift-Wise Chemical Tests', operator: true, qe: true, super: true, admin: true },
    { feature: 'Request Test Measurement Correction', operator: true, qe: true, super: true, admin: true },
    { feature: 'Approve / Reject Data Corrections', operator: false, qe: true, super: false, admin: true },
    { feature: 'Configure Parameter Specifications (USL/LSL)', operator: false, qe: true, super: false, admin: true },
    { feature: 'Analyze Real-Time SPC Charts & Nelson Rules', operator: false, qe: true, super: true, admin: true },
    { feature: 'Log Casting Rejection Lots & Scrap Records', operator: false, qe: true, super: true, admin: true },
    { feature: 'Run Sand & Rejection Correlation Engine', operator: false, qe: true, super: true, admin: true },
    { feature: 'Update 8D Customer Complaint CAPA Dossiers', operator: false, qe: true, super: false, admin: true },
    { feature: 'Acknowledge Process Deviation Alerts', operator: true, qe: true, super: true, admin: true },
    { feature: 'Resolve & Close Quality Alerts', operator: false, qe: true, super: false, admin: true },
    { feature: 'Generate & Export Official PDF/Excel Reports', operator: false, qe: true, super: true, admin: true },
    { feature: 'Inspect IATF 16949 Immutable Audit Trail', operator: false, qe: true, super: true, admin: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            ROLE-BASED ACCESS CONTROL (RBAC) & USER DIRECTORY
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict foundry operational permissions enforced at both backend API layers and frontend route boundaries.
          </p>
        </div>
      </div>

      {/* User Accounts Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoUsers.map(u => {
          const isCurrent = user?.username === u.username;
          return (
            <div
              key={u.username}
              className={`p-4 rounded-xl border transition-all shadow-xs ${
                isCurrent
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-100'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                  {u.name.charAt(0)}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    ACTIVE USER
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-800 text-xs">{u.name}</div>
              <div className="text-[11px] font-mono text-blue-600 font-semibold">{u.role}</div>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-3">{u.desc}</p>
              <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => switchRole(u.role)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition-colors"
                >
                  Switch To This Persona
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Operational Role Permissions Matrix
          </h2>
          <span className="text-xs text-slate-500">Dual Layer Validation (API + UI)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold">System Capability / Operation</th>
                <th className="px-4 py-3 font-bold text-center">Operator</th>
                <th className="px-4 py-3 font-bold text-center">Quality Engineer</th>
                <th className="px-4 py-3 font-bold text-center">Supervisor</th>
                <th className="px-4 py-3 font-bold text-center">Quality Manager / Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 text-slate-800 font-semibold">{p.feature}</td>
                  <td className="px-4 py-2.5 text-center">
                    {p.operator ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {p.qe ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {p.super ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {p.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Bell, Shield, Eye, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    user,
    selectedLine,
    setSelectedLine,
    selectedShift,
    setSelectedShift,
    openAlertsCount,
    switchRole,
    refreshAlertsCount,
    quickView,
    setQuickView,
    highContrast,
    setHighContrast
  } = useAuth();

  const lines = ['ALL', 'D1', 'D2', 'D3', 'D4'];
  const shifts = [
    { num: 1, label: 'Shift 1 (06:00-14:00)' },
    { num: 2, label: 'Shift 2 (14:00-22:00)' },
    { num: 3, label: 'Shift 3 (22:00-06:00)' },
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'operator', label: 'Operator (Shop Floor)' },
    { role: 'quality_engineer', label: 'Quality Engineer (Lead)' },
    { role: 'supervisor', label: 'Production Supervisor' },
    { role: 'quality_manager', label: 'Quality Manager / Admin' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Production Line & Shift Filter */}
      <div className="flex items-center gap-5">
        {/* Line Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 px-2 tracking-wider">LINE:</span>
          {lines.map(line => (
            <button
              key={line}
              onClick={() => {
                setSelectedLine(line);
                refreshAlertsCount();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                selectedLine === line
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {line}
            </button>
          ))}
        </div>

        {/* Shift Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">SHIFT:</span>
          <select
            value={selectedShift}
            onChange={e => setSelectedShift(Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            {shifts.map(s => (
              <option key={s.num} value={s.num}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Quick Role Switcher, Accessibility/Quick View, Alerts & User Profile */}
      <div className="flex items-center gap-3">
        {/* Basic / Quick View Toggle */}
        <button
          onClick={() => setQuickView(prev => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
            quickView
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
          }`}
          title="Toggle Basic Quick Viewing Mode for Shop-Floor glance"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{quickView ? 'BASIC VIEW' : 'FULL VIEW'}</span>
        </button>

        {/* High Contrast / Glare Shield Mode */}
        <button
          onClick={() => setHighContrast(prev => !prev)}
          className={`flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
            highContrast
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
          }`}
          title="Toggle Foundry High-Contrast Display for dusty/bright shop-floor lighting"
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GLARE MODE</span>
        </button>

        {/* Fast Role Switcher Dropdown for evaluators */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Role Switcher:</span>
          <select
            value={user?.role || 'admin'}
            onChange={e => switchRole(e.target.value as UserRole)}
            className="text-xs bg-transparent text-amber-900 font-bold focus:outline-none cursor-pointer"
          >
            {roles.map(r => (
              <option key={r.role} value={r.role}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alert Bell */}
        <div className="relative">
          <button
            onClick={() => refreshAlertsCount()}
            title="Active Quality Alerts"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {openAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                {openAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">{user?.full_name || 'Loading...'}</div>
            <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

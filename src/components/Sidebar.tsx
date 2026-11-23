import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardPenLine,
  Grid3X3,
  FlaskConical,
  Layers,
  SlidersHorizontal,
  LineChart,
  BarChart3,
  TrendingDown,
  PieChart,
  Network,
  GitBranch,
  ShieldAlert,
  FileSpreadsheet,
  History,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavSection {
  title: string;
  items: {
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: number;
    roles?: string[];
  }[];
}

export const Sidebar: React.FC = () => {
  const { openAlertsCount, user } = useAuth();

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      ]
    },
    {
      title: 'SAND QUALITY LAB',
      items: [
        { name: 'Sand Test Entry', path: '/sand-tests/entry', icon: ClipboardPenLine },
        { name: 'Hourly Monitoring', path: '/sand-tests/hourly', icon: Grid3X3 },
        { name: 'Chemical Tests', path: '/sand-tests/chemical', icon: FlaskConical },
        { name: 'Sand Batches', path: '/sand-tests/batches', icon: Layers },
        { name: 'Parameter Specs', path: '/specifications', icon: SlidersHorizontal },
      ]
    },
    {
      title: 'SPC ANALYTICS',
      items: [
        { name: 'Control Charts', path: '/spc/charts', icon: LineChart },
        { name: 'Process Capability', path: '/spc/capability', icon: BarChart3 },
      ]
    },
    {
      title: 'DEFECTS & REJECTION',
      items: [
        { name: 'Rejection Analytics', path: '/rejections', icon: TrendingDown },
        { name: 'Defect Pareto', path: '/rejections/pareto', icon: PieChart },
        { name: 'Correlation Engine', path: '/correlations', icon: Network },
        { name: 'Root Cause (5-Why)', path: '/root-cause', icon: GitBranch },
      ]
    },
    {
      title: 'COMPLIANCE & IATF',
      items: [
        { name: 'Customer Complaints', path: '/complaints', icon: ShieldAlert },
        { name: 'Quality Alerts', path: '/alerts', icon: ShieldAlert, badge: openAlertsCount },
        { name: 'Reports Center', path: '/reports', icon: FileSpreadsheet },
        { name: 'IATF Audit Trail', path: '/audit-trail', icon: History },
        { name: 'User Management', path: '/users', icon: Users, roles: ['admin', 'quality_manager'] },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-inner">
            4.0
          </div>
          <div>
            <div className="font-bold text-white tracking-wide text-sm leading-tight">PS-010 QUALITY</div>
            <div className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">Foundry Sand & SPC</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {sections.map((sec, idx) => (
          <div key={idx}>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-slate-300 tracking-wider">
              {sec.title}
            </div>
            <nav className="space-y-0.5">
              {sec.items
                .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                .map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Lines D1-D4 Active
          </span>
          <span className="font-mono text-slate-300">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

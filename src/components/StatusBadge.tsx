import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = (status || '').toUpperCase();

  let colors = 'bg-slate-100 text-slate-700 border-slate-200';

  if (norm === 'OK' || norm === 'CONFORMING' || norm === 'HEALTHY' || norm === 'APPROVED' || norm === 'CLOSED' || norm === 'VALIDATED') {
    colors = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  } else if (norm === 'WARNING' || norm === 'WARNING_HIGH' || norm === 'WARNING_LOW' || norm === 'PENDING' || norm === 'UNDER_INVESTIGATION' || norm === 'CAPA_PENDING') {
    colors = 'bg-amber-50 text-amber-700 border-amber-300';
  } else if (norm === 'OUT_OF_SPEC' || norm === 'OUT_OF_SPEC_HIGH' || norm === 'OUT_OF_SPEC_LOW' || norm === 'CRITICAL' || norm === 'OPEN') {
    colors = 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
  } else if (norm === 'ACKNOWLEDGED') {
    colors = 'bg-blue-50 text-blue-700 border-blue-300';
  }

  const px = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-md border tracking-wider uppercase ${px} ${colors}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

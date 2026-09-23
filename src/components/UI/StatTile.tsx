import React from 'react';

export interface StatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: string;
  color?: 'primary' | 'success' | 'amber' | 'neutral';
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  icon,
  trend,
  color = 'primary',
}) => {
  const colorMap = {
    primary: 'var(--color-primary)',
    success: 'var(--color-success)',
    amber: 'var(--color-amber)',
    neutral: 'var(--color-on-surface)',
  };

  return (
    <div className="xem-stat-tile">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: colorMap[color], display: 'inline-flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
        <span className="stat-value" style={{ color: colorMap[color] }}>
          {value}
        </span>
        {trend && (
          <span className="label-sm" style={{ color: 'var(--color-success)' }}>
            {trend}
          </span>
        )}
      </div>
      {subValue && (
        <span className="body-sm" style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          {subValue}
        </span>
      )}
    </div>
  );
};

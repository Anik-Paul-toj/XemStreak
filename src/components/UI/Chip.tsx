import React from 'react';

export interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'amber' | 'muted';
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  variant = 'primary',
  className = '',
  onClick,
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-border)',
    },
    success: {
      backgroundColor: '#E8F8F0',
      color: 'var(--color-success)',
      borderColor: '#B7ECCB',
    },
    amber: {
      backgroundColor: '#FEF3C7',
      color: '#B45309',
      borderColor: '#FDE68A',
    },
    muted: {
      backgroundColor: '#F3F4F6',
      color: 'var(--color-muted)',
      borderColor: '#E5E7EB',
    },
  };

  return (
    <span
      className={`xem-chip ${className}`}
      style={{
        ...variantStyles[variant],
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

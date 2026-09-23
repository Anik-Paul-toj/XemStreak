import React from 'react';

export interface ProgressBarProps {
  current: number;
  max: number;
  height?: number;
  showLabel?: boolean;
  color?: string;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  height = 8,
  showLabel = false,
  color = 'var(--color-primary)',
  animate = true,
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (current / max) * 100 : 0));
  const isComplete = percentage >= 100;
  const barColor = isComplete ? 'var(--color-success)' : color;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
            Progress
          </span>
          <span className="label-sm" style={{ fontWeight: 700, color: barColor }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#E8F1FC',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '9999px',
            transition: animate ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </div>
    </div>
  );
};

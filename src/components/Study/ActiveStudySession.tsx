import React from 'react';
import type { StudySession, TreeStage, TreeCustomization } from '../../types';
import { TreeDisplay } from '../Tree/TreeDisplay';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/ProgressBar';
import { Play, Pause, CheckCircle2, X } from 'lucide-react';

export interface ActiveStudySessionProps {
  session: StudySession;
  elapsedSeconds: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancel: () => void;
  treeStage: TreeStage;
  customization?: TreeCustomization;
}

export const ActiveStudySession: React.FC<ActiveStudySessionProps> = ({
  session,
  elapsedSeconds,
  isRunning,
  onPause,
  onResume,
  onFinish,
  onCancel,
  treeStage,
  customization,
}) => {
  // Format elapsed time HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  // Leaves earned so far in this session
  const leavesAccrued = elapsedSeconds < 180 ? 0 : Math.max(1, Math.floor(elapsedSeconds / 900));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      {/* Top Bar with Cancel / Exit */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="animate-pulse-live"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isRunning ? 'var(--color-success)' : 'var(--color-amber)',
              display: 'inline-block',
            }}
          />
          <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
            {isRunning ? 'FOCUS MODE ACTIVE' : 'TIMER PAUSED'}
          </span>
        </div>

        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '8px 12px',
            borderRadius: 'var(--rounded-md)',
          }}
          title="Cancel session without saving"
        >
          <X size={16} />
          <span>Exit Session</span>
        </button>
      </div>

      {/* Main Focus Console */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          marginTop: '40px',
          marginBottom: '20px',
        }}
      >
        {/* Digital Stopwatch Display */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'clamp(54px, 10vw, 76px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-secondary)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {formatTime(elapsedSeconds)}
          </div>

          <h2
            className="headline-sm"
            style={{
              color: 'var(--color-primary)',
              marginTop: '12px',
              fontWeight: 600,
            }}
          >
            {session.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
            <span className="body-sm" style={{ color: 'var(--color-muted)' }}>
              🍃 +{leavesAccrued} {leavesAccrued === 1 ? 'leaf' : 'leaves'} grown this session
            </span>
          </div>
        </div>

        {/* Target Progress Bar (if targetSeconds > 0) */}
        {session.targetSeconds > 0 && (
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <ProgressBar
              current={elapsedSeconds}
              max={session.targetSeconds}
              height={10}
              showLabel={true}
            />
          </div>
        )}

        {/* Tree Visual in Active State */}
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <TreeDisplay
            stage={treeStage}
            state={isRunning ? 'active_studying' : 'idle'}
            customization={customization}
            size="md"
            showDetails={false}
          />
        </div>

        {/* Timer Control Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {isRunning ? (
            <Button
              variant="secondary"
              size="lg"
              icon={<Pause size={20} />}
              onClick={onPause}
              style={{ flex: 1 }}
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={<Play size={20} fill="currentColor" />}
              onClick={onResume}
              style={{ flex: 1 }}
            >
              Resume
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            icon={<CheckCircle2 size={20} />}
            onClick={onFinish}
            style={{
              flex: 1.2,
              backgroundColor: 'var(--color-success)',
              boxShadow: '0 4px 14px rgba(24, 184, 90, 0.3)',
            }}
          >
            Finish & Save
          </Button>
        </div>
      </div>
    </div>
  );
};

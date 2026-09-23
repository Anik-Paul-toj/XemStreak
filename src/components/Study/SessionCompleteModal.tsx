import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { CompletedSessionSummary } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface SessionCompleteModalProps {
  summary: CompletedSessionSummary | null;
  onClose: () => void;
  currentStreak: number;
}

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  summary,
  onClose,
  currentStreak,
}) => {
  useEffect(() => {
    if (summary) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1D8DEA', '#18B85A', '#F59E0B', '#60A5FA'],
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    }
  }, [summary]);

  if (!summary) return null;

  const mins = Math.floor(summary.durationSeconds / 60);
  const secs = summary.durationSeconds % 60;
  const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <Modal isOpen={!!summary} onClose={onClose} title="" maxWidth="460px">
      <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#EBF3FE',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}
        >
          <Sparkles size={32} />
        </div>

        <h3 className="headline-md" style={{ color: 'var(--color-secondary)' }}>
          Session Complete!
        </h3>
        <p className="body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>
          "{summary.title}" has been saved to your digital garden.
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            margin: '24px 0',
            backgroundColor: 'var(--color-surface)',
            padding: '16px',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>TIME STUDIED</div>
            <div className="stat-value" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>
              {timeFormatted}
            </div>
          </div>

          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>LEAVES GROWN</div>
            <div className="stat-value" style={{ color: 'var(--color-success)', marginTop: '4px' }}>
              +{summary.leavesEarned} 🍃
            </div>
          </div>

          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>CURRENT STREAK</div>
            <div className="stat-value" style={{ color: 'var(--color-amber)', marginTop: '4px' }}>
              🔥 {currentStreak}d
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onClose}
          icon={<ArrowRight size={18} />}
          style={{ width: '100%' }}
        >
          Return to Garden
        </Button>
      </div>
    </Modal>
  );
};

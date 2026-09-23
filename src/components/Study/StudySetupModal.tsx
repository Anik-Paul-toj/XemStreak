import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { SessionMode, StudyRoom } from '../../types';
import { Play, Clock, Sparkles, Target } from 'lucide-react';

export interface StudySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (mode: SessionMode, title: string, durationMinutes: number, roomId?: string) => void;
  joinedRoom?: StudyRoom | null;
}

export const StudySetupModal: React.FC<StudySetupModalProps> = ({
  isOpen,
  onClose,
  onStart,
  joinedRoom,
}) => {
  const [mode, setMode] = useState<SessionMode>('focus');
  const [focusPreset, setFocusPreset] = useState<number>(50); // 50m default
  const [customMinutes, setCustomMinutes] = useState<string>('45');
  const [title, setTitle] = useState<string>('');
  const [linkToRoom, setLinkToRoom] = useState<boolean>(!!joinedRoom);

  const presets = [
    { label: '25m', sub: 'Pomodoro', value: 25 },
    { label: '50m', sub: 'Deep Work', value: 50 },
    { label: '90m', sub: 'Flow State', value: 90 },
    { label: 'Custom', sub: 'Set Time', value: -1 },
  ];

  const handleStart = () => {
    let finalMinutes = 0;
    if (mode === 'focus') {
      finalMinutes = focusPreset === -1 ? Math.max(1, parseInt(customMinutes, 10) || 25) : focusPreset;
    } else if (mode === 'goal') {
      finalMinutes = Math.max(1, parseInt(customMinutes, 10) || 60);
    } // free study has 0

    const defaultTitle = 
      mode === 'focus' ? `${finalMinutes}m Focus Session` :
      mode === 'goal' ? (title.trim() || 'Goal-based Session') :
      'Free Study Session';

    onStart(
      mode,
      title.trim() || defaultTitle,
      finalMinutes,
      linkToRoom && joinedRoom ? joinedRoom.id : undefined
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start Study Session" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Mode Selector Tabs */}
        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '8px', display: 'block' }}>
            SESSION TYPE
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              backgroundColor: 'var(--color-surface)',
              padding: '4px',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setMode('focus')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'focus' ? 'var(--color-neutral)' : 'transparent',
                color: mode === 'focus' ? 'var(--color-primary)' : 'var(--color-muted)',
                fontWeight: mode === 'focus' ? 600 : 500,
                fontSize: '13px',
                boxShadow: mode === 'focus' ? 'var(--shadow-subtle)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Clock size={16} />
              <span>Focus Timer</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('free')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'free' ? 'var(--color-neutral)' : 'transparent',
                color: mode === 'free' ? 'var(--color-primary)' : 'var(--color-muted)',
                fontWeight: mode === 'free' ? 600 : 500,
                fontSize: '13px',
                boxShadow: mode === 'free' ? 'var(--shadow-subtle)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={16} />
              <span>Free Study</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('goal')}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'goal' ? 'var(--color-neutral)' : 'transparent',
                color: mode === 'goal' ? 'var(--color-primary)' : 'var(--color-muted)',
                fontWeight: mode === 'goal' ? 600 : 500,
                fontSize: '13px',
                boxShadow: mode === 'goal' ? 'var(--shadow-subtle)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Target size={16} />
              <span>Goal-Based</span>
            </button>
          </div>
        </div>

        {/* Focus Mode Presets */}
        {mode === 'focus' && (
          <div>
            <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '8px', display: 'block' }}>
              DURATION PRESET
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {presets.map((p) => {
                const isSelected = focusPreset === p.value;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setFocusPreset(p.value)}
                    style={{
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-neutral)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface)',
                      borderRadius: 'var(--rounded-md)',
                      padding: '12px 6px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 700 }}>{p.label}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{p.sub}</span>
                  </button>
                );
              })}
            </div>

            {focusPreset === -1 && (
              <div style={{ marginTop: '12px' }}>
                <label className="body-sm" style={{ color: 'var(--color-muted)', marginBottom: '4px', display: 'block' }}>
                  Custom Minutes
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="xem-input"
                  placeholder="e.g. 45"
                />
              </div>
            )}
          </div>
        )}

        {/* Free Study Explainer */}
        {mode === 'free' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
              Stopwatch mode allows you to dive into work without a fixed time limit. You can pause and finish anytime, and leaves will accrue organically based on elapsed study duration.
            </p>
          </div>
        )}

        {/* Goal-Based Target Input */}
        {mode === 'goal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
                TARGET GOAL / TASK
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete 3 chapters of Operating Systems"
                className="xem-input"
              />
            </div>
            <div>
              <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
                TARGET DURATION (MINUTES)
              </label>
              <input
                type="number"
                min="5"
                max="600"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="e.g. 120"
                className="xem-input"
              />
            </div>
          </div>
        )}

        {/* Session Name (Optional for Focus/Free) */}
        {mode !== 'goal' && (
          <div>
            <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
              SESSION TITLE (OPTIONAL)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. LeetCode Graph Problems"
              className="xem-input"
            />
          </div>
        )}

        {/* Study Room Linking Option */}
        {joinedRoom && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <span className="body-sm" style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>
                Study in room "{joinedRoom.name}"
              </span>
              <p className="body-sm" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                Your study time will sync with this room's live roster.
              </p>
            </div>
            <input
              type="checkbox"
              checked={linkToRoom}
              onChange={(e) => setLinkToRoom(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Play size={18} fill="currentColor" />} onClick={handleStart} style={{ flex: 2 }}>
            Start Studying
          </Button>
        </div>
      </div>
    </Modal>
  );
};

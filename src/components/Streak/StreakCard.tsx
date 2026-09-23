import React, { useState } from 'react';
import { Card } from '../UI/Card';
import type { StreakData } from '../../types';
import { Check, Award, SlidersHorizontal } from 'lucide-react';

export interface StreakCardProps {
  streakData: StreakData;
  onOpenMilestones: () => void;
  onUpdateDailyGoal?: (newGoalMins: number) => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakData,
  onOpenMilestones,
  onUpdateDailyGoal,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState(Math.round(streakData.dailyGoalSeconds / 60));

  const handleSaveGoal = () => {
    if (onUpdateDailyGoal) {
      onUpdateDailyGoal(Math.max(10, goalMinutes));
    }
    setIsEditingGoal(false);
  };

  return (
    <Card hoverable={true} padding="22px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="overline" style={{ color: 'var(--color-primary)' }}>
              CONSISTENCY ENGINE
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
            <span className="headline-md" style={{ color: 'var(--color-secondary)' }}>
              🔥 {streakData.currentStreak} Day Streak
            </span>
            <span className="body-sm" style={{ color: 'var(--color-muted)' }}>
              (Personal best: {streakData.longestStreak} days)
            </span>
          </div>
        </div>

        <button
          onClick={onOpenMilestones}
          className="xem-button-secondary"
          style={{ height: '38px', padding: '6px 14px', fontSize: '13px' }}
        >
          <Award size={16} />
          <span>Milestones</span>
        </button>
      </div>

      {/* Week Calendar Checklist */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
            THIS WEEK'S TARGETS
          </span>
          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <SlidersHorizontal size={12} />
            <span>Goal: {Math.round(streakData.dailyGoalSeconds / 60)}m/day</span>
          </button>
        </div>

        {isEditingGoal && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
              marginBottom: '12px',
            }}
          >
            <span className="body-sm" style={{ color: 'var(--color-muted)' }}>
              Set daily goal (minutes):
            </span>
            <input
              type="number"
              min="10"
              max="480"
              value={goalMinutes}
              onChange={(e) => setGoalMinutes(parseInt(e.target.value, 10) || 60)}
              style={{
                width: '80px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSaveGoal}
              className="xem-button-primary"
              style={{ height: '32px', padding: '4px 12px', fontSize: '12px' }}
            >
              Save
            </button>
          </div>
        )}

        {/* 7-Day Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
          }}
        >
          {streakData.weekHistory.map((day) => {
            const mins = Math.round(day.seconds / 60);
            return (
              <div
                key={day.dayName}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 4px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: day.metGoal ? '#E8F8F0' : 'var(--color-surface)',
                  border: `1px solid ${day.metGoal ? '#B7ECCB' : 'var(--color-border)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <span
                  className="label-sm"
                  style={{
                    color: day.metGoal ? 'var(--color-success)' : 'var(--color-muted)',
                    fontSize: '11px',
                  }}
                >
                  {day.dayName}
                </span>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: day.metGoal ? 'var(--color-success)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '6px 0',
                  }}
                >
                  {day.metGoal ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#D1D5DB' }}>•</span>
                  )}
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: day.metGoal ? '#0E6235' : 'var(--color-muted)',
                  }}
                >
                  {mins > 0 ? `${mins}m` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

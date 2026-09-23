import React from 'react';
import { Modal } from '../UI/Modal';
import { Card } from '../UI/Card';
import type { StreakData } from '../../types';
import { BarChart3, Flame, Award } from 'lucide-react';

export interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: StreakData;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  streakData,
}) => {
  const totalHours = (streakData.totalStudySeconds / 3600).toFixed(1);
  const todayHours = (streakData.todayStudySeconds / 3600).toFixed(1);
  const weekTotalSecs = streakData.weekHistory.reduce((acc, d) => acc + d.seconds, 0);
  const weekHours = (weekTotalSecs / 3600).toFixed(1);
  const monthEstimatedHours = (parseFloat(weekHours) * 4.2).toFixed(1);

  // Consistency score (% of days meeting goal)
  const metCount = streakData.weekHistory.filter((d) => d.metGoal).length;
  const consistencyScore = Math.round((metCount / 7) * 100);

  const maxDaySeconds = Math.max(...streakData.weekHistory.map((d) => d.seconds), 7200);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Study Analytics & Rhythm" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div className="xem-stat-tile" style={{ padding: '12px' }}>
            <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '11px' }}>TODAY</span>
            <span className="stat-value" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
              {todayHours}h
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Target: 2.0h</span>
          </div>

          <div className="xem-stat-tile" style={{ padding: '12px' }}>
            <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '11px' }}>THIS WEEK</span>
            <span className="stat-value" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
              {weekHours}h
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-success)' }}>7-day focus</span>
          </div>

          <div className="xem-stat-tile" style={{ padding: '12px' }}>
            <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '11px' }}>THIS MONTH</span>
            <span className="stat-value" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
              {monthEstimatedHours}h
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Estimated</span>
          </div>

          <div className="xem-stat-tile" style={{ padding: '12px' }}>
            <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '11px' }}>ALL-TIME</span>
            <span className="stat-value" style={{ color: 'var(--color-secondary)', fontSize: '20px' }}>
              {totalHours}h
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{streakData.totalStudyDays} days</span>
          </div>
        </div>

        {/* 7-Day Consistency Distribution Chart (Section 28) */}
        <Card padding="18px">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="var(--color-primary)" />
              <span className="label-md" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                7-Day Study Distribution
              </span>
            </div>

            <span className="xem-chip" style={{ fontSize: '11px', padding: '2px 8px' }}>
              Consistency: {consistencyScore}%
            </span>
          </div>

          {/* Bar Chart Columns */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '140px',
              paddingTop: '20px',
              gap: '8px',
            }}
          >
            {streakData.weekHistory.map((day) => {
              const heightPercent = maxDaySeconds > 0 ? Math.round((day.seconds / maxDaySeconds) * 100) : 0;
              const hours = (day.seconds / 3600).toFixed(1);

              return (
                <div
                  key={day.dayName}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 600 }}>
                    {day.seconds > 0 ? `${hours}h` : '-'}
                  </span>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${Math.max(6, heightPercent)}%`,
                      backgroundColor: day.metGoal ? 'var(--color-success)' : 'var(--color-primary-light)',
                      border: `1px solid ${day.metGoal ? '#18B85A' : 'var(--color-border)'}`,
                      borderRadius: '4px',
                      transition: 'height 0.4s ease',
                    }}
                  />

                  <span
                    className="label-sm"
                    style={{
                      fontSize: '11px',
                      color: day.metGoal ? 'var(--color-success)' : 'var(--color-muted)',
                      fontWeight: day.metGoal ? 700 : 500,
                    }}
                  >
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Long-term Consistency Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Flame size={24} color="var(--color-amber)" />
            <div>
              <div className="label-sm" style={{ color: 'var(--color-muted)' }}>CURRENT / LONGEST STREAK</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
                {streakData.currentStreak}d <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>/ {streakData.longestStreak}d best</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Award size={24} color="var(--color-primary)" />
            <div>
              <div className="label-sm" style={{ color: 'var(--color-muted)' }}>TOTAL HARVESTED FOLIAGE</div>
              <div className="stat-value" style={{ fontSize: '18px', color: 'var(--color-success)' }}>
                {streakData.totalLeaves} Leaves
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import type { UserProfile, StreakData } from '../../types';
import { Button } from '../UI/Button';
import { Flame, Play, ShieldCheck, TreePine } from 'lucide-react';

export interface NavbarProps {
  profile: UserProfile;
  streakData: StreakData;
  onStartStudy: () => void;
  onOpenMilestones: () => void;
  onToggleGhostMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  streakData,
  onStartStudy,
  onOpenMilestones,
  onToggleGhostMode,
}) => {
  return (
    <header
      style={{
        backgroundColor: 'var(--color-neutral)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--rounded-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-neutral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29, 141, 234, 0.3)',
            }}
          >
            <TreePine size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: '19px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-secondary)',
                }}
              >
                Xem<span style={{ color: 'var(--color-primary)' }}>Streak</span>
              </span>
              <span
                className="xem-chip"
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                }}
              >
                PWA
              </span>
            </div>
          </div>
        </div>

        {/* Center Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Streak pill */}
          <button
            onClick={onOpenMilestones}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FDE68A',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-full)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
            }}
            title="View streak milestones"
          >
            <Flame size={15} fill="#F59E0B" color="#F59E0B" />
            <span>{streakData.currentStreak} Days</span>
          </button>

          {/* Leaf Total Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E8F8F0',
              color: 'var(--color-success)',
              border: '1px solid #B7ECCB',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-full)',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <span>🍃</span>
            <span>{streakData.totalLeaves} Leaves</span>
          </div>

          {/* Ghost Mode Toggle */}
          <button
            onClick={onToggleGhostMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: profile.ghostMode ? '#FEF3C7' : 'var(--color-surface)',
              color: profile.ghostMode ? '#B45309' : 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              padding: '6px 12px',
              borderRadius: 'var(--rounded-full)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
            title={profile.ghostMode ? "Ghost Mode Active: Activity hidden in rooms" : "Click to activate Ghost Mode"}
          >
            <ShieldCheck size={14} />
            <span>{profile.ghostMode ? 'Ghost: On' : 'Ghost: Off'}</span>
          </button>
        </div>

        {/* Right CTA & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={15} fill="currentColor" />}
            onClick={onStartStudy}
          >
            Start Studying
          </Button>

          {/* User Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1D8DEA',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
            }}
            title={profile.name}
          >
            {profile.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

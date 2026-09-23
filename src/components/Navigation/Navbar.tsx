import React from 'react';
import type { UserProfile, StreakData } from '../../types';
import { Button } from '../UI/Button';
import { Flame, Play, ShieldCheck, TreePine, Bot, BarChart2, Compass } from 'lucide-react';

export interface NavbarProps {
  profile: UserProfile;
  streakData: StreakData;
  onStartStudy: () => void;
  onOpenMilestones: () => void;
  onToggleGhostMode: () => void;
  onOpenAICompanion: () => void;
  onOpenGardenSpace: () => void;
  onOpenAnalytics: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  streakData,
  onStartStudy,
  onOpenMilestones,
  onToggleGhostMode,
  onOpenAICompanion,
  onOpenGardenSpace,
  onOpenAnalytics,
  isBackendConnected,
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
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--rounded-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-neutral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29, 141, 234, 0.3)',
            }}
          >
            <TreePine size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: '18px',
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

        {/* Center Navigation Links & Quick Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              padding: '5px 12px',
              borderRadius: 'var(--rounded-full)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
            }}
            title="View streak milestones"
          >
            <Flame size={14} fill="#F59E0B" color="#F59E0B" />
            <span>{streakData.currentStreak} Days</span>
          </button>

          {/* Level Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E8F8F0',
              color: 'var(--color-success)',
              border: '1px solid #B7ECCB',
              padding: '5px 12px',
              borderRadius: 'var(--rounded-full)',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <span>🌳</span>
            <span>Lvl {streakData.treeLevel || 14}</span>
          </div>

          {/* Personal Space Trigger */}
          <button
            onClick={onOpenGardenSpace}
            className="xem-button-secondary"
            style={{ height: '34px', padding: '4px 10px', fontSize: '12px' }}
            title="Open Personal Tree Garden & Soundscapes"
          >
            <Compass size={14} />
            <span>Sanctuary</span>
          </button>

          {/* Analytics Trigger */}
          <button
            onClick={onOpenAnalytics}
            className="xem-button-secondary"
            style={{ height: '34px', padding: '4px 10px', fontSize: '12px' }}
            title="View Study Analytics"
          >
            <BarChart2 size={14} />
            <span>Analytics</span>
          </button>

          {/* AI Study Companion Trigger */}
          <button
            onClick={onOpenAICompanion}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
              padding: '5px 12px',
              borderRadius: 'var(--rounded-full)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
            }}
            title="Open AI Study Companion"
          >
            <Bot size={15} />
            <span>AI Companion</span>
          </button>

          {/* Ghost Mode Toggle */}
          <button
            onClick={onToggleGhostMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: profile.ghostMode ? '#FEF3C7' : 'var(--color-surface)',
              color: profile.ghostMode ? '#B45309' : 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              padding: '5px 10px',
              borderRadius: 'var(--rounded-full)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
            }}
            title={profile.ghostMode ? "Ghost Mode Active: Activity hidden in rooms" : "Click to activate Ghost Mode"}
          >
            <ShieldCheck size={13} />
            <span>{profile.ghostMode ? 'Ghost' : 'Incognito'}</span>
          </button>

          {/* Backend Connection Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              color: isBackendConnected ? 'var(--color-success)' : 'var(--color-muted)',
              padding: '2px 8px',
            }}
            title={isBackendConnected ? "Connected to FastAPI Backend (SQLite)" : "Offline-First Mode (Local Sync Active)"}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isBackendConnected ? 'var(--color-success)' : '#F59E0B',
                display: 'inline-block',
              }}
            />
            <span>{isBackendConnected ? 'FastAPI' : 'Offline'}</span>
          </div>
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={14} fill="currentColor" />}
            onClick={onStartStudy}
          >
            Start Studying
          </Button>

          {/* User Avatar */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#1D8DEA',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
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

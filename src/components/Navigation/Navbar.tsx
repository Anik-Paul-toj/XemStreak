import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, StreakData } from '../../types';
import { Button } from '../UI/Button';
import { Flame, Play, ShieldCheck, TreePine, BarChart2, Compass, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';

export interface NavbarProps {
  profile: UserProfile;
  streakData: StreakData;
  onStartStudy: () => void;
  onOpenMilestones: () => void;
  onToggleGhostMode: () => void;
  onOpenGardenSpace: () => void;
  onOpenAnalytics: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  streakData,
  onStartStudy,
  onOpenMilestones,
  onToggleGhostMode,
  onOpenGardenSpace,
  onOpenAnalytics,
  onOpenAuth,
  onLogout,
  isBackendConnected,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = Boolean(profile.id && profile.name !== 'Guest Learner');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

        {/* Right CTA & Account controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={14} fill="currentColor" />}
            onClick={onStartStudy}
          >
            Start Studying
          </Button>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--rounded-full)',
                  padding: '3px 8px 3px 4px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-neutral)',
                }}
                title={`Logged in as ${profile.name}`}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.name}
                </span>
                <ChevronDown size={14} color="var(--color-muted)" />
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    backgroundColor: 'var(--color-neutral)',
                    borderRadius: 'var(--rounded-lg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-elevated)',
                    padding: '12px',
                    zIndex: 100,
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  <div style={{ paddingBottom: '10px', marginBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      {profile.name}
                    </div>
                    {profile.email && (
                      <div style={{ fontSize: '11px', color: 'var(--color-muted)', wordBreak: 'break-all' }}>
                        {profile.email}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px', fontWeight: 600 }}>
                      Daily Goal: {Math.round(streakData.dailyGoalSeconds / 60)} mins
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--rounded-sm)',
                      color: 'var(--color-error)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="xem-button-secondary"
                style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                style={{
                  height: '34px',
                  padding: '0 12px',
                  fontSize: '12px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--rounded-md)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <UserPlus size={13} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { api } from '../../services/api';
import { storageService } from '../../services/storage';
import type { UserProfile, StreakData } from '../../types';
import { TreePine, Lock, Mail, User, Sparkles, X, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userProfile: UserProfile, streak: StreakData) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(120); // 2h default
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successStep, setSuccessStep] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Please fill in all required fields.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        try {
          const authRes = await api.register(
            username.trim(),
            email.trim(),
            password,
            dailyGoalMinutes * 60
          );

          // Build clean fresh profile & streak for new user
          const newProfile: UserProfile = {
            id: authRes.user_id,
            name: authRes.username,
            email: email.trim(),
            ghostMode: false,
            joinedRoomId: undefined,
            ambientSound: 'rain',
          };

          const newStreak: StreakData = {
            currentStreak: 0,
            longestStreak: 0,
            totalStudyDays: 0,
            totalStudySeconds: 0,
            todayStudySeconds: 0,
            dailyGoalSeconds: dailyGoalMinutes * 60,
            leavesGrownToday: 0,
            totalLeaves: 0,
            treeLevel: 1, // Stage 1: Seed
            xp: 0,
            weekHistory: storageService.getStreakData().weekHistory,
            lastStudyDate: '',
            daysSinceLastStudy: 0,
          };

          storageService.saveProfile(newProfile);
          storageService.saveStreakData(newStreak);

          setSuccessStep(true);
          setTimeout(() => {
            onAuthSuccess(newProfile, newStreak);
            onClose();
          }, 1500);
        } catch (apiErr: unknown) {
          // If backend is offline, support offline-first local account
          const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
          if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('API Error 500')) {
            const localId = 'local-' + Date.now();
            const newProfile: UserProfile = {
              id: localId,
              name: username.trim(),
              email: email.trim(),
              ghostMode: false,
              ambientSound: 'rain',
            };
            const newStreak: StreakData = {
              currentStreak: 0,
              longestStreak: 0,
              totalStudyDays: 0,
              totalStudySeconds: 0,
              todayStudySeconds: 0,
              dailyGoalSeconds: dailyGoalMinutes * 60,
              leavesGrownToday: 0,
              totalLeaves: 0,
              treeLevel: 1,
              xp: 0,
              weekHistory: storageService.getStreakData().weekHistory,
              lastStudyDate: '',
              daysSinceLastStudy: 0,
            };
            storageService.saveProfile(newProfile);
            storageService.saveStreakData(newStreak);
            setSuccessStep(true);
            setTimeout(() => {
              onAuthSuccess(newProfile, newStreak);
              onClose();
            }, 1200);
            return;
          }
          setErrorMsg(msg.replace(/^API Error \d+:\s*/, ''));
        }
      } else {
        // LOGIN
        if (!username.trim() || !password.trim()) {
          setErrorMsg('Please enter your username/email and password.');
          setLoading(false);
          return;
        }

        try {
          await api.login(username.trim(), password);
          const meData = await api.getMe();

          const updatedProfile: UserProfile = {
            id: meData.id,
            name: meData.username,
            email: meData.email,
            ghostMode: meData.ghost_mode,
            ambientSound: (meData.ambient_sound as UserProfile['ambientSound']) || 'rain',
          };

          const updatedStreak: StreakData = {
            currentStreak: meData.current_streak,
            longestStreak: meData.longest_streak,
            totalStudyDays: meData.total_study_days,
            totalStudySeconds: meData.total_study_days * 3600, // approximate or from analytics
            todayStudySeconds: meData.leaves_today > 0 ? meData.leaves_today * 900 : 0,
            dailyGoalSeconds: meData.daily_goal_seconds || 7200,
            leavesGrownToday: meData.leaves_today,
            totalLeaves: meData.total_leaves,
            treeLevel: (meData.tree_level as StreakData['treeLevel']) || 1,
            xp: meData.xp || 0,
            weekHistory: storageService.getStreakData().weekHistory,
            lastStudyDate: new Date().toISOString().split('T')[0],
            daysSinceLastStudy: 0,
          };

          storageService.saveProfile(updatedProfile);
          storageService.saveStreakData(updatedStreak);

          onAuthSuccess(updatedProfile, updatedStreak);
          onClose();
        } catch (apiErr: unknown) {
          const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
          setErrorMsg(msg.includes('401') ? 'Invalid username/email or password.' : msg.replace(/^API Error \d+:\s*/, ''));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="xem-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--color-neutral)',
          borderRadius: 'var(--rounded-xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-elevated)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: 'var(--rounded-sm)',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {successStep ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#E8F8F0',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 className="headline-sm" style={{ color: 'var(--color-secondary)' }}>
              Seed Planted Successfully! 🌱
            </h3>
            <p className="body-md" style={{ color: 'var(--color-muted)', marginTop: '8px' }}>
              Welcome to XemStreak, <strong>{username}</strong>. Your study tree is ready to grow with your very first focus session.
            </p>
          </div>
        ) : (
          <>
            {/* Header with Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TreePine size={24} />
              </div>
              <div>
                <h3 className="headline-sm" style={{ color: 'var(--color-secondary)' }}>
                  {mode === 'signup' ? 'Start Your Study Streak' : 'Welcome Back'}
                </h3>
                <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
                  {mode === 'signup'
                    ? 'Plant your tree and build lifelong study habits.'
                    : 'Sign in to access your growing tree & study history.'}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--rounded-md)',
                padding: '4px',
                marginBottom: '20px',
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--rounded-sm)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'signup' ? 'var(--color-neutral)' : 'transparent',
                  color: mode === 'signup' ? 'var(--color-primary)' : 'var(--color-muted)',
                  boxShadow: mode === 'signup' ? 'var(--shadow-subtle)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--rounded-sm)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: mode === 'login' ? 'var(--color-neutral)' : 'transparent',
                  color: mode === 'login' ? 'var(--color-primary)' : 'var(--color-muted)',
                  boxShadow: mode === 'login' ? 'var(--shadow-subtle)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: 'var(--rounded-md)',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-error)',
                  fontSize: '13px',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '4px', display: 'block' }}>
                  {mode === 'signup' ? 'USERNAME' : 'USERNAME OR EMAIL'}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-muted)' }} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={mode === 'signup' ? 'e.g. AlexLearner' : 'Enter username or email'}
                    className="xem-input"
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '4px', display: 'block' }}>
                    EMAIL ADDRESS
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-muted)' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="xem-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '4px', display: 'block' }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-muted)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="xem-input"
                    style={{ paddingLeft: '38px', width: '100%' }}
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
                    DAILY STUDY GOAL
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                      { label: '30m', mins: 30 },
                      { label: '60m', mins: 60 },
                      { label: '90m', mins: 90 },
                      { label: '2 Hours', mins: 120 },
                    ].map((g) => (
                      <button
                        key={g.mins}
                        type="button"
                        onClick={() => setDailyGoalMinutes(g.mins)}
                        style={{
                          padding: '6px 4px',
                          borderRadius: 'var(--rounded-md)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: dailyGoalMinutes === g.mins
                            ? '2px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          backgroundColor: dailyGoalMinutes === g.mins
                            ? 'var(--color-primary-light)'
                            : 'var(--color-surface)',
                          color: dailyGoalMinutes === g.mins
                            ? 'var(--color-primary)'
                            : 'var(--color-muted)',
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
                icon={mode === 'signup' ? <Sparkles size={18} /> : <ArrowRight size={18} />}
                style={{ marginTop: '8px', width: '100%' }}
              >
                {loading
                  ? 'Connecting...'
                  : mode === 'signup'
                  ? 'Plant My Seed & Start'
                  : 'Sign In'}
              </Button>
            </form>

            {/* Guest note */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Or continue exploring as Guest
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

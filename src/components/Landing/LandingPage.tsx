import React, { useState } from 'react';
import {
  TreePine,
  Play,
  Bot,
  Users,
  Headphones,
  Award,
  Sparkles,
  Flame,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3,
  LogIn,
  UserPlus
} from 'lucide-react';
import type { SpriteStageLevel } from '../../types';
import { Button } from '../UI/Button';
import { TreeDisplay } from '../Tree/TreeDisplay';
import { TreeEvolutionModal } from '../Tree/TreeEvolutionModal';

export interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreAsGuest?: () => void;
  isBackendConnected?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
}) => {
  const [previewStage, setPreviewStage] = useState<number>(7); // Stage 7: Blooming Sapling
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);

  const stagesPreview = [
    { level: 1, name: 'Seed', icon: '🌰', desc: 'Plant your focus habit with 1st session.' },
    { level: 4, name: 'Sprout', icon: '🌱', desc: 'First roots take hold as streak begins.' },
    { level: 7, name: 'Sapling', icon: '🌿', desc: 'Leaves bloom daily with consistent focus.' },
    { level: 14, name: 'Elder Oak', icon: '🌳', desc: 'Mighty canopy sheltering deep study hours.' },
    { level: 22, name: 'Celestial Tree', icon: '✨', desc: 'Mythic botanical mastery achieved.' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-secondary)',
        fontFamily: 'var(--font-family-base)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          1. HEADER / NAVIGATION
          ========================================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '12px clamp(12px, 3vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--rounded-md)',
                background: 'linear-gradient(135deg, #1D8DEA 0%, #2563EB 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(29, 141, 234, 0.3)',
              }}
            >
              <TreePine size={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-secondary)',
                }}
              >
                Xem<span style={{ color: 'var(--color-primary)' }}>Streak</span>
              </span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: 'var(--rounded-full)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                }}
              >
                STUDY OS
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <a
              href="#features"
              style={{
                color: 'var(--color-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              Features
            </a>
            <button
              onClick={() => setIsTreeModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-muted)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              title="Click to view all 22 evolution stages"
            >
              <span>22-Stage Tree</span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: 'var(--rounded-full)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                }}
              >
                Explorer
              </span>
            </button>
            <a
              href="#study-rooms"
              style={{
                color: 'var(--color-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              Study Rooms
            </a>
            <a
              href="#ai-companion"
              style={{
                color: 'var(--color-muted)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              AI Companion
            </a>
          </nav>

          {/* Auth Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: 'transparent',
                color: 'var(--color-secondary)',
                border: '1px solid var(--color-border)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus size={15} />}
              onClick={() => onOpenAuth('signup')}
              style={{
                padding: '8px 18px',
                boxShadow: '0 4px 14px rgba(29, 141, 234, 0.35)',
              }}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(32px, 6vw, 60px) clamp(14px, 3vw, 24px)',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Subtle decorative background glows */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(29, 141, 234, 0.12) 0%, rgba(217, 232, 255, 0.04) 70%, transparent 100%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          className="grid-landing-hero"
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Hero Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Pill Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-border)',
                  padding: '6px 14px',
                  borderRadius: 'var(--rounded-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                <Sparkles size={14} />
                <span>Next-Gen Habit Gamification & Focus Studio</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(28px, 5.5vw, 46px)',
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--color-secondary)',
              }}
            >
              Turn Every Minute of Focus into a{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #1D8DEA 0%, #166534 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Living Forest.
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--color-muted)',
                maxWidth: '520px',
              }}
            >
              XemStreak elevates your daily study routines into an immersive botanical ecosystem.
              Nurture a <strong>22-stage living sprite tree</strong>, co-work in real-time rooms,
              and stay unstoppable with your built-in <strong>AI Study Companion</strong>.
            </p>

            {/* Dual CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="lg"
                icon={<Play size={18} fill="currentColor" />}
                onClick={() => onOpenAuth('signup')}
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  boxShadow: '0 8px 24px rgba(29, 141, 234, 0.4)',
                }}
              >
                Start Growing (Free)
              </Button>

              <button
                onClick={() => onOpenAuth('login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-secondary)',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Social Proof & Value Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>
                  22 Evolution Stages
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>
                  Zero Ads & Free Forever
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>
                  Offline-First & Cloud Sync
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Interactive App Preview Showcase */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--rounded-xl)',
              backgroundColor: 'var(--color-neutral)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-elevated)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Window Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ marginLeft: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)' }}>
                  XemStreak Live Ecosystem
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#10B981',
                  fontWeight: 700,
                  backgroundColor: '#ECFDF5',
                  padding: '3px 8px',
                  borderRadius: 'var(--rounded-full)',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>ACTIVE SESSION</span>
              </div>
            </div>

            {/* Tree Showcase Visual */}
            <div
              onClick={() => setIsTreeModalOpen(true)}
              style={{
                position: 'relative',
                height: '240px',
                background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid #BAE6FD',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              title="Click to explore all 22 stages in detail"
            >
              <TreeDisplay
                level={previewStage as SpriteStageLevel}
                size="md"
                showDetails={false}
                state="active_studying"
              />

              {/* Tree Stage Badge */}
              <div
                style={{
                  marginTop: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  padding: '5px 12px',
                  borderRadius: 'var(--rounded-full)',
                  boxShadow: 'var(--shadow-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  Level {previewStage} / 22
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>
                  Click to Explore 22 Stages ✨
                </span>
              </div>
            </div>

            {/* Stage Selector Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              {stagesPreview.map((s) => (
                <button
                  key={s.level}
                  onClick={() => setPreviewStage(s.level)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '8px 4px',
                    borderRadius: 'var(--rounded-md)',
                    border: `1.5px solid ${previewStage === s.level ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: previewStage === s.level ? 'var(--color-primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{s.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: previewStage === s.level ? 'var(--color-primary)' : 'var(--color-muted)' }}>
                    Lvl {s.level}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Interactive Stats Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                paddingTop: '6px',
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '11px', fontWeight: 700 }}>
                  <Flame size={13} fill="#F59E0B" />
                  <span>STREAK</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px', color: 'var(--color-secondary)' }}>
                  14 Days
                </div>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 700 }}>
                  <Clock size={13} />
                  <span>FOCUS TIME</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px', color: 'var(--color-secondary)' }}>
                  2h 45m
                </div>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>
                  <Award size={13} />
                  <span>HARVEST</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px', color: 'var(--color-secondary)' }}>
                  18 Leaves
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CORE FEATURES GRID
          ========================================================================= */}
      <section
        id="features"
        style={{
          padding: 'clamp(48px, 8vw, 80px) clamp(14px, 3vw, 24px)',
          backgroundColor: 'var(--color-neutral)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
              }}
            >
              POWERFUL CAPABILITIES
            </span>
            <h2
              style={{
                fontSize: 'clamp(24px, 4.5vw, 34px)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginTop: '8px',
                color: 'var(--color-secondary)',
              }}
            >
              Everything you need to sustain lifelong study momentum
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', marginTop: '12px', lineHeight: 1.6 }}>
              XemStreak bridges gamification, focus psychology, and social accountability into a frictionless daily workspace.
            </p>
          </div>

          {/* Features Responsive Grid */}
          <div
            className="grid-features-responsive"
          >
            {/* Feature 1: 22-Stage Living Tree */}
            <div
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <TreePine size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                22-Stage Botanical Evolution
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Watch your dormant seed evolve into an ancient guardian tree through 22 distinct sprite levels.
                Missing study days temporarily withers branches, driving urgency and discipline.
              </p>
            </div>

            {/* Feature 2: Real-time Study Rooms */}
            <div
              id="study-rooms"
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                Real-Time Collaborative Study Halls
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Create public or passcode-protected study rooms. See active peers timer-sync live,
                celebrate daily milestones together, and send cheer boosts to keep momentum high.
              </p>
            </div>

            {/* Feature 3: AI Study Companion */}
            <div
              id="ai-companion"
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#F5F3FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Bot size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                Adaptive AI Study Companion
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Always accessible via the floating assistant button. Ask for Pomodoro breakdowns,
                motivation when feeling lazy, tree health diagnostics, or instant subject reviews.
              </p>
            </div>

            {/* Feature 4: Audio Sanctuary */}
            <div
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Headphones size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                Built-in Audio Sanctuary
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Immerse yourself in gentle rainstorms, deep forest streams, crackling campfire,
                or cozy coffee shop acoustics without leaving your workspace.
              </p>
            </div>

            {/* Feature 5: Streak Freeze & Perks */}
            <div
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Flame size={26} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                Milestones, Pots & Auras
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Unlock custom ceramic pots, floating auras, and rare flora as you cross 3, 7, 14, 30, and 100-day streaks.
                Protect your streak with automated streak freezes.
              </p>
            </div>

            {/* Feature 6: Deep Analytics & Offline Sync */}
            <div
              style={{
                padding: '32px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: '#F0F9FF',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <BarChart3 size={26} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '10px' }}>
                Offline-First & Fast Cloud Sync
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
                Study anytime with zero lag. All sessions save instantly to local storage and sync to your account
                via FastAPI backend whenever connection is restored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS (3 STEPS)
          ========================================================================= */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
            }}
          >
            SIMPLE 3-STEP CYCLE
          </span>
          <h2
            style={{
              fontSize: '34px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginTop: '8px',
              color: 'var(--color-secondary)',
            }}
          >
            How XemStreak builds bulletproof focus
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            position: 'relative',
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              padding: '30px',
              backgroundColor: 'var(--color-neutral)',
              borderRadius: 'var(--rounded-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-subtle)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '8px' }}>
              Set Daily Goal & Mode
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
              Choose between <strong>Focus Session (25/50m)</strong>, <strong>Free Timer</strong>, or custom <strong>Target Goals</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div
            style={{
              padding: '30px',
              backgroundColor: 'var(--color-neutral)',
              borderRadius: 'var(--rounded-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-subtle)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '8px' }}>
              Study & Grow Your Tree
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
              Every minute yields organic XP and freshly sprouted leaves that keep your tree flourishing and green.
            </p>
          </div>

          {/* Step 3 */}
          <div
            style={{
              padding: '30px',
              backgroundColor: 'var(--color-neutral)',
              borderRadius: 'var(--rounded-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-subtle)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '8px' }}>
              Unlock Sanctuary Perks
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>
              Equip rare botanical pots, radiant cosmic auras, and share leaderboard victories in your study rooms.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BOTTOM HERO CTA BANNER
          ========================================================================= */}
      <section
        style={{
          padding: 'clamp(36px, 6vw, 60px) clamp(14px, 3vw, 24px)',
          maxWidth: '1240px',
          margin: '0 auto clamp(40px, 6vw, 80px)',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1D8DEA 0%, #1E40AF 100%)',
            borderRadius: 'var(--rounded-xl)',
            padding: 'clamp(32px, 5vw, 56px) clamp(18px, 4vw, 40px)',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(29, 141, 234, 0.35)',
          }}
        >
          {/* Subtle background circle decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              pointerEvents: 'none',
            }}
          />

          <h2
            style={{
              fontSize: 'clamp(22px, 5vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            Ready to master your focus and grow your study tree?
          </h2>
          <p
            style={{
              fontSize: '17px',
              opacity: 0.9,
              maxWidth: '560px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Join learners cultivating deep work habits every day. No credit card required.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => onOpenAuth('signup')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
              }}
            >
              <UserPlus size={18} />
              <span>Create Free Account</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOOTER
          ========================================================================= */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: 'var(--color-neutral)',
          borderTop: '1px solid var(--color-border)',
          padding: '40px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--rounded-sm)',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TreePine size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '16px' }}>
              Xem<span style={{ color: 'var(--color-primary)' }}>Streak</span>
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: '13px', marginLeft: '12px' }}>
              © {new Date().getFullYear()} XemStreak. All rights reserved.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: 'var(--color-muted)' }}>
            <button
              onClick={() => onOpenAuth('login')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
            >
              Sign Up
            </button>
            <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
            <a href="#study-rooms" style={{ color: 'inherit', textDecoration: 'none' }}>Study Rooms</a>
          </div>
        </div>
      </footer>

      {/* 22-Stage Botanical Evolution Explorer Modal */}
      <TreeEvolutionModal
        isOpen={isTreeModalOpen}
        onClose={() => setIsTreeModalOpen(false)}
        onGetStarted={() => onOpenAuth('signup')}
        initialLevel={previewStage as SpriteStageLevel}
      />
    </div>
  );
};

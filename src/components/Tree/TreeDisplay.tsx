import React, { useMemo, useState } from 'react';
import type { TreeStage, TreeState, TreeCustomization, SpriteStageLevel } from '../../types';
import { SPRITE_STAGES_CONFIG } from '../../services/storage';

export interface TreeDisplayProps {
  stage?: TreeStage;
  level?: SpriteStageLevel;
  state?: TreeState;
  customization?: TreeCustomization;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  leavesToday?: number;
  daysMissed?: number;
  xp?: number;
  className?: string;
}

export const TreeDisplay: React.FC<TreeDisplayProps> = ({
  stage = 'young_tree',
  level = 14,
  state = 'idle',
  customization = { pot: 'terracotta', flora: 'sakura_blossom', aura: 'none' },
  size = 'lg',
  showDetails = true,
  leavesToday = 3,
  daysMissed = 0,
  xp = 4200,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Map 7-stage legacy name to 22-level sprite if level isn't explicitly provided
  const resolvedLevel: SpriteStageLevel = useMemo(() => {
    if (level && level >= 1 && level <= 22) return level;
    switch (stage) {
      case 'seed': return 1;
      case 'sprout': return 3;
      case 'sapling': return 9;
      case 'young_tree': return 14;
      case 'mature_tree': return 18;
      case 'large_tree': return 21;
      case 'ancient_tree': return 22;
      default: return 14;
    }
  }, [level, stage]);

  const spriteInfo = SPRITE_STAGES_CONFIG[resolvedLevel] || SPRITE_STAGES_CONFIG[14];
  const isStudying = state === 'active_studying';
  const isMissedDays = state === 'missed_days' || daysMissed > 1;

  // Level XP progress (each level takes 250 XP)
  const xpCurrentLevel = xp % 250;
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / 250) * 100));

  // Dimensions
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { width: 140, height: 160, spriteMaxH: 120 };
      case 'md': return { width: 220, height: 250, spriteMaxH: 190 };
      case 'lg':
      default:   return { width: 320, height: 350, spriteMaxH: 260 };
    }
  }, [size]);

  return (
    <div
      className={`xem-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--color-neutral)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Active Studying Ambient Radial Glow */}
      {isStudying && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 50%, rgba(29, 141, 234, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)',
          }}
        />
      )}

      {/* Missed days friendly return alert */}
      {isMissedDays && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: 'var(--color-primary)',
            padding: '6px 14px',
            borderRadius: 'var(--rounded-full)',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          <span>🌱 Your tree is happy to see you again.</span>
        </div>
      )}

      {/* Sprite & Pot Scene */}
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          paddingBottom: '16px',
        }}
      >
        {/* Floating study particles */}
        {isStudying && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '25%',
                bottom: '40%',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FDE047',
                animation: 'particleFloat 3.2s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '70%',
                bottom: '35%',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#86EFAC',
                animation: 'particleFloat 4s ease-in-out infinite 0.8s',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '50%',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#FBBF24',
                animation: 'particleFloat 2.8s ease-in-out infinite 1.5s',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '35%',
                bottom: '60%',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#93C5FD',
                animation: 'particleFloat 3.6s ease-in-out infinite 2.2s',
              }}
            />
          </div>
        )}

        {/* Tree Sprite Frame */}
        <div
          className={isStudying ? 'animate-sway' : ''}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            maxHeight: `${dimensions.spriteMaxH}px`,
            filter: isMissedDays
              ? 'grayscale(45%) contrast(90%) brightness(95%)'
              : 'none',
            transition: 'filter 0.4s ease',
          }}
        >
          {!imgError ? (
            <img
              src={spriteInfo.spriteUrl}
              alt={spriteInfo.name}
              style={{
                maxHeight: `${dimensions.spriteMaxH}px`,
                maxWidth: '100%',
                objectFit: 'contain',
                filter: isStudying ? 'drop-shadow(0 8px 18px rgba(29, 141, 234, 0.25))' : 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08))',
                transformOrigin: 'bottom center',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <span style={{ fontSize: '48px' }}>🌳</span>
            </div>
          )}
        </div>

        {/* Planter Pot (if equipped and stage is past seed) */}
        {customization.pot !== 'none' && resolvedLevel >= 3 && (
          <div style={{ marginTop: '-8px', position: 'relative', zIndex: 1 }}>
            {customization.pot === 'ceramic' ? (
              <svg width="110" height="26" viewBox="0 0 110 26">
                <path d="M 12 2 L 20 24 Q 55 28 90 24 L 98 2 Z" fill="#1D8DEA" stroke="#1577c9" strokeWidth="1.5" />
                <ellipse cx="55" cy="4" rx="43" ry="4" fill="#D9E8FF" />
              </svg>
            ) : customization.pot === 'zen_stone' ? (
              <svg width="110" height="24" viewBox="0 0 110 24">
                <ellipse cx="55" cy="18" rx="48" ry="6" fill="#4B5563" />
                <ellipse cx="55" cy="8" rx="42" ry="7" fill="#6B7280" />
                <ellipse cx="55" cy="6" rx="36" ry="5" fill="#9CA3AF" />
              </svg>
            ) : (
              <svg width="110" height="26" viewBox="0 0 110 26">
                <path d="M 14 3 L 22 24 Q 55 27 88 24 L 96 3 Z" fill="#C25E34" stroke="#9C441E" strokeWidth="1.5" />
                <ellipse cx="55" cy="4" rx="41" ry="3.5" fill="#E07A4F" />
                <rect x="10" y="1" width="90" height="4" rx="2" fill="#E07A4F" stroke="#9C441E" strokeWidth="1" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Details & Gamification Info */}
      {showDetails && (
        <div
          style={{
            width: '100%',
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '6px',
          }}
        >
          {/* Stage Name & Level Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="headline-sm" style={{ color: 'var(--color-secondary)' }}>
              {spriteInfo.name}
            </span>
            <span
              className="xem-chip"
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontWeight: 700,
              }}
            >
              Lvl {resolvedLevel}/22
            </span>
            <span
              className="xem-chip"
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                backgroundColor: isStudying ? '#E0F2FE' : '#F3F4F6',
                color: isStudying ? 'var(--color-primary)' : 'var(--color-muted)',
              }}
            >
              {isStudying ? '🟢 Studying now' : isMissedDays ? 'Growth paused' : 'Thriving'}
            </span>
          </div>

          <p className="body-sm" style={{ color: 'var(--color-muted)', maxWidth: '300px', fontSize: '13px' }}>
            {spriteInfo.description}
          </p>

          {/* Level XP Bar */}
          <div style={{ width: '100%', maxWidth: '240px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted)', marginBottom: '3px' }}>
              <span>Stage XP</span>
              <span>{xpPercent}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: '#E8F1FC',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {leavesToday !== undefined && (
            <div
              style={{
                marginTop: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🍃</span>
              <span>Your tree grew {leavesToday} {leavesToday === 1 ? 'leaf' : 'leaves'} today.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

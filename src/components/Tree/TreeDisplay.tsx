import React, { useMemo } from 'react';
import type { TreeStage, TreeState, TreeCustomization } from '../../types';
import { TREE_STAGES_CONFIG } from '../../services/storage';

export interface TreeDisplayProps {
  stage: TreeStage;
  state?: TreeState;
  customization?: TreeCustomization;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  leavesToday?: number;
  daysMissed?: number;
  className?: string;
}

/**
 * TreeDisplay Component
 * Designed with a modular architecture so it can be swapped to a 
 * sprite sheet animation renderer in the future.
 */
export const TreeDisplay: React.FC<TreeDisplayProps> = ({
  stage,
  state = 'idle',
  customization = { pot: 'terracotta', flora: 'sakura_blossom', aura: 'none' },
  size = 'lg',
  showDetails = true,
  leavesToday = 3,
  daysMissed = 0,
  className = '',
}) => {
  const stageInfo = TREE_STAGES_CONFIG[stage];
  const isStudying = state === 'active_studying';
  const isMissedDays = state === 'missed_days' || daysMissed > 1;

  // Sizing dimension map
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { width: 140, height: 160 };
      case 'md': return { width: 220, height: 250 };
      case 'lg':
      default:   return { width: 320, height: 340 };
    }
  }, [size]);

  // Color palettes based on state (healthy vs dull missed days)
  const colors = useMemo(() => {
    if (isMissedDays) {
      return {
        trunk: '#7D6A5D',
        foliagePrimary: '#738371',
        foliageSecondary: '#8B9C89',
        foliageHighlight: '#A3B4A1',
        leafGlow: 'rgba(115, 131, 113, 0.2)',
        soil: '#786C5E',
      };
    }
    return {
      trunk: '#5D4037',
      trunkHighlight: '#8D6E63',
      foliagePrimary: '#1E6F38',
      foliageSecondary: '#2E7D32',
      foliageHighlight: '#4CAF50',
      foliageLight: '#81C784',
      leafGlow: 'rgba(76, 175, 80, 0.4)',
      soil: '#4E342E',
    };
  }, [isMissedDays]);

  // Render SVG Vector Art for each Growth Stage
  const renderStageSvg = () => {
    switch (stage) {
      case 'seed':
        return (
          <g>
            {/* Rich Soil mound */}
            <ellipse cx="160" cy="280" rx="42" ry="14" fill={colors.soil} opacity="0.8" />
            <ellipse cx="160" cy="278" rx="34" ry="10" fill={colors.trunk} opacity="0.9" />
            {/* Seed */}
            <path
              d="M 160 262 C 153 262 148 268 152 274 C 156 279 160 281 160 281 C 160 281 164 279 168 274 C 172 268 167 262 160 262 Z"
              fill="#D97706"
              stroke="#B45309"
              strokeWidth="2"
            />
            {/* Tiny green crack / nascent life */}
            <path d="M 160 266 Q 162 269 159 272" stroke="#84CC16" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="160" cy="265" r="2.5" fill="#A3E635" />
          </g>
        );

      case 'sprout':
        return (
          <g>
            {/* Mound */}
            <ellipse cx="160" cy="280" rx="48" ry="14" fill={colors.soil} opacity="0.8" />
            {/* Sprout stem */}
            <path
              d="M 160 278 Q 159 250 160 230"
              stroke={colors.trunkHighlight}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left Cotyledon leaf */}
            <path
              d="M 160 238 C 145 235 136 220 148 214 C 158 218 160 232 160 238 Z"
              fill={colors.foliageHighlight}
            />
            {/* Right Cotyledon leaf */}
            <path
              d="M 160 234 C 175 231 184 216 172 210 C 162 214 160 228 160 234 Z"
              fill={colors.foliageSecondary}
            />
          </g>
        );

      case 'sapling':
        return (
          <g>
            <ellipse cx="160" cy="280" rx="55" ry="15" fill={colors.soil} opacity="0.8" />
            {/* Sturdy stem with branches */}
            <path
              d="M 158 280 Q 159 230 160 190"
              stroke={colors.trunk}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 159 235 Q 145 220 135 215"
              stroke={colors.trunk}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 160 220 Q 175 208 185 204"
              stroke={colors.trunk}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leaf clusters */}
            <circle cx="132" cy="214" r="16" fill={colors.foliageSecondary} />
            <circle cx="186" cy="202" r="16" fill={colors.foliagePrimary} />
            <circle cx="160" cy="184" r="22" fill={colors.foliageHighlight} />
            <circle cx="166" cy="178" r="14" fill={colors.foliageLight || colors.foliageHighlight} />
          </g>
        );

      case 'young_tree':
        return (
          <g>
            <ellipse cx="160" cy="282" rx="65" ry="16" fill={colors.soil} opacity="0.85" />
            {/* Trunk */}
            <path
              d="M 154 282 L 157 200 L 163 200 L 166 282 Z"
              fill={colors.trunk}
            />
            <path d="M 158 240 Q 140 220 128 200" stroke={colors.trunk} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 162 230 Q 180 215 192 195" stroke={colors.trunk} strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Canopy clusters */}
            <circle cx="125" cy="195" r="28" fill={colors.foliagePrimary} />
            <circle cx="195" cy="190" r="28" fill={colors.foliageSecondary} />
            <circle cx="140" cy="165" r="32" fill={colors.foliageSecondary} />
            <circle cx="180" cy="160" r="32" fill={colors.foliageHighlight} />
            <circle cx="160" cy="140" r="34" fill={colors.foliagePrimary} />
            <circle cx="158" cy="132" r="24" fill={colors.foliageLight || colors.foliageHighlight} />
          </g>
        );

      case 'mature_tree':
        return (
          <g>
            <ellipse cx="160" cy="284" rx="75" ry="18" fill={colors.soil} opacity="0.9" />
            {/* Flared roots & thick trunk */}
            <path
              d="M 148 284 C 150 250 152 210 154 180 L 166 180 C 168 210 170 250 172 284 Z"
              fill={colors.trunk}
            />
            <path d="M 154 210 Q 120 180 110 160" stroke={colors.trunk} strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 166 200 Q 200 175 215 155" stroke={colors.trunk} strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 160 180 Q 160 150 160 130" stroke={colors.trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Full canopy */}
            <circle cx="105" cy="155" r="34" fill={colors.foliagePrimary} />
            <circle cx="215" cy="150" r="34" fill={colors.foliagePrimary} />
            <circle cx="130" cy="130" r="42" fill={colors.foliageSecondary} />
            <circle cx="190" cy="125" r="42" fill={colors.foliageSecondary} />
            <circle cx="160" cy="100" r="46" fill={colors.foliageHighlight} />
            <circle cx="160" cy="90" r="34" fill={colors.foliageLight || colors.foliageHighlight} opacity="0.95" />
          </g>
        );

      case 'large_tree':
        return (
          <g>
            <ellipse cx="160" cy="286" rx="88" ry="20" fill={colors.soil} opacity="0.9" />
            {/* Sprawling trunk & buttress roots */}
            <path
              d="M 142 286 C 147 245 150 195 152 165 L 168 165 C 170 195 173 245 178 286 Z"
              fill={colors.trunk}
            />
            <path d="M 152 195 Q 105 165 90 140" stroke={colors.trunk} strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M 168 185 Q 215 160 230 135" stroke={colors.trunk} strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M 160 165 Q 160 130 160 105" stroke={colors.trunk} strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Magnificent broad canopy */}
            <circle cx="85" cy="135" r="40" fill={colors.foliagePrimary} />
            <circle cx="235" cy="130" r="40" fill={colors.foliagePrimary} />
            <circle cx="120" cy="105" r="48" fill={colors.foliageSecondary} />
            <circle cx="200" cy="100" r="48" fill={colors.foliageSecondary} />
            <circle cx="160" cy="75" r="54" fill={colors.foliageHighlight} />
            <circle cx="160" cy="62" r="40" fill={colors.foliageLight || colors.foliageHighlight} />
            <circle cx="135" cy="85" r="26" fill={colors.foliageLight || colors.foliageHighlight} opacity="0.9" />
            <circle cx="185" cy="80" r="26" fill={colors.foliageLight || colors.foliageHighlight} opacity="0.9" />
          </g>
        );

      case 'ancient_tree':
      default:
        return (
          <g>
            <ellipse cx="160" cy="288" rx="100" ry="22" fill={colors.soil} opacity="0.95" />
            {/* Grand ancient knotted trunk */}
            <path
              d="M 136 288 C 142 240 148 185 150 150 L 170 150 C 172 185 178 240 184 288 Z"
              fill={colors.trunk}
            />
            {/* Ancient bark texture details */}
            <path d="M 154 270 Q 158 230 156 190" stroke={colors.trunkHighlight} strokeWidth="2.5" fill="none" opacity="0.7" />
            <path d="M 164 265 Q 162 220 166 180" stroke={colors.trunkHighlight} strokeWidth="2.5" fill="none" opacity="0.7" />
            {/* Broad branches */}
            <path d="M 150 180 Q 95 150 75 120" stroke={colors.trunk} strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M 170 170 Q 225 145 245 115" stroke={colors.trunk} strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M 160 150 Q 160 110 160 85" stroke={colors.trunk} strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Elder multi-tier canopy */}
            <circle cx="70" cy="115" r="45" fill={colors.foliagePrimary} />
            <circle cx="250" cy="110" r="45" fill={colors.foliagePrimary} />
            <circle cx="110" cy="85" r="54" fill={colors.foliageSecondary} />
            <circle cx="210" cy="80" r="54" fill={colors.foliageSecondary} />
            <circle cx="160" cy="55" r="62" fill={colors.foliageHighlight} />
            <circle cx="160" cy="40" r="46" fill={colors.foliageLight || colors.foliageHighlight} />
            <circle cx="120" cy="60" r="32" fill={colors.foliageLight || colors.foliageHighlight} opacity="0.9" />
            <circle cx="200" cy="55" r="32" fill={colors.foliageLight || colors.foliageHighlight} opacity="0.9" />
          </g>
        );
    }
  };

  // Render Planter Pot (Terracotta, Ceramic, Zen Stone)
  const renderPot = () => {
    if (customization.pot === 'none') return null;

    if (customization.pot === 'ceramic') {
      return (
        <g>
          {/* Ceramic Glazed Pot */}
          <path
            d="M 115 272 L 126 312 Q 160 318 194 312 L 205 272 Z"
            fill="#1D8DEA"
            stroke="#1577c9"
            strokeWidth="2"
          />
          <ellipse cx="160" cy="272" rx="46" ry="8" fill="#D9E8FF" stroke="#1D8DEA" strokeWidth="1.5" />
          {/* Subtle glaze reflection */}
          <path d="M 132 280 L 138 305" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </g>
      );
    }

    if (customization.pot === 'zen_stone') {
      return (
        <g>
          {/* Zen Stone Basin */}
          <ellipse cx="160" cy="308" rx="64" ry="16" fill="#4B5563" />
          <ellipse cx="160" cy="304" rx="60" ry="14" fill="#6B7280" />
          <ellipse cx="160" cy="300" rx="54" ry="11" fill="#374151" />
          <ellipse cx="160" cy="275" rx="52" ry="10" fill="#9CA3AF" />
          <path d="M 108 275 L 115 304 Q 160 312 205 304 L 212 275 Z" fill="#6B7280" />
        </g>
      );
    }

    // Default: Terracotta Planter
    return (
      <g>
        <path
          d="M 120 274 L 130 312 Q 160 317 190 312 L 200 274 Z"
          fill="#C25E34"
          stroke="#9C441E"
          strokeWidth="1.5"
        />
        <ellipse cx="160" cy="274" rx="42" ry="7" fill="#E07A4F" stroke="#9C441E" strokeWidth="1" />
        {/* Pot rim */}
        <rect x="116" y="270" width="88" height="6" rx="2" fill="#E07A4F" stroke="#9C441E" strokeWidth="1" />
      </g>
    );
  };

  // Render Milestone Flora (Sakura blossoms, Golden highlights)
  const renderFlora = () => {
    if (stage === 'seed' || stage === 'sprout') return null;

    if (customization.flora === 'sakura_blossom') {
      return (
        <g>
          {/* Soft pink sakura blossoms */}
          <circle cx="120" cy="140" r="4.5" fill="#F472B6" />
          <circle cx="120" cy="140" r="2" fill="#FDF2F8" />
          <circle cx="195" cy="135" r="4.5" fill="#F472B6" />
          <circle cx="195" cy="135" r="2" fill="#FDF2F8" />
          <circle cx="150" cy="110" r="5" fill="#EC4899" />
          <circle cx="150" cy="110" r="2" fill="#FCE7F3" />
          <circle cx="175" cy="95" r="4" fill="#F472B6" />
          <circle cx="135" cy="165" r="3.5" fill="#FBCFE8" />
          <circle cx="180" cy="160" r="3.5" fill="#FBCFE8" />
        </g>
      );
    }

    if (customization.flora === 'golden_leaves') {
      return (
        <g>
          {/* Golden leaves sparkles */}
          <circle cx="130" cy="120" r="5" fill="#F59E0B" />
          <circle cx="185" cy="110" r="5" fill="#FBBF24" />
          <circle cx="160" cy="80" r="6" fill="#F59E0B" />
          <circle cx="145" cy="150" r="4" fill="#FCD34D" />
          <circle cx="175" cy="145" r="4" fill="#FBBF24" />
        </g>
      );
    }

    return null;
  };

  // Render Ambient Aura (Sunbeam glow, celestial starlight)
  const renderAura = () => {
    if (customization.aura === 'sunbeam' || isStudying) {
      return (
        <g opacity={isStudying ? "0.85" : "0.5"}>
          <defs>
            <radialGradient id="sunbeamGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="150" r="140" fill="url(#sunbeamGlow)" />
        </g>
      );
    }

    if (customization.aura === 'celestial_glow') {
      return (
        <g opacity="0.7">
          <defs>
            <radialGradient id="celestialGlow" cx="50%" cy="35%" r="50%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="160" cy="150" r="140" fill="url(#celestialGlow)" />
        </g>
      );
    }

    return null;
  };

  // Active Studying Floating Particles
  const renderParticles = () => {
    if (!isStudying) return null;

    return (
      <g>
        <circle cx="140" cy="180" r="2.5" fill="#FDE047" opacity="0.8" style={{ animation: 'particleFloat 3.2s ease-in-out infinite' }} />
        <circle cx="180" cy="160" r="3" fill="#86EFAC" opacity="0.8" style={{ animation: 'particleFloat 4s ease-in-out infinite 0.8s' }} />
        <circle cx="155" cy="130" r="2" fill="#FDE047" opacity="0.9" style={{ animation: 'particleFloat 2.8s ease-in-out infinite 1.5s' }} />
        <circle cx="125" cy="140" r="2.5" fill="#93C5FD" opacity="0.8" style={{ animation: 'particleFloat 3.6s ease-in-out infinite 2.2s' }} />
        <circle cx="190" cy="190" r="2" fill="#86EFAC" opacity="0.7" style={{ animation: 'particleFloat 3s ease-in-out infinite 0.4s' }} />
      </g>
    );
  };

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
      {/* Active Studying Ambient Ring */}
      {isStudying && (
        <div
          style={{
            position: 'absolute',
            inset: '0px',
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 50%, rgba(29, 141, 234, 0.08) 0%, transparent 70%)',
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
          }}
        >
          <span>🌱 Your tree is happy to see you again.</span>
        </div>
      )}

      {/* Tree Visual Container (modular: vector SVG now, sprite sheet compatible later) */}
      <div
        className={isStudying ? 'animate-sway' : ''}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 320 340"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          {renderAura()}
          {renderStageSvg()}
          {renderFlora()}
          {renderPot()}
          {renderParticles()}
        </svg>
      </div>

      {/* Details Footer */}
      {showDetails && (
        <div
          style={{
            width: '100%',
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="headline-sm" style={{ color: 'var(--color-secondary)' }}>
              {stageInfo.name}
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
              {isStudying ? '🟢 Studying now' : isMissedDays ? 'Paused' : 'Thriving'}
            </span>
          </div>

          <p className="body-sm" style={{ color: 'var(--color-muted)', maxWidth: '280px' }}>
            {stageInfo.description}
          </p>

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

import React, { useState } from 'react';
import type { SpriteStageLevel } from '../../types';
import { SPRITE_STAGES_CONFIG } from '../../services/storage';
import { TreeDisplay } from './TreeDisplay';
import { Button } from '../UI/Button';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Clock,
  TreePine,
  Play
} from 'lucide-react';

export interface TreeEvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
  initialLevel?: SpriteStageLevel;
}

export const TreeEvolutionModal: React.FC<TreeEvolutionModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
  initialLevel = 14,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<SpriteStageLevel>(initialLevel);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('all');

  if (!isOpen) return null;

  const currentStageInfo = SPRITE_STAGES_CONFIG[selectedLevel];
  const allLevels = Array.from({ length: 22 }, (_, i) => (i + 1) as SpriteStageLevel);

  const stageGroups = [
    { id: 'all', label: 'All 22 Stages' },
    { id: 'Seed', label: 'Seed (1-2)' },
    { id: 'Sprout', label: 'Sprout (3-4)' },
    { id: 'Plant', label: 'Plant (5-8)' },
    { id: 'Sapling', label: 'Sapling (9-11)' },
    { id: 'Tree', label: 'Tree (12-17)' },
    { id: 'Flowering', label: 'Flowering (18-20)' },
    { id: 'Ancient', label: 'Ancient (21-22)' },
  ];

  const filteredLevels = allLevels.filter((lvl) => {
    if (activeGroupFilter === 'all') return true;
    const info = SPRITE_STAGES_CONFIG[lvl];
    if (activeGroupFilter === 'Ancient') {
      return info.stageGroup === 'Ancient' || info.stageGroup === 'Fruiting';
    }
    return info.stageGroup === activeGroupFilter;
  });

  const handlePrev = () => {
    if (selectedLevel > 1) {
      setSelectedLevel((selectedLevel - 1) as SpriteStageLevel);
    }
  };

  const handleNext = () => {
    if (selectedLevel < 22) {
      setSelectedLevel((selectedLevel + 1) as SpriteStageLevel);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(9, 23, 44, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-neutral)',
          borderRadius: 'var(--rounded-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--rounded-md)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TreePine size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)' }}>
                22-Stage Botanical Evolution Tree
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                Explore every stage of habit growth from single seed to ancient glowing celestial canopy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--rounded-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close Explorer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stage Group Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 24px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-neutral)',
            overflowX: 'auto',
          }}
        >
          {stageGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroupFilter(g.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--rounded-full)',
                border: `1px solid ${activeGroupFilter === g.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: activeGroupFilter === g.id ? 'var(--color-primary-light)' : 'transparent',
                color: activeGroupFilter === g.id ? 'var(--color-primary)' : 'var(--color-muted)',
                fontSize: '12px',
                fontWeight: activeGroupFilter === g.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Modal Main Content: Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '24px',
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {/* Left: Active Stage Live Render Showcase */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Tree Live Canvas Box */}
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid var(--color-border)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
              }}
            >
              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                disabled={selectedLevel <= 1}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  color: selectedLevel <= 1 ? '#D1D5DB' : 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: selectedLevel <= 1 ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                  zIndex: 10,
                }}
                title="Previous Stage"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNext}
                disabled={selectedLevel >= 22}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  color: selectedLevel >= 22 ? '#D1D5DB' : 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: selectedLevel >= 22 ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                  zIndex: 10,
                }}
                title="Next Stage"
              >
                <ChevronRight size={20} />
              </button>

              {/* Render the full Sprite Tree */}
              <TreeDisplay
                level={selectedLevel}
                size="lg"
                showDetails={false}
                state="active_studying"
              />
            </div>

            {/* Level Slider Control */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted)' }}>
                  DRAG TO JUMP STAGES
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  Stage {selectedLevel} / 22
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="22"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value) as SpriteStageLevel)}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          {/* Right: Stage Stats, Description & All-Stage Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Stage Title Card */}
            <div
              style={{
                padding: '16px 18px',
                borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      padding: '3px 8px',
                      borderRadius: 'var(--rounded-full)',
                    }}
                  >
                    {currentStageInfo.stageGroup} Phase
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted)' }}>
                    Level {selectedLevel}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '12px', fontWeight: 700 }}>
                  <Sparkles size={14} />
                  <span>Interactive Preview</span>
                </div>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '6px' }}>
                {currentStageInfo.name}
              </h3>

              <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-muted)' }}>
                {currentStageInfo.description}
              </p>

              {/* Requirement Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--rounded-sm)',
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flame size={15} fill="currentColor" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 700 }}>MIN STREAK</div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{currentStageInfo.minStreak} Days</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--rounded-sm)',
                      backgroundColor: '#EFF6FF',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Clock size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 700 }}>TOTAL FOCUS</div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{currentStageInfo.minTotalHours}+ Hours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 22-Stage Grid Thumbnail Browser */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '8px' }}>
                CLICK ANY LEVEL TO INSPECT:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
                  gap: '6px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '4px',
                }}
              >
                {filteredLevels.map((lvl) => {
                  const info = SPRITE_STAGES_CONFIG[lvl];
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      style={{
                        padding: '6px 4px',
                        borderRadius: 'var(--rounded-md)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <img
                        src={info.spriteUrl}
                        alt={info.name}
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        onError={(e) => {
                          // Fallback emoji if image loading fails
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                        Lvl {lvl}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA inside Modal */}
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <Button
                variant="primary"
                size="md"
                icon={<Play size={16} fill="currentColor" />}
                onClick={() => {
                  onClose();
                  onGetStarted();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Grow Your Own Tree (Start Free)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

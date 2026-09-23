import React from 'react';
import { Modal } from '../UI/Modal';
import type { Milestone, TreeCustomization, TreePot, TreeFlora, TreeAura } from '../../types';
import { Check, Lock, Sparkles } from 'lucide-react';

export interface MilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
  currentStreak: number;
  customization: TreeCustomization;
  onEquipItem: (type: 'pot' | 'flora' | 'aura', itemId: string) => void;
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  currentStreak,
  customization,
  onEquipItem,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Streak Milestones & Perks" maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
          Consistency unlocks natural visual perks for your tree. No pay-to-win, strictly discipline and study progress.
        </p>

        {/* Milestones List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {milestones.map((m) => {
            const isUnlocked = m.unlocked || currentStreak >= m.requiredDays;
            const progressDays = Math.min(m.requiredDays, currentStreak);
            const progressPercent = Math.round((progressDays / m.requiredDays) * 100);

            // Check if currently equipped
            const isEquipped =
              (m.rewardType === 'tree_pot' && customization.pot === m.rewardId) ||
              (m.rewardType === 'flora' && customization.flora === m.rewardId) ||
              (m.rewardType === 'aura' && customization.aura === m.rewardId);

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: 'var(--rounded-lg)',
                  backgroundColor: isUnlocked ? 'var(--color-neutral)' : 'var(--color-surface)',
                  border: `1px solid ${isUnlocked ? 'var(--color-border)' : '#E5E7EB'}`,
                  boxShadow: isUnlocked ? 'var(--shadow-subtle)' : 'none',
                  opacity: isUnlocked ? 1 : 0.75,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--rounded-md)',
                      backgroundColor: isUnlocked ? 'var(--color-primary-light)' : '#E5E7EB',
                      color: isUnlocked ? 'var(--color-primary)' : '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isUnlocked ? <Sparkles size={22} /> : <Lock size={20} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="label-lg" style={{ color: 'var(--color-secondary)' }}>
                        {m.title}
                      </span>
                      <span
                        className="xem-chip"
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: isUnlocked ? '#E8F8F0' : '#F3F4F6',
                          color: isUnlocked ? 'var(--color-success)' : 'var(--color-muted)',
                        }}
                      >
                        {m.requiredDays} Days
                      </span>
                    </div>

                    <p className="body-sm" style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '2px' }}>
                      {m.description}
                    </p>

                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="label-sm" style={{ color: 'var(--color-primary)', fontSize: '12px' }}>
                        Reward: {m.rewardName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unlock / Equip Action */}
                <div>
                  {isUnlocked ? (
                    isEquipped ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--color-success)',
                          fontSize: '13px',
                          fontWeight: 600,
                          padding: '8px 12px',
                        }}
                      >
                        <Check size={16} />
                        Equipped
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (m.rewardType === 'tree_pot') onEquipItem('pot', m.rewardId as TreePot);
                          if (m.rewardType === 'flora') onEquipItem('flora', m.rewardId as TreeFlora);
                          if (m.rewardType === 'aura') onEquipItem('aura', m.rewardId as TreeAura);
                        }}
                        className="xem-button-secondary"
                        style={{ height: '36px', padding: '6px 14px', fontSize: '13px' }}
                      >
                        Equip
                      </button>
                    )
                  ) : (
                    <div style={{ textAlign: 'right' }}>
                      <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                        {progressDays} / {m.requiredDays} days
                      </span>
                      <div
                        style={{
                          width: '80px',
                          height: '6px',
                          backgroundColor: '#E5E7EB',
                          borderRadius: '9999px',
                          marginTop: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            backgroundColor: 'var(--color-primary)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

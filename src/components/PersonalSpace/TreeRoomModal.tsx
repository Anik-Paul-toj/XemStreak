import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { TreeDisplay } from '../Tree/TreeDisplay';
import type { SpriteStageLevel, TreeCustomization, AmbianceSoundType } from '../../types';
import { Volume2, VolumeX, Sparkles, BookOpen, Lamp, Compass } from 'lucide-react';

export interface TreeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: SpriteStageLevel;
  customization: TreeCustomization;
}

// Synthetic pink noise generator defined outside component for purity
function createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }
  return buffer;
}

export const TreeRoomModal: React.FC<TreeRoomModalProps> = ({
  isOpen,
  onClose,
  level,
  customization,
}) => {
  const [activeAmbiance, setActiveAmbiance] = useState<AmbianceSoundType>('none');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Synthetic calm sound generator using Web Audio API
  const toggleSound = (sound: AmbianceSoundType) => {
    if (activeAmbiance === sound) {
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
      setActiveAmbiance('none');
      return;
    }

    if (audioContext) {
      audioContext.close();
    }

    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const buffer = createPinkNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = sound === 'forest' ? 'bandpass' : 'lowpass';
      filter.frequency.value = sound === 'forest' ? 800 : 400;

      noiseSource.connect(filter);
      filter.connect(ctx.destination);
      noiseSource.start();

      setAudioContext(ctx);
      setActiveAmbiance(sound);
    } catch {
      setActiveAmbiance(sound);
    }
  };

  const ambientTracks: { id: AmbianceSoundType; name: string; icon: string }[] = [
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
    { id: 'forest', name: 'Forest Breeze', icon: '🍃' },
    { id: 'lofi', name: 'Deep Focus Hum', icon: '🎧' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personal Garden & Study Space" maxWidth="680px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Garden Ambiance Stage */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F8FAFD',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--color-border)',
            padding: '30px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '380px',
            overflow: 'hidden',
          }}
        >
          {/* Garden Desk & Study Metaphor Elements (Section 29) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-muted)',
              fontSize: '12px',
            }}
          >
            <Compass size={15} />
            <span>Digital Study Sanctuary • Level {level}</span>
          </div>

          {/* Tree Display */}
          <div style={{ zIndex: 2, marginTop: '20px' }}>
            <TreeDisplay
              level={level}
              size="lg"
              customization={customization}
              showDetails={false}
              className="garden-tree-frame"
            />
          </div>

          {/* Study Desk Foreground Elements */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '42px',
              backgroundColor: '#EAD9C9',
              borderRadius: '8px',
              border: '2px solid #D4BBA5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              marginTop: '-18px',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B4A2F', fontWeight: 600 }}>
              <Lamp size={14} />
              <span>Desk Lamp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B4A2F', fontWeight: 600 }}>
              <BookOpen size={14} />
              <span>Study Notes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B4A2F', fontWeight: 600 }}>
              <Sparkles size={14} />
              <span>Zen Stone</span>
            </div>
          </div>
        </div>

        {/* Ambient Soundscape Player (Section 29) */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--rounded-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeAmbiance !== 'none' ? <Volume2 size={18} color="var(--color-primary)" /> : <VolumeX size={18} color="var(--color-muted)" />}
            <div>
              <div className="label-sm" style={{ color: 'var(--color-secondary)' }}>
                Garden Soundscape: {activeAmbiance === 'none' ? 'Muted' : activeAmbiance.toUpperCase()}
              </div>
              <div className="body-sm" style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                Organic soundscapes to keep your mind calm during focus sessions.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {ambientTracks.map((t) => {
              const isPlaying = activeAmbiance === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => toggleSound(t.id)}
                  style={{
                    backgroundColor: isPlaying ? 'var(--color-primary-light)' : 'var(--color-neutral)',
                    color: isPlaying ? 'var(--color-primary)' : 'var(--color-secondary)',
                    border: `1px solid ${isPlaying ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--rounded-md)',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

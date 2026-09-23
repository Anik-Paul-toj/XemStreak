import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { StudyRoom } from '../../types';
import { Lock, Globe, KeyRound } from 'lucide-react';

export interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (room: StudyRoom) => void;
  creatorName: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  creatorName,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [tagsInput, setTagsInput] = useState('Deep Work, Consistency');

  const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const finalPasscode = isPrivate ? (passcode.trim() || generateRandomCode()) : undefined;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newRoom: StudyRoom = {
      id: 'room-' + Date.now(),
      name: name.trim(),
      description: description.trim() || 'A focused study community space.',
      isPrivate,
      passcode: finalPasscode,
      tags: tags.length > 0 ? tags : ['Study'],
      totalStudyHours: 0,
      creatorName,
      members: [
        {
          id: 'user-' + Date.now(),
          name: creatorName,
          avatarBg: '#1D8DEA',
          isStudying: false,
          todaySeconds: 0,
          streakDays: 1,
          isCurrentUser: true,
        },
      ],
    };

    onCreateRoom(newRoom);
    onClose();
    setName('');
    setDescription('');
    setIsPrivate(false);
    setPasscode('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Study Room" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
            ROOM NAME *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Distributed Systems Lab"
            className="xem-input"
            required
          />
        </div>

        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
            DESCRIPTION
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this study space focused on?"
            className="xem-input"
          />
        </div>

        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
            TAGS (COMMA SEPARATED)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Algorithms, Math, Quiet"
            className="xem-input"
          />
        </div>

        {/* Privacy Selector */}
        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '8px', display: 'block' }}>
            ROOM PRIVACY
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              style={{
                border: `1.5px solid ${!isPrivate ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: !isPrivate ? 'var(--color-primary-light)' : 'var(--color-neutral)',
                color: !isPrivate ? 'var(--color-primary)' : 'var(--color-secondary)',
                borderRadius: 'var(--rounded-md)',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Globe size={18} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Public Room</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Anyone can discover & join</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPrivate(true);
                if (!passcode) setPasscode(generateRandomCode());
              }}
              style={{
                border: `1.5px solid ${isPrivate ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: isPrivate ? 'var(--color-primary-light)' : 'var(--color-neutral)',
                color: isPrivate ? 'var(--color-primary)' : 'var(--color-secondary)',
                borderRadius: 'var(--rounded-md)',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Lock size={18} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Private Room</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Passcode required to enter</div>
              </div>
            </button>
          </div>
        </div>

        {/* Passcode input for private room */}
        {isPrivate && (
          <div>
            <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
              6-DIGIT PASSCODE / PIN
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. 583921"
                className="xem-input"
                style={{ letterSpacing: '2px', fontWeight: 600 }}
              />
              <button
                type="button"
                onClick={() => setPasscode(generateRandomCode())}
                className="xem-button-secondary"
                style={{ height: '46px', whiteSpace: 'nowrap' }}
              >
                <KeyRound size={16} />
                <span>Generate</span>
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={!name.trim()} style={{ flex: 2 }}>
            Create Room
          </Button>
        </div>
      </div>
    </Modal>
  );
};

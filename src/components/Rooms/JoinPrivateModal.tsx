import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { StudyRoom } from '../../types';
import { KeyRound, AlertCircle } from 'lucide-react';

export interface JoinPrivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoom: StudyRoom | null;
  onSuccess: (room: StudyRoom) => void;
}

export const JoinPrivateModal: React.FC<JoinPrivateModalProps> = ({
  isOpen,
  onClose,
  targetRoom,
  onSuccess,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);

  if (!targetRoom) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim() === targetRoom.passcode?.trim()) {
      setError(false);
      onSuccess(targetRoom);
      onClose();
      setInputCode('');
    } else {
      setError(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Private Room Passcode" maxWidth="420px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="body-sm" style={{ color: 'var(--color-muted)' }}>
          <strong>{targetRoom.name}</strong> is a private space. Please enter the invitation passcode provided by the room creator.
        </p>

        <div>
          <label className="label-sm" style={{ color: 'var(--color-muted)', marginBottom: '6px', display: 'block' }}>
            ENTER PASSCODE
          </label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              if (error) setError(false);
            }}
            placeholder="6-digit code"
            className="xem-input"
            autoFocus
            style={{
              letterSpacing: '3px',
              fontSize: '18px',
              textAlign: 'center',
              fontWeight: 700,
            }}
          />
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-error)',
              fontSize: '13px',
            }}
          >
            <AlertCircle size={16} />
            <span>Invalid passcode. Please verify and try again.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button variant="secondary" type="button" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={<KeyRound size={16} />} style={{ flex: 2 }}>
            Unlock Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};

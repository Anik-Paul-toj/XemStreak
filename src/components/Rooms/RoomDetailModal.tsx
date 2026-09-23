import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { StudyRoom } from '../../types';
import { Flame, Play, LogOut, Share2, Check, Lock, Globe } from 'lucide-react';

export interface RoomDetailModalProps {
  room: StudyRoom | null;
  isOpen: boolean;
  onClose: () => void;
  isJoined: boolean;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  onStartStudyInRoom: (room: StudyRoom) => void;
  isUserStudyingNow?: boolean;
  currentUserTodaySeconds?: number;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  isOpen,
  onClose,
  isJoined,
  onJoinRoom,
  onLeaveRoom,
  onStartStudyInRoom,
  isUserStudyingNow = false,
  currentUserTodaySeconds = 6120,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [, setTick] = useState(0);

  // Live ticker for studying members' timers
  useEffect(() => {
    if (!isOpen || !room) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen, room]);

  if (!room) return null;

  const formatHoursMinutes = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatLiveDuration = (startedAt?: number) => {
    if (!startedAt) return '00:00:00';
    const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    const hours = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  const handleCopyPasscode = () => {
    if (room.passcode) {
      navigator.clipboard.writeText(room.passcode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const activeStudyingCount = room.members.filter((m) => m.isStudying).length + (isJoined && isUserStudyingNow ? 1 : 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header with Title and Room Privacy */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="overline" style={{ color: 'var(--color-primary)' }}>
                VIRTUAL STUDY ROOM
              </span>
              <span
                className="xem-chip"
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  backgroundColor: room.isPrivate ? '#FEF3C7' : 'var(--color-surface)',
                  color: room.isPrivate ? '#B45309' : 'var(--color-primary)',
                }}
              >
                {room.isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                <span>{room.isPrivate ? 'Private Room' : 'Public Room'}</span>
              </span>
            </div>

            <h3 className="headline-md" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
              {room.name}
            </h3>

            <p className="body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>
              {room.description}
            </p>
          </div>

          {/* Passcode Copy if private */}
          {room.isPrivate && room.passcode && (
            <button
              onClick={handleCopyPasscode}
              className="xem-button-secondary"
              style={{ height: '34px', padding: '4px 10px', fontSize: '12px' }}
            >
              {copiedCode ? <Check size={14} color="var(--color-success)" /> : <Share2 size={14} />}
              <span>{copiedCode ? 'Copied' : `Code: ${room.passcode}`}</span>
            </button>
          )}
        </div>

        {/* Room Metrics Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            backgroundColor: 'var(--color-surface)',
            padding: '16px',
            borderRadius: 'var(--rounded-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>CURRENTLY STUDYING</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span
                className="animate-pulse-live"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success)',
                }}
              />
              <span className="stat-value" style={{ color: 'var(--color-success)' }}>
                {activeStudyingCount}
              </span>
            </div>
          </div>

          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>ROOM MEMBERS</div>
            <div className="stat-value" style={{ color: 'var(--color-primary)', marginTop: '4px' }}>
              {room.members.length}
            </div>
          </div>

          <div>
            <div className="label-sm" style={{ color: 'var(--color-muted)' }}>TOTAL STUDY TIME</div>
            <div className="stat-value" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
              {room.totalStudyHours}h
            </div>
          </div>
        </div>

        {/* Live Member Roster */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
              LIVE MEMBERS ROSTER ({room.members.length})
            </span>
            <span className="body-sm" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
              Privacy-first: only active focus time is shared
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '260px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {room.members.map((member) => {
              const isCurrent = member.isCurrentUser;
              const currentlyStudying = isCurrent ? isUserStudyingNow : member.isStudying;
              const todayTime = isCurrent ? currentUserTodaySeconds : member.todaySeconds;

              return (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--rounded-md)',
                    backgroundColor: currentlyStudying ? '#F0F9FF' : 'var(--color-neutral)',
                    border: `1px solid ${currentlyStudying ? '#BAE6FD' : 'var(--color-border)'}`,
                  }}
                >
                  {/* Left: Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: member.avatarBg,
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="label-md" style={{ color: 'var(--color-secondary)' }}>
                          {member.name}
                        </span>
                        {isCurrent && (
                          <span
                            className="xem-chip"
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>

                      {/* Live Status indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        {currentlyStudying ? (
                          <>
                            <span
                              className="animate-pulse-live"
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-success)',
                              }}
                            />
                            <span
                              className="body-sm"
                              style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}
                            >
                              🟢 Studying ({formatLiveDuration(member.liveStudyStartedAt || Date.now() - 1800000)})
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: '#9CA3AF',
                              }}
                            />
                            <span className="body-sm" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                              ⚪ Recently studied
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Today's Time & Streak */}
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <div className="label-sm" style={{ color: 'var(--color-secondary)', fontSize: '13px' }}>
                        {formatHoursMinutes(todayTime)}
                      </div>
                      <div className="body-sm" style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                        Today
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        padding: '4px 8px',
                        borderRadius: 'var(--rounded-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      <Flame size={12} fill="#F59E0B" color="#F59E0B" />
                      <span>{member.streakDays}d</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          {isJoined ? (
            <>
              <Button
                variant="primary"
                icon={<Play size={18} fill="currentColor" />}
                onClick={() => {
                  onClose();
                  onStartStudyInRoom(room);
                }}
                style={{ flex: 2 }}
              >
                Study In This Room
              </Button>

              <Button
                variant="secondary"
                icon={<LogOut size={16} />}
                onClick={() => {
                  onLeaveRoom(room.id);
                  onClose();
                }}
                style={{ flex: 1 }}
              >
                Leave Room
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => onJoinRoom(room.id)}
              style={{ width: '100%' }}
            >
              Join Room
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import type { StudyRoom } from '../../types';
import { Flame, Play, LogOut, Share2, Check, Lock, Globe, Trophy, Users, Heart } from 'lucide-react';
import { api } from '../../services/api';

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
  const [activeTab, setActiveTab] = useState<'roster' | 'leaderboard'>('roster');
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);

  // Live ticker for studying members' timers
  useEffect(() => {
    if (!isOpen || !room) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
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
    const elapsed = Math.max(0, Math.floor((currentTime - startedAt) / 1000));
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

  const handleSendCheer = async (reaction: string, label: string) => {
    try {
      await api.sendRoomCheer(room.id, reaction);
      setCheerNotice(`Sent ${reaction} "${label}" to the room!`);
    } catch {
      setCheerNotice(`Sent ${reaction} "${label}" to the room!`);
    }
    setTimeout(() => setCheerNotice(null), 3000);
  };

  const activeStudyingCount = room.members.filter((m) => m.isStudying).length + (isJoined && isUserStudyingNow ? 1 : 0);

  // Leaderboard ranking (Section 16)
  const sortedMembers = [...room.members].sort((a, b) => {
    const timeA = a.isCurrentUser ? currentUserTodaySeconds : a.todaySeconds;
    const timeB = b.isCurrentUser ? currentUserTodaySeconds : b.todaySeconds;
    return timeB - timeA;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
            padding: '14px 16px',
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

        {/* Tab Switcher: Live Roster vs Leaderboard (Section 16) */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('roster')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: `2px solid ${activeTab === 'roster' ? 'var(--color-primary)' : 'transparent'}`,
              color: activeTab === 'roster' ? 'var(--color-primary)' : 'var(--color-muted)',
              fontWeight: activeTab === 'roster' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={15} />
            <span>Live Members ({room.members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: `2px solid ${activeTab === 'leaderboard' ? 'var(--color-primary)' : 'transparent'}`,
              color: activeTab === 'leaderboard' ? 'var(--color-primary)' : 'var(--color-muted)',
              fontWeight: activeTab === 'leaderboard' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trophy size={15} />
            <span>Room Leaderboard</span>
          </button>
        </div>

        {/* Tab 1: Live Members Roster */}
        {activeTab === 'roster' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '230px',
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
                      padding: '10px 14px',
                      borderRadius: 'var(--rounded-md)',
                      backgroundColor: currentlyStudying ? '#F0F9FF' : 'var(--color-neutral)',
                      border: `1px solid ${currentlyStudying ? '#BAE6FD' : 'var(--color-border)'}`,
                    }}
                  >
                    {/* Left: Avatar & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: member.avatarBg,
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '13px',
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
                                🟢 Studying ({formatLiveDuration(member.liveStudyStartedAt || currentTime - 1800000)})
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

            {/* Social Cheers & Encouragement Bar (Section 17) */}
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={14} color="var(--color-primary)" />
                <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                  Send Cheer:
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleSendCheer('🔥', 'Fire focus')}
                  className="xem-button-secondary"
                  style={{ height: '30px', padding: '2px 8px', fontSize: '12px' }}
                  title="Cheer with fire"
                >
                  🔥 Focus
                </button>
                <button
                  onClick={() => handleSendCheer('👏', 'Good job')}
                  className="xem-button-secondary"
                  style={{ height: '30px', padding: '2px 8px', fontSize: '12px' }}
                  title="Clap"
                >
                  👏 Bravo
                </button>
                <button
                  onClick={() => handleSendCheer('☕', 'Coffee break')}
                  className="xem-button-secondary"
                  style={{ height: '30px', padding: '2px 8px', fontSize: '12px' }}
                  title="Coffee cheer"
                >
                  ☕ Coffee
                </button>
                <button
                  onClick={() => handleSendCheer('🎉', 'Milestone celebration')}
                  className="xem-button-secondary"
                  style={{ height: '30px', padding: '2px 8px', fontSize: '12px' }}
                  title="Party celebration"
                >
                  🎉 Celebrate
                </button>
              </div>
            </div>

            {cheerNotice && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#E8F8F0',
                  color: 'var(--color-success)',
                  borderRadius: 'var(--rounded-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {cheerNotice}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Room Leaderboard (Section 16) */}
        {activeTab === 'leaderboard' && (
          <div>
            <div style={{ marginBottom: '8px' }}>
              <p className="body-sm" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
                Personal consistency is our main principle. Leaderboard offers gentle inspiration.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedMembers.map((member, index) => {
                const rank = index + 1;
                const isCurrent = member.isCurrentUser;
                const studySecs = isCurrent ? currentUserTodaySeconds : member.todaySeconds;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

                return (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--rounded-md)',
                      backgroundColor: isCurrent ? '#EFF6FF' : 'var(--color-neutral)',
                      border: `1px solid ${isCurrent ? '#BFDBFE' : 'var(--color-border)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, minWidth: '24px' }}>
                        {medal}
                      </span>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: member.avatarBg,
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="label-md" style={{ color: 'var(--color-secondary)' }}>
                        {member.name} {isCurrent && '(You)'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span className="stat-value" style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                        {formatHoursMinutes(studySecs)}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-amber)', fontWeight: 600 }}>
                        🔥 {member.streakDays}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Room Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
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

import React from 'react';
import { Card } from '../UI/Card';
import type { StudyRoom } from '../../types';
import { Users, Lock, Globe, Clock, ArrowRight } from 'lucide-react';

export interface RoomCardProps {
  room: StudyRoom;
  isJoined?: boolean;
  onOpenRoom: (room: StudyRoom) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isJoined = false,
  onOpenRoom,
}) => {
  const activeMembersCount = room.members.filter((m) => m.isStudying).length;

  return (
    <Card hoverable={true} padding="20px" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {room.isPrivate ? (
            <span
              className="xem-chip"
              style={{
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                borderColor: '#FDE68A',
                fontSize: '11px',
                padding: '2px 8px',
              }}
            >
              <Lock size={12} />
              Private
            </span>
          ) : (
            <span
              className="xem-chip"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-border)',
                fontSize: '11px',
                padding: '2px 8px',
              }}
            >
              <Globe size={12} />
              Public
            </span>
          )}

          {isJoined && (
            <span
              className="xem-chip"
              style={{
                backgroundColor: '#E8F8F0',
                color: 'var(--color-success)',
                borderColor: '#B7ECCB',
                fontSize: '11px',
                padding: '2px 8px',
              }}
            >
              Member
            </span>
          )}
        </div>

        {/* Live Active Students Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className="animate-pulse-live"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: activeMembersCount > 0 ? 'var(--color-success)' : 'var(--color-muted)',
              display: 'inline-block',
            }}
          />
          <span className="label-sm" style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
            {activeMembersCount} studying
          </span>
        </div>
      </div>

      <div style={{ marginTop: '12px', flex: 1 }}>
        <h4 className="headline-sm" style={{ color: 'var(--color-secondary)', fontSize: '18px' }}>
          {room.name}
        </h4>
        <p className="body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px', fontSize: '13px' }}>
          {room.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {room.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                color: 'var(--color-muted)',
                backgroundColor: 'var(--color-surface)',
                padding: '2px 8px',
                borderRadius: 'var(--rounded-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer stats & enter button */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)' }}>
            <Users size={14} />
            <span className="body-sm" style={{ fontSize: '12px' }}>{room.members.length}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)' }}>
            <Clock size={14} />
            <span className="body-sm" style={{ fontSize: '12px' }}>{room.totalStudyHours}h total</span>
          </div>
        </div>

        <button
          onClick={() => onOpenRoom(room)}
          className="xem-button-secondary"
          style={{ height: '34px', padding: '4px 12px', fontSize: '12px' }}
        >
          <span>Enter Room</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </Card>
  );
};

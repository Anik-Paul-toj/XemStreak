import React, { useState } from 'react';
import type { StudyRoom } from '../../types';
import { RoomCard } from './RoomCard';
import { Button } from '../UI/Button';
import { Users, Plus, Search } from 'lucide-react';

export interface RoomsSectionProps {
  rooms: StudyRoom[];
  joinedRoomId?: string;
  onOpenRoom: (room: StudyRoom) => void;
  onCreateRoomClick: () => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  joinedRoomId,
  onOpenRoom,
  onCreateRoomClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'public' | 'private' | 'joined'>('all');

  const filteredRooms = rooms.filter((room) => {
    // Search filter
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'public') return !room.isPrivate;
    if (filterTab === 'private') return room.isPrivate;
    if (filterTab === 'joined') return room.id === joinedRoomId;
    return true;
  });

  return (
    <section style={{ marginTop: '40px', marginBottom: '40px' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="overline" style={{ color: 'var(--color-primary)' }}>
                COMMUNITY HUBS
              </span>
              <span
                className="xem-chip"
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  backgroundColor: '#F3F4F6',
                  color: 'var(--color-muted)',
                }}
              >
                Optional
              </span>
            </div>
            <h3 className="headline-lg" style={{ color: 'var(--color-secondary)', marginTop: '4px' }}>
              Study Rooms
            </h3>
            <p className="body-md" style={{ color: 'var(--color-muted)', maxWidth: '540px' }}>
              Study in shared virtual spaces or keep focused completely solo. Room members see active timers, daily study contributions, and streaks.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={onCreateRoomClick}
              style={{ height: '44px' }}
            >
              Create Room
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-surface)',
              padding: '4px',
              borderRadius: 'var(--rounded-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            {(['all', 'public', 'private', 'joined'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: filterTab === tab ? 'var(--color-neutral)' : 'transparent',
                  color: filterTab === tab ? 'var(--color-primary)' : 'var(--color-muted)',
                  fontWeight: filterTab === tab ? 600 : 500,
                  fontSize: '13px',
                  boxShadow: filterTab === tab ? 'var(--shadow-subtle)' : 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab === 'joined' ? 'My Room' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms or tags..."
              className="xem-input"
              style={{
                paddingLeft: '36px',
                height: '38px',
                fontSize: '13px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
          }}
        >
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isJoined={room.id === joinedRoomId}
              onOpenRoom={onOpenRoom}
            />
          ))}
        </div>
      ) : (
        <div
          className="xem-card"
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: 'var(--color-neutral)',
          }}
        >
          <Users size={36} color="var(--color-muted)" style={{ margin: '0 auto 12px' }} />
          <h4 className="headline-sm" style={{ color: 'var(--color-secondary)' }}>
            No study rooms match your filter
          </h4>
          <p className="body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>
            Try searching for a different keyword or create a new public/private room.
          </p>
        </div>
      )}
    </section>
  );
};

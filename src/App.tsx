import { useState, useEffect } from 'react';
import type {
  TreeStage,
  TreeState,
  TreeCustomization,
  SpriteStageLevel,
  StudyRoom,
  CompletedSessionSummary,
  StreakData,
  UserProfile,
  Milestone
} from './types';
import { storageService, calculateTreeStage, calculateSpriteStage } from './services/storage';
import { useStudyTimer } from './hooks/useStudyTimer';
import { api } from './services/api';
import { syncManager } from './services/syncQueue';

// Components
import { Navbar } from './components/Navigation/Navbar';
import { TreeDisplay } from './components/Tree/TreeDisplay';
import { Card } from './components/UI/Card';
import { Button } from './components/UI/Button';
import { StatTile } from './components/UI/StatTile';
import { ProgressBar } from './components/UI/ProgressBar';
import { StreakCard } from './components/Streak/StreakCard';
import { MilestonesModal } from './components/Streak/MilestonesModal';
import { StudySetupModal } from './components/Study/StudySetupModal';
import { ActiveStudySession } from './components/Study/ActiveStudySession';
import { SessionCompleteModal } from './components/Study/SessionCompleteModal';
import { RoomsSection } from './components/Rooms/RoomsSection';
import { RoomDetailModal } from './components/Rooms/RoomDetailModal';
import { CreateRoomModal } from './components/Rooms/CreateRoomModal';
import { JoinPrivateModal } from './components/Rooms/JoinPrivateModal';
import { AICompanionDrawer } from './components/AICompanion/AICompanionDrawer';
import { AnalyticsModal } from './components/Analytics/AnalyticsModal';
import { TreeRoomModal } from './components/PersonalSpace/TreeRoomModal';

// Icons
import { Play, Sparkles, Flame, Clock, Award, Bot, Compass } from 'lucide-react';

export function App() {
  // Persistence state
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [streakData, setStreakData] = useState<StreakData>(() => storageService.getStreakData());
  const [customization, setCustomization] = useState<TreeCustomization>(() => storageService.getCustomization());
  const [milestones, setMilestones] = useState<Milestone[]>(() => storageService.getMilestones());
  const [rooms, setRooms] = useState<StudyRoom[]>(() => storageService.getRooms());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Simulation state for testing Section 7 missed days
  const [simulatedMissedDays, setSimulatedMissedDays] = useState(0);

  // Modals state
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isGardenModalOpen, setIsGardenModalOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null);
  const [privateRoomToUnlock, setPrivateRoomToUnlock] = useState<StudyRoom | null>(null);
  const [completedSummary, setCompletedSummary] = useState<CompletedSessionSummary | null>(null);

  // Check backend health & initialize auto sync
  useEffect(() => {
    const checkConnection = async () => {
      const ok = await api.checkHealth();
      setIsBackendConnected(ok);
      if (ok) {
        // Try fetching updated rooms and sync pending
        try {
          const remoteRooms = await api.getRooms();
          if (remoteRooms && remoteRooms.length > 0) {
            setRooms(remoteRooms);
            storageService.saveRooms(remoteRooms);
          }
        } catch {
          // ignore
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    syncManager.initAutoSync();

    return () => clearInterval(interval);
  }, []);

  // Completed session handler
  const handleSessionFinished = async (summary: CompletedSessionSummary) => {
    // 1. Sync through offline-first sync manager
    await syncManager.recordSession(summary);

    // 2. Update local state
    const additionalSecs = summary.durationSeconds;
    const additionalLeaves = summary.leavesEarned;
    const additionalXp = Math.floor(additionalSecs / 6);

    setStreakData((prev) => {
      const newToday = prev.todayStudySeconds + additionalSecs;
      const newTotalSecs = prev.totalStudySeconds + additionalSecs;
      const newLeaves = prev.leavesGrownToday + additionalLeaves;
      const newTotalLeaves = prev.totalLeaves + additionalLeaves;
      const newXp = (prev.xp || 4200) + additionalXp;
      const totalHours = Math.round(newTotalSecs / 3600);
      const newTreeLevel = calculateSpriteStage(prev.currentStreak, totalHours);
      const metDaily = newToday >= prev.dailyGoalSeconds;

      // Update week history
      const updatedWeek = prev.weekHistory.map((d, i) => {
        if (i === 4) { // Friday / today
          return {
            ...d,
            seconds: d.seconds + additionalSecs,
            metGoal: d.seconds + additionalSecs >= prev.dailyGoalSeconds,
          };
        }
        return d;
      });

      const updatedStreak: StreakData = {
        ...prev,
        todayStudySeconds: newToday,
        totalStudySeconds: newTotalSecs,
        leavesGrownToday: newLeaves,
        totalLeaves: newTotalLeaves,
        xp: newXp,
        treeLevel: newTreeLevel,
        currentStreak: metDaily && prev.currentStreak === 0 ? 1 : prev.currentStreak,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak),
        weekHistory: updatedWeek,
        daysSinceLastStudy: 0,
      };

      storageService.saveStreakData(updatedStreak);
      return updatedStreak;
    });

    // Check if new milestones unlocked
    setMilestones((prev) => {
      const updated = prev.map((m) => {
        if (streakData.currentStreak >= m.requiredDays) {
          return { ...m, unlocked: true };
        }
        return m;
      });
      storageService.saveMilestones(updated);
      return updated;
    });

    setCompletedSummary(summary);
  };

  // Timer engine
  const timer = useStudyTimer(handleSessionFinished);

  // Joined Room
  const joinedRoom = rooms.find((r) => r.id === profile.joinedRoomId) || null;

  // Tree Stage and 22-Level calculation
  const totalHours = Math.round(streakData.totalStudySeconds / 3600);
  const legacyStage: TreeStage = calculateTreeStage(streakData.currentStreak, totalHours);
  const spriteLevel: SpriteStageLevel = streakData.treeLevel || calculateSpriteStage(streakData.currentStreak, totalHours);

  // Tree state
  const treeState: TreeState = timer.isRunning
    ? 'active_studying'
    : simulatedMissedDays > 0
    ? 'missed_days'
    : streakData.currentStreak >= 5
    ? 'consistent'
    : 'idle';

  // Format today's study time
  const todayHours = Math.floor(streakData.todayStudySeconds / 3600);
  const todayMins = Math.floor((streakData.todayStudySeconds % 3600) / 60);
  const goalHours = Math.floor(streakData.dailyGoalSeconds / 3600);
  const goalMins = Math.floor((streakData.dailyGoalSeconds % 3600) / 60);

  const formattedToday = `${todayHours > 0 ? `${todayHours}h ` : ''}${todayMins}m`;
  const formattedGoal = `${goalHours > 0 ? `${goalHours}h ` : ''}${goalMins > 0 ? `${goalMins}m` : ''}`;

  // Ghost Mode Toggle
  const handleToggleGhostMode = () => {
    const updated = { ...profile, ghostMode: !profile.ghostMode };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  // Milestone cosmetic equipping
  const handleEquipItem = (type: 'pot' | 'flora' | 'aura', itemId: string) => {
    const updated = { ...customization, [type]: itemId };
    setCustomization(updated);
    storageService.saveCustomization(updated);
  };

  // Room actions
  const handleOpenRoom = (room: StudyRoom) => {
    if (room.isPrivate && room.id !== profile.joinedRoomId) {
      setPrivateRoomToUnlock(room);
    } else {
      setSelectedRoom(room);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    const updatedProfile = { ...profile, joinedRoomId: roomId };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);

    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (r.id === roomId) {
          const alreadyMember = r.members.some((m) => m.id === profile.id);
          if (!alreadyMember) {
            return {
              ...r,
              members: [
                ...r.members,
                {
                  id: profile.id,
                  name: profile.name,
                  avatarBg: '#1D8DEA',
                  isStudying: timer.isRunning,
                  todaySeconds: streakData.todayStudySeconds,
                  streakDays: streakData.currentStreak,
                  isCurrentUser: true,
                },
              ],
            };
          }
        }
        return r;
      });
      storageService.saveRooms(updated);
      return updated;
    });

    const room = rooms.find((r) => r.id === roomId);
    if (room) setSelectedRoom(room);
  };

  const handleLeaveRoom = (roomId: string) => {
    const updatedProfile = { ...profile, joinedRoomId: undefined };
    setProfile(updatedProfile);
    storageService.saveProfile(updatedProfile);

    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            members: r.members.filter((m) => m.id !== profile.id),
          };
        }
        return r;
      });
      storageService.saveRooms(updated);
      return updated;
    });
  };

  const handleCreateRoom = async (newRoom: StudyRoom) => {
    const updated = [newRoom, ...rooms];
    setRooms(updated);
    storageService.saveRooms(updated);
    handleJoinRoom(newRoom.id);

    if (isBackendConnected) {
      try {
        await api.createRoom({
          name: newRoom.name,
          description: newRoom.description,
          is_private: newRoom.isPrivate,
          passcode: newRoom.passcode,
          tags: newRoom.tags.join(','),
        });
      } catch (err) {
        console.log('Room synced locally first:', err);
      }
    }
  };

  const handleUpdateDailyGoal = (newGoalMins: number) => {
    const updated: StreakData = {
      ...streakData,
      dailyGoalSeconds: newGoalMins * 60,
    };
    setStreakData(updated);
    storageService.saveStreakData(updated);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        profile={profile}
        streakData={streakData}
        onStartStudy={() => setIsStudyModalOpen(true)}
        onOpenMilestones={() => setIsMilestonesModalOpen(true)}
        onToggleGhostMode={handleToggleGhostMode}
        onOpenAICompanion={() => setIsAIDrawerOpen(true)}
        onOpenGardenSpace={() => setIsGardenModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Section 5: Main User Experience Hero */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '32px',
            alignItems: 'center',
            marginBottom: '36px',
          }}
        >
          {/* Left Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="overline" style={{ color: 'var(--color-primary)' }}>
                  DAILY STUDY CYCLE
                </span>
                <span
                  className="xem-chip"
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    borderColor: '#FDE68A',
                  }}
                >
                  🔥 {streakData.currentStreak} day streak
                </span>
                <span
                  className="xem-chip"
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Level {spriteLevel} / 22
                </span>
              </div>

              <h1 className="headline-display" style={{ color: 'var(--color-secondary)', marginTop: '8px' }}>
                Good morning, {profile.name}
              </h1>

              <p className="body-lg" style={{ color: 'var(--color-muted)', marginTop: '6px' }}>
                The more consistently you study, the more your tree grows. Focus on rhythm rather than exhaustion.
              </p>
            </div>

            {/* Daily Goal Progress Card */}
            <Card padding="24px" style={{ backgroundColor: 'var(--color-neutral)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span className="label-md" style={{ color: 'var(--color-muted)' }}>
                  Today's Study Progress
                </span>
                <span className="stat-value" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>
                  {formattedToday} / {formattedGoal}
                </span>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                current={streakData.todayStudySeconds}
                max={streakData.dailyGoalSeconds}
                height={12}
                showLabel={true}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  <span>🍃</span>
                  <span>Your tree grew {streakData.leavesGrownToday} leaves today.</span>
                </div>

                <span className="body-sm" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                  {streakData.todayStudySeconds >= streakData.dailyGoalSeconds
                    ? '✓ Daily streak secured'
                    : `${Math.max(0, Math.round((streakData.dailyGoalSeconds - streakData.todayStudySeconds) / 60))}m left to secure streak`}
                </span>
              </div>
            </Card>

            {/* Main Action CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="primary"
                size="lg"
                icon={<Play size={20} fill="currentColor" />}
                onClick={() => setIsStudyModalOpen(true)}
                style={{ flex: 1.5 }}
              >
                Start Studying
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<Bot size={18} />}
                onClick={() => setIsAIDrawerOpen(true)}
                style={{ flex: 1 }}
              >
                AI Companion
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={<Compass size={18} />}
                onClick={() => setIsGardenModalOpen(true)}
                style={{ flex: 1 }}
              >
                Sanctuary
              </Button>
            </div>
          </div>

          {/* Right Hero Showcase: The 22-Stage Sprite Tree (Section 6, 7 & 30) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TreeDisplay
              stage={legacyStage}
              level={spriteLevel}
              state={treeState}
              customization={customization}
              size="lg"
              showDetails={true}
              leavesToday={streakData.leavesGrownToday}
              daysMissed={simulatedMissedDays}
              xp={streakData.xp || 4200}
            />

            {/* Tree State Simulator Controls (for quick interactive review of Section 7) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-muted)' }}>
                State Simulator (Section 7):
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSimulatedMissedDays(simulatedMissedDays > 0 ? 0 : 3)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: simulatedMissedDays > 0 ? 'var(--color-primary)' : 'var(--color-muted)',
                    fontWeight: simulatedMissedDays > 0 ? 700 : 500,
                  }}
                >
                  {simulatedMissedDays > 0 ? 'Restore Active State' : 'Simulate Missed Days'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10 & 11: KPI Tiles and Week Checklist */}
        <section style={{ marginBottom: '36px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <StatTile
              label="CURRENT STREAK"
              value={`${streakData.currentStreak} Days`}
              icon={<Flame size={20} />}
              color="amber"
              trend="+1 day today"
            />
            <StatTile
              label="ALL-TIME BEST"
              value={`${streakData.longestStreak} Days`}
              icon={<Award size={20} />}
              color="primary"
            />
            <StatTile
              label="TOTAL STUDY TIME"
              value={`${totalHours} Hours`}
              icon={<Clock size={20} />}
              subValue={`${streakData.totalStudyDays} dedicated days`}
              color="primary"
            />
            <StatTile
              label="HARVESTED LEAVES"
              value={`${streakData.totalLeaves} Leaves`}
              icon={<Sparkles size={20} />}
              subValue={`Sprite Level: ${spriteLevel}/22`}
              color="success"
            />
          </div>

          {/* 7-Day Consistency Week Checklist */}
          <StreakCard
            streakData={streakData}
            onOpenMilestones={() => setIsMilestonesModalOpen(true)}
            onUpdateDailyGoal={handleUpdateDailyGoal}
          />
        </section>

        {/* Sections 12, 13, 14, 15, 16 & 17: Study Rooms */}
        <RoomsSection
          rooms={rooms}
          joinedRoomId={profile.joinedRoomId}
          onOpenRoom={handleOpenRoom}
          onCreateRoomClick={() => setIsCreateRoomOpen(true)}
          ghostMode={profile.ghostMode}
          onToggleGhostMode={handleToggleGhostMode}
        />
      </main>

      {/* Active Focus Study Mode (Section 8) */}
      {timer.activeSession && (
        <ActiveStudySession
          session={timer.activeSession}
          elapsedSeconds={timer.elapsedSeconds}
          isRunning={timer.isRunning}
          onPause={timer.pauseSession}
          onResume={timer.resumeSession}
          onFinish={timer.finishSession}
          onCancel={timer.cancelSession}
          treeStage={legacyStage}
          customization={customization}
        />
      )}

      {/* Study Setup Modal (Section 9) */}
      <StudySetupModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        onStart={timer.startSession}
        joinedRoom={joinedRoom}
      />

      {/* Session Completed Celebratory Modal */}
      <SessionCompleteModal
        summary={completedSummary}
        onClose={() => setCompletedSummary(null)}
        currentStreak={streakData.currentStreak}
      />

      {/* Streak Milestones & Perks Modal (Section 11) */}
      <MilestonesModal
        isOpen={isMilestonesModalOpen}
        onClose={() => setIsMilestonesModalOpen(false)}
        milestones={milestones}
        currentStreak={streakData.currentStreak}
        customization={customization}
        onEquipItem={handleEquipItem}
      />

      {/* Room Detail Modal (Sections 13, 14, 15, 16, 17) */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        isJoined={selectedRoom?.id === profile.joinedRoomId}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
        onStartStudyInRoom={(room) => {
          setSelectedRoom(null);
          timer.startSession('focus', `Deep Work @ ${room.name}`, 50, room.id);
        }}
        isUserStudyingNow={timer.isRunning && !profile.ghostMode}
        currentUserTodaySeconds={streakData.todayStudySeconds}
      />

      {/* Create Room Modal (Section 12 & 15) */}
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onCreateRoom={handleCreateRoom}
        creatorName={profile.name}
      />

      {/* Private Room Passcode Modal (Section 15) */}
      <JoinPrivateModal
        isOpen={!!privateRoomToUnlock}
        onClose={() => setPrivateRoomToUnlock(null)}
        targetRoom={privateRoomToUnlock}
        onSuccess={(room) => {
          handleJoinRoom(room.id);
          setSelectedRoom(room);
        }}
      />

      {/* AI Study Companion Drawer (Sections 18, 19, 20) */}
      <AICompanionDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        roomName={joinedRoom ? joinedRoom.name : undefined}
      />

      {/* Analytics Modal (Section 28) */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        streakData={streakData}
      />

      {/* Tree Room / Personal Space Modal (Section 29) */}
      <TreeRoomModal
        isOpen={isGardenModalOpen}
        onClose={() => setIsGardenModalOpen(false)}
        level={spriteLevel}
        customization={customization}
      />
    </div>
  );
}

export default App;

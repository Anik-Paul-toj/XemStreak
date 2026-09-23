export type TreeStage = 
  | 'seed'
  | 'sprout'
  | 'sapling'
  | 'young_tree'
  | 'mature_tree'
  | 'large_tree'
  | 'ancient_tree';

export interface TreeStageInfo {
  stage: TreeStage;
  name: string;
  minStreak: number;
  minTotalHours: number;
  description: string;
  leafMultiplier: number;
}

export type SpriteStageLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22;

export interface SpriteStageInfo {
  level: SpriteStageLevel;
  name: string;
  stageGroup: string;
  description: string;
  minStreak: number;
  minTotalHours: number;
  spriteUrl: string;
}

export type TreeState = 'idle' | 'active_studying' | 'consistent' | 'missed_days';

export type TreePot = 'none' | 'terracotta' | 'ceramic' | 'zen_stone';
export type TreeFlora = 'none' | 'sakura_blossom' | 'golden_leaves' | 'fruit_bearing';
export type TreeAura = 'none' | 'sunbeam' | 'forest_mist' | 'celestial_glow';

export interface TreeCustomization {
  pot: TreePot;
  flora: TreeFlora;
  aura: TreeAura;
}

export type SessionMode = 'focus' | 'free' | 'goal';

export interface StudySession {
  id: string;
  mode: SessionMode;
  title: string;
  targetSeconds: number; // 0 for free study
  accumulatedSeconds: number;
  startedAt: number; // timestamp
  pausedAt: number | null; // timestamp when paused or null if running
  isRunning: boolean;
  roomId?: string; // Optional study room ID
}

export interface CompletedSessionSummary {
  id: string;
  mode: SessionMode;
  title: string;
  durationSeconds: number;
  leavesEarned: number;
  completedAt: string;
  roomId?: string;
}

export interface DayProgress {
  dayName: string; // 'Mon', 'Tue', ...
  dateStr: string; // YYYY-MM-DD
  seconds: number;
  metGoal: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  totalStudySeconds: number;
  todayStudySeconds: number;
  dailyGoalSeconds: number;
  leavesGrownToday: number;
  totalLeaves: number;
  treeLevel: SpriteStageLevel; // Level 1 to 22 matching sprite sheet!
  xp: number;
  weekHistory: DayProgress[];
  lastStudyDate: string; // YYYY-MM-DD
  daysSinceLastStudy: number;
}

export type MilestoneRewardType = 'tree_pot' | 'flora' | 'aura' | 'badge';

export interface Milestone {
  id: string;
  requiredDays: number;
  title: string;
  description: string;
  rewardType: MilestoneRewardType;
  rewardId: string;
  rewardName: string;
  unlocked: boolean;
}

export interface RoomMember {
  id: string;
  name: string;
  avatarBg: string;
  isStudying: boolean;
  liveStudyStartedAt?: number;
  todaySeconds: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface RoomCheer {
  id: number;
  roomId: string;
  fromUserName: string;
  toUserName?: string;
  reaction: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  studySeconds: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  passcode?: string;
  tags: string[];
  totalStudyHours: number;
  members: RoomMember[];
  creatorName: string;
  cheers?: RoomCheer[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  timestamp: string;
}

export type AmbianceSoundType = 'none' | 'rain' | 'forest' | 'lofi' | 'cafe';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  ghostMode: boolean; // Hide study status in rooms
  joinedRoomId?: string;
  ambientSound: AmbianceSoundType;
}

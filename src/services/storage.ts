import type {
  StreakData,
  Milestone,
  StudyRoom,
  UserProfile,
  TreeCustomization,
  TreeStage,
  TreeStageInfo,
  SpriteStageLevel,
  SpriteStageInfo,
  StudySession,
  CompletedSessionSummary
} from '../types';

const STORAGE_KEYS = {
  STREAK: 'xemstreak_streak_data_v1',
  PROFILE: 'xemstreak_user_profile_v1',
  CUSTOMIZATION: 'xemstreak_tree_customization_v1',
  MILESTONES: 'xemstreak_milestones_v1',
  ROOMS: 'xemstreak_rooms_v1',
  ACTIVE_SESSION: 'xemstreak_active_session_v1',
  SESSION_HISTORY: 'xemstreak_session_history_v1',
  OFFLINE_QUEUE: 'xemstreak_offline_queue_v1',
};

export const SPRITE_STAGES_CONFIG: Record<SpriteStageLevel, SpriteStageInfo> = {
  1: { level: 1, name: 'Seed', stageGroup: 'Seed', description: 'A quiet dormant seed planted in rich organic soil.', minStreak: 0, minTotalHours: 0, spriteUrl: '/sprites/stage_1.png' },
  2: { level: 2, name: 'Cracked Seed', stageGroup: 'Seed', description: 'Nascent roots pushing through the fertile earth.', minStreak: 1, minTotalHours: 1, spriteUrl: '/sprites/stage_2.png' },
  3: { level: 3, name: 'Sprout', stageGroup: 'Sprout', description: 'Fresh green cotyledons bursting with fresh curiosity.', minStreak: 2, minTotalHours: 2, spriteUrl: '/sprites/stage_3.png' },
  4: { level: 4, name: 'Tiny Sprout', stageGroup: 'Sprout', description: 'Delicate leaves lifting upward toward the morning sunlight.', minStreak: 3, minTotalHours: 3, spriteUrl: '/sprites/stage_4.png' },
  5: { level: 5, name: 'Small Plant', stageGroup: 'Plant', description: 'First true leaves establishing steady biological rhythm.', minStreak: 4, minTotalHours: 5, spriteUrl: '/sprites/stage_5.png' },
  6: { level: 6, name: 'Seedling', stageGroup: 'Plant', description: 'A resilient stem putting down firm roots.', minStreak: 5, minTotalHours: 7, spriteUrl: '/sprites/stage_6.png' },
  7: { level: 7, name: 'Young Plant', stageGroup: 'Plant', description: 'Stems thickening with vigorous daily focus.', minStreak: 6, minTotalHours: 9, spriteUrl: '/sprites/stage_7.png' },
  8: { level: 8, name: 'Growing Plant', stageGroup: 'Plant', description: 'Branching nodes drinking in consistent study hours.', minStreak: 7, minTotalHours: 12, spriteUrl: '/sprites/stage_8.png' },
  9: { level: 9, name: 'Bigger Plant', stageGroup: 'Sapling', description: 'Broadening foliage storing compound knowledge.', minStreak: 8, minTotalHours: 15, spriteUrl: '/sprites/stage_9.png' },
  10: { level: 10, name: 'Bushy Sapling', stageGroup: 'Sapling', description: 'Dense emerald growth showing strong habit formation.', minStreak: 9, minTotalHours: 18, spriteUrl: '/sprites/stage_10.png' },
  11: { level: 11, name: 'Tall Sapling', stageGroup: 'Sapling', description: 'Rising high with disciplined academic determination.', minStreak: 10, minTotalHours: 22, spriteUrl: '/sprites/stage_11.png' },
  12: { level: 12, name: 'Small Tree', stageGroup: 'Tree', description: 'Firm hardwood bark developing on the main trunk.', minStreak: 11, minTotalHours: 26, spriteUrl: '/sprites/stage_12.png' },
  13: { level: 13, name: 'Growing Tree', stageGroup: 'Tree', description: 'Sturdy primary boughs spreading outwards.', minStreak: 12, minTotalHours: 32, spriteUrl: '/sprites/stage_13.png' },
  14: { level: 14, name: 'Young Tree', stageGroup: 'Tree', description: 'Spreading young branches forming an eager emerald canopy.', minStreak: 14, minTotalHours: 38, spriteUrl: '/sprites/stage_14.png' },
  15: { level: 15, name: 'Leafy Tree', stageGroup: 'Tree', description: 'Lush umbrella of leaves offering quiet focus shelter.', minStreak: 16, minTotalHours: 46, spriteUrl: '/sprites/stage_15.png' },
  16: { level: 16, name: 'Full Tree', stageGroup: 'Tree', description: 'A grand rounded canopy enduring across seasons.', minStreak: 20, minTotalHours: 56, spriteUrl: '/sprites/stage_16.png' },
  17: { level: 17, name: 'Lush Tree', stageGroup: 'Tree', description: 'Thick, layered moss and wild vitality along the roots.', minStreak: 25, minTotalHours: 70, spriteUrl: '/sprites/stage_17.png' },
  18: { level: 18, name: 'Budding Tree', stageGroup: 'Flowering', description: 'Nascent floral buds preparing for milestone bloom.', minStreak: 30, minTotalHours: 85, spriteUrl: '/sprites/stage_18.png' },
  19: { level: 19, name: 'Flowering Tree', stageGroup: 'Flowering', description: 'Vibrant blossoms and visiting bees honoring your craft.', minStreak: 40, minTotalHours: 105, spriteUrl: '/sprites/stage_19.png' },
  20: { level: 20, name: 'Blooming Tree', stageGroup: 'Flowering', description: 'A sea of fragrant petals floating in the breeze.', minStreak: 50, minTotalHours: 130, spriteUrl: '/sprites/stage_20.png' },
  21: { level: 21, name: 'Fruiting Tree', stageGroup: 'Fruiting', description: 'Ripe ruby fruits representing harvested wisdom.', minStreak: 75, minTotalHours: 160, spriteUrl: '/sprites/stage_21.png' },
  22: { level: 22, name: 'Mature Tree', stageGroup: 'Ancient', description: 'The pinnacle of mastery, glowing with radiant celestial aura.', minStreak: 100, minTotalHours: 200, spriteUrl: '/sprites/stage_22.png' },
};

export function calculateSpriteStage(currentStreak: number, totalStudyHours: number): SpriteStageLevel {
  for (let lvl = 22; lvl >= 1; lvl--) {
    const config = SPRITE_STAGES_CONFIG[lvl as SpriteStageLevel];
    if (currentStreak >= config.minStreak || totalStudyHours >= config.minTotalHours) {
      return lvl as SpriteStageLevel;
    }
  }
  return 1;
}

export const TREE_STAGES_CONFIG: Record<TreeStage, TreeStageInfo> = {
  seed: { stage: 'seed', name: 'Seed', minStreak: 0, minTotalHours: 0, description: 'A dormant seed planted in fertile soil.', leafMultiplier: 1 },
  sprout: { stage: 'sprout', name: 'Sprout', minStreak: 2, minTotalHours: 2, description: 'Fresh green cotyledons bursting with curiosity.', leafMultiplier: 1.1 },
  sapling: { stage: 'sapling', name: 'Sapling', minStreak: 5, minTotalHours: 6, description: 'A resilient stem putting down firm roots.', leafMultiplier: 1.25 },
  young_tree: { stage: 'young_tree', name: 'Young Tree', minStreak: 10, minTotalHours: 15, description: 'Spreading young branches forming an emerald canopy.', leafMultiplier: 1.4 },
  mature_tree: { stage: 'mature_tree', name: 'Mature Tree', minStreak: 25, minTotalHours: 40, description: 'Strong hardwood trunk with expansive shelter.', leafMultiplier: 1.6 },
  large_tree: { stage: 'large_tree', name: 'Large Tree', minStreak: 50, minTotalHours: 90, description: 'A towering presence that flourishes through all seasons.', leafMultiplier: 1.8 },
  ancient_tree: { stage: 'ancient_tree', name: 'Ancient Tree', minStreak: 100, minTotalHours: 200, description: 'An ageless landmark of discipline and deep work.', leafMultiplier: 2.2 },
};

export function calculateTreeStage(currentStreak: number, totalStudyHours: number): TreeStage {
  if (currentStreak >= 100 || totalStudyHours >= 200) return 'ancient_tree';
  if (currentStreak >= 50 || totalStudyHours >= 90) return 'large_tree';
  if (currentStreak >= 25 || totalStudyHours >= 40) return 'mature_tree';
  if (currentStreak >= 10 || totalStudyHours >= 15) return 'young_tree';
  if (currentStreak >= 5 || totalStudyHours >= 6) return 'sapling';
  if (currentStreak >= 2 || totalStudyHours >= 2) return 'sprout';
  return 'seed';
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm-3',
    requiredDays: 3,
    title: '3-Day Momentum',
    description: 'Complete 3 consecutive days of focused study.',
    rewardType: 'tree_pot',
    rewardId: 'terracotta',
    rewardName: 'Terracotta Planter',
    unlocked: true,
  },
  {
    id: 'm-7',
    requiredDays: 7,
    title: '1-Week Foundation',
    description: 'A full cycle of uninterrupted discipline.',
    rewardType: 'flora',
    rewardId: 'sakura_blossom',
    rewardName: 'Cherry Blossoms',
    unlocked: true,
  },
  {
    id: 'm-14',
    requiredDays: 14,
    title: 'Fortnight Fortitude',
    description: 'Two weeks of consistent daily progress.',
    rewardType: 'tree_pot',
    rewardId: 'ceramic',
    rewardName: 'Glazed Ceramic Pot',
    unlocked: false,
  },
  {
    id: 'm-30',
    requiredDays: 30,
    title: 'Monthly Habit Master',
    description: '30 days solid. Consistency is now your second nature.',
    rewardType: 'aura',
    rewardId: 'sunbeam',
    rewardName: 'Morning Sunbeam Glow',
    unlocked: false,
  },
  {
    id: 'm-50',
    requiredDays: 50,
    title: 'Half-Century Scholar',
    description: '50 unbroken days of dedication.',
    rewardType: 'flora',
    rewardId: 'golden_leaves',
    rewardName: 'Golden Leaf Highlights',
    unlocked: false,
  },
  {
    id: 'm-100',
    requiredDays: 100,
    title: 'Century Elder',
    description: '100 days of deep intellectual exploration.',
    rewardType: 'tree_pot',
    rewardId: 'zen_stone',
    rewardName: 'Carved Zen Stone Base',
    unlocked: false,
  },
  {
    id: 'm-365',
    requiredDays: 365,
    title: 'Year of Enlightenment',
    description: '365 days of relentless dedication to your crafts.',
    rewardType: 'aura',
    rewardId: 'celestial_glow',
    rewardName: 'Celestial Starlight Aura',
    unlocked: false,
  },
];

const DEFAULT_ROOMS: StudyRoom[] = [
  {
    id: 'room-dsa',
    name: 'DSA Grind',
    description: 'LeetCode, algorithm problems, and interview preparation.',
    isPrivate: false,
    tags: ['Algorithms', 'Interviews', 'Competitive'],
    totalStudyHours: 48.5,
    creatorName: 'Anik',
    members: [
      {
        id: 'user-anik',
        name: 'Anik',
        avatarBg: '#1D8DEA',
        isStudying: true,
        liveStudyStartedAt: Date.now() - (2 * 3600 + 15 * 60) * 1000,
        todaySeconds: 2 * 3600 + 15 * 60,
        streakDays: 28,
      },
      {
        id: 'user-protyoy',
        name: 'Protyoy',
        avatarBg: '#18B85A',
        isStudying: false,
        todaySeconds: 1 * 3600 + 42 * 60,
        streakDays: 12,
        isCurrentUser: true,
      },
      {
        id: 'user-rahul',
        name: 'Rahul',
        avatarBg: '#F59E0B',
        isStudying: true,
        liveStudyStartedAt: Date.now() - 48 * 60 * 1000,
        todaySeconds: 48 * 60,
        streakDays: 7,
      },
      {
        id: 'user-sneha',
        name: 'Sneha',
        avatarBg: '#8B5CF6',
        isStudying: true,
        liveStudyStartedAt: Date.now() - (3 * 3600 + 2 * 60) * 1000,
        todaySeconds: 3 * 3600 + 2 * 60,
        streakDays: 42,
      },
      {
        id: 'user-elena',
        name: 'Elena Rostova',
        avatarBg: '#EC4899',
        isStudying: false,
        todaySeconds: 1 * 3600 + 10 * 60,
        streakDays: 19,
      }
    ]
  },
  {
    id: 'room-quiet',
    name: 'Quiet Library',
    description: 'Silent study space for reading, research, and deep focus.',
    isPrivate: false,
    tags: ['Reading', 'Deep Work', 'Solo Quiet'],
    totalStudyHours: 124.2,
    creatorName: 'Devon',
    members: [
      {
        id: 'user-devon',
        name: 'Devon Miller',
        avatarBg: '#10B981',
        isStudying: true,
        liveStudyStartedAt: Date.now() - 75 * 60 * 1000,
        todaySeconds: 2 * 3600 + 10 * 60,
        streakDays: 34,
      },
      {
        id: 'user-kai',
        name: 'Kai Tanaka',
        avatarBg: '#3B82F6',
        isStudying: false,
        todaySeconds: 55 * 60,
        streakDays: 15,
      },
      {
        id: 'user-zara',
        name: 'Zara Chen',
        avatarBg: '#6366F1',
        isStudying: true,
        liveStudyStartedAt: Date.now() - 120 * 60 * 1000,
        todaySeconds: 3 * 3600 + 40 * 60,
        streakDays: 89,
      }
    ]
  },
  {
    id: 'room-os',
    name: 'Systems & OS Cohort',
    description: 'Private research group for low-level systems and kernel development.',
    isPrivate: true,
    passcode: '482910',
    tags: ['Systems', 'C/Rust', 'Operating Systems'],
    totalStudyHours: 72.8,
    creatorName: 'Marcus',
    members: [
      {
        id: 'user-marcus',
        name: 'Marcus V.',
        avatarBg: '#F97316',
        isStudying: true,
        liveStudyStartedAt: Date.now() - 95 * 60 * 1000,
        todaySeconds: 2 * 3600 + 35 * 60,
        streakDays: 61,
      },
      {
        id: 'user-alex',
        name: 'Alex Rivera',
        avatarBg: '#06B6D4',
        isStudying: false,
        todaySeconds: 1 * 3600 + 20 * 60,
        streakDays: 16,
      }
    ]
  }
];

function generateDefaultWeekHistory(dailyGoalSeconds: number): StreakData['weekHistory'] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIndex = 4; // Let's say today is Friday (matching the prompt's 5-day week mock)
  
  return days.map((day, idx) => {
    let seconds = 0;
    if (idx < todayIndex) {
      // Completed past days
      seconds = dailyGoalSeconds + (idx % 2 === 0 ? 1200 : 600);
    } else if (idx === todayIndex) {
      // Friday: 1h 42m (6120 seconds) matching prompt example
      seconds = 6120;
    }
    return {
      dayName: day,
      dateStr: `2026-09-${20 + idx}`,
      seconds,
      metGoal: seconds >= dailyGoalSeconds,
    };
  });
}

const DEFAULT_STREAK: StreakData = {
  currentStreak: 12,
  longestStreak: 19,
  totalStudyDays: 48,
  totalStudySeconds: 48 * 2.1 * 3600,
  todayStudySeconds: 6120, // 1h 42m as in Section 5 of Prompt.md!
  dailyGoalSeconds: 7200, // 2h goal
  leavesGrownToday: 3,
  totalLeaves: 142,
  treeLevel: 14,
  xp: 4200,
  weekHistory: generateDefaultWeekHistory(7200),
  lastStudyDate: new Date().toISOString().split('T')[0],
  daysSinceLastStudy: 0,
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-protyoy',
  name: 'Protyoy',
  ghostMode: false,
  joinedRoomId: 'room-dsa',
  ambientSound: 'rain',
};

const DEFAULT_CUSTOMIZATION: TreeCustomization = {
  pot: 'terracotta',
  flora: 'sakura_blossom',
  aura: 'none',
};

export const storageService = {
  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getStreakData(): StreakData {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(DEFAULT_STREAK));
      return DEFAULT_STREAK;
    }
    return JSON.parse(raw);
  },

  saveStreakData(data: StreakData): void {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data));
  },

  getCustomization(): TreeCustomization {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATION);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(DEFAULT_CUSTOMIZATION));
      return DEFAULT_CUSTOMIZATION;
    }
    return JSON.parse(raw);
  },

  saveCustomization(customization: TreeCustomization): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMIZATION, JSON.stringify(customization));
  },

  getMilestones(): Milestone[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(DEFAULT_MILESTONES));
      return DEFAULT_MILESTONES;
    }
    return JSON.parse(raw);
  },

  saveMilestones(milestones: Milestone[]): void {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  },

  getRooms(): StudyRoom[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(DEFAULT_ROOMS));
      return DEFAULT_ROOMS;
    }
    return JSON.parse(raw);
  },

  saveRooms(rooms: StudyRoom[]): void {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  },

  getActiveSession(): StudySession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  },

  saveActiveSession(session: StudySession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    }
  },

  getSessionHistory(): CompletedSessionSummary[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    return raw ? JSON.parse(raw) : [];
  },

  addCompletedSession(session: CompletedSessionSummary): void {
    const history = this.getSessionHistory();
    history.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(history.slice(0, 50)));
  },

  getOfflineQueue(): CompletedSessionSummary[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  },

  enqueueOfflineSession(session: CompletedSessionSummary): void {
    const queue = this.getOfflineQueue();
    queue.push(session);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  },

  clearOfflineQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  },

  resetDefaults(): void {
    localStorage.clear();
  }
};

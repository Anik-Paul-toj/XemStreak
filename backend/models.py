import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey,
    DateTime,
    Text,
    Index
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar_bg = Column(String, default="#1D8DEA")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    timezone = Column(String, default="UTC")
    daily_goal_seconds = Column(Integer, default=7200) # 2 hours default

    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tree = relationship("TreeStateModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    streak = relationship("StreakModel", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("StudySessionModel", back_populates="user", cascade="all, delete-orphan")
    daily_progress = relationship("DailyProgressModel", back_populates="user", cascade="all, delete-orphan")
    room_memberships = relationship("RoomMemberModel", back_populates="user", cascade="all, delete-orphan")
    ai_messages = relationship("AIConversationModel", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("NotificationModel", back_populates="user", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    ghost_mode = Column(Boolean, default=False)
    sound_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)
    ambient_sound = Column(String, default="none") # none, rain, forest, lofi, cafe

    user = relationship("User", back_populates="settings")

class TreeStateModel(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    stage_level = Column(Integer, default=1) # Level 1 to 22 (starts at Level 1 Seed)
    total_leaves = Column(Integer, default=0)
    leaves_today = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    pot_type = Column(String, default="none")
    flora_type = Column(String, default="none")
    aura_type = Column(String, default="none")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="tree")

class StreakModel(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_study_days = Column(Integer, default=0)
    last_study_date = Column(String, nullable=True) # YYYY-MM-DD
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="streak")

class DailyProgressModel(Base):
    __tablename__ = "daily_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date_str = Column(String, nullable=False, index=True) # YYYY-MM-DD
    seconds_studied = Column(Integer, default=0)
    met_goal = Column(Boolean, default=False)
    leaves_earned = Column(Integer, default=0)

    user = relationship("User", back_populates="daily_progress")

    __table_args__ = (
        Index("idx_user_date", "user_id", "date_str", unique=True),
    )

class StudySessionModel(Base):
    __tablename__ = "study_sessions"

    id = Column(String, primary_key=True, index=True) # client session UUID
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    room_id = Column(String, ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    mode = Column(String, default="focus") # focus, free, goal
    title = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    target_seconds = Column(Integer, default=0)
    leaves_earned = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    sync_status = Column(String, default="synced") # synced, pending

    user = relationship("User", back_populates="sessions")
    room = relationship("StudyRoomModel", back_populates="sessions")

class StudyRoomModel(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_private = Column(Boolean, default=False)
    passcode = Column(String, nullable=True)
    tags = Column(String, default="Focus,Study") # comma-separated
    total_study_hours = Column(Float, default=0.0)
    creator_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    members = relationship("RoomMemberModel", back_populates="room", cascade="all, delete-orphan")
    sessions = relationship("StudySessionModel", back_populates="room")
    cheers = relationship("RoomCheerModel", back_populates="room", cascade="all, delete-orphan")

class RoomMemberModel(Base):
    __tablename__ = "room_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_studying = Column(Boolean, default=False)
    study_started_at = Column(DateTime, nullable=True)
    today_seconds = Column(Integer, default=0)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("StudyRoomModel", back_populates="members")
    user = relationship("User", back_populates="room_memberships")

    __table_args__ = (
        Index("idx_room_user", "room_id", "user_id", unique=True),
    )

class RoomCheerModel(Base):
    __tablename__ = "room_cheers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(String, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False, index=True)
    from_user_name = Column(String, nullable=False)
    to_user_name = Column(String, nullable=True) # None = room broadcast
    reaction = Column(String, nullable=False) # emoji/cheer e.g. "🔥", "🎉", "👏", "☕"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("StudyRoomModel", back_populates="cheers")

class AchievementModel(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    required_days = Column(Integer, default=0)
    reward_type = Column(String, nullable=False) # tree_pot, flora, aura, badge
    reward_id = Column(String, nullable=False)
    reward_name = Column(String, nullable=False)

class AIConversationModel(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String, nullable=False) # user or assistant
    message = Column(Text, nullable=False)
    context_tags = Column(String, nullable=True) # streak_reminder, tree_growth, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ai_messages")

class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    category = Column(String, default="study_reminder") # study_reminder, streak, milestone, room
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

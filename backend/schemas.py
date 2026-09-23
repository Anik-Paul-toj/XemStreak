from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth schemas
class UserRegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    daily_goal_seconds: Optional[int] = 7200

class UserLoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str

class UserProfileResponse(BaseModel):
    id: str
    username: str
    email: str
    avatar_bg: str
    daily_goal_seconds: int
    ghost_mode: bool
    ambient_sound: str
    current_streak: int
    longest_streak: int
    total_study_days: int
    tree_level: int
    total_leaves: int
    leaves_today: int
    xp: int
    pot_type: str
    flora_type: str
    aura_type: str

# Study Session schemas
class SessionCreateRequest(BaseModel):
    id: str
    mode: str
    title: str
    duration_seconds: int
    target_seconds: Optional[int] = 0
    room_id: Optional[str] = None
    completed_at: Optional[datetime] = None

class SessionResponse(BaseModel):
    id: str
    mode: str
    title: str
    duration_seconds: int
    leaves_earned: int
    xp_earned: int
    completed_at: datetime
    room_id: Optional[str] = None

# Offline sync batch schema (Section 24)
class BatchSyncRequest(BaseModel):
    sessions: List[SessionCreateRequest]

class BatchSyncResponse(BaseModel):
    synced_count: int
    total_study_seconds: int
    current_streak: int
    total_leaves: int
    tree_level: int

# Study Room schemas
class CreateRoomRequest(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    is_private: bool = False
    passcode: Optional[str] = None
    tags: Optional[str] = "Deep Work,Focus"
    creator_name: Optional[str] = None

class RoomMemberSchema(BaseModel):
    id: str
    name: str
    avatar_bg: str
    is_studying: bool
    live_study_started_at: Optional[float] = None
    today_seconds: int
    streak_days: int
    is_current_user: bool = False

class StudyRoomResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    is_private: bool
    passcode: Optional[str] = None
    tags: List[str]
    total_study_hours: float
    members: List[RoomMemberSchema]

class RoomCheerRequest(BaseModel):
    reaction: str
    to_user_name: Optional[str] = None

class RoomCheerResponse(BaseModel):
    id: int
    room_id: str
    from_user_name: str
    to_user_name: Optional[str]
    reaction: str
    created_at: datetime

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    study_seconds: int
    streak_days: int
    is_current_user: bool = False

# AI Companion schemas (Sections 18, 19, 20)
class AIChatRequest(BaseModel):
    message: str
    room_name: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    provider: str
    suggested_action: Optional[str] = None

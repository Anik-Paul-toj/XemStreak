import os
import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from .database import engine, Base, get_db
from .models import (
    User,
    UserSettings,
    TreeStateModel,
    StreakModel,
    DailyProgressModel,
    StudySessionModel,
    StudyRoomModel,
    RoomMemberModel,
    RoomCheerModel,
    AchievementModel,
    AIConversationModel,
)
from .schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserProfileResponse,
    SessionCreateRequest,
    SessionResponse,
    BatchSyncRequest,
    BatchSyncResponse,
    CreateRoomRequest,
    StudyRoomResponse,
    RoomMemberSchema,
    RoomCheerRequest,
    RoomCheerResponse,
    LeaderboardEntry,
    AIChatRequest,
    AIChatResponse,
)
from .auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)
from .seed import seed_database
from .ai_service import companion_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed demo data
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title="XemStreak Study Streak API",
    version="1.0.0",
    description="Backend API for Study Streak and Focus PWA with SQLite, AI Companion, and Offline Sync",
    lifespan=lifespan
)

# CORS configuration for local React Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "XemStreak Backend", "time": datetime.datetime.utcnow().isoformat()}

# --------------------------------------------------------------------------
# Auth Endpoints (Section 21)
# --------------------------------------------------------------------------
@app.post("/api/auth/register", response_model=TokenResponse)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = "user-" + str(int(datetime.datetime.utcnow().timestamp() * 1000))
    user = User(
        id=user_id,
        username=req.username,
        email=req.email,
        password_hash=get_password_hash(req.password),
        daily_goal_seconds=req.daily_goal_seconds or 7200,
    )
    db.add(user)

    settings = UserSettings(user_id=user.id)
    tree = TreeStateModel(user_id=user.id, stage_level=1, total_leaves=0, leaves_today=0)
    streak = StreakModel(user_id=user.id, current_streak=0, longest_streak=0, total_study_days=0)
    db.add_all([settings, tree, streak])
    db.commit()

    token = create_access_token({"sub": user.id, "username": user.username})
    return TokenResponse(access_token=token, user_id=user.id, username=user.username)

@app.post("/api/auth/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id, "username": user.username})
    return TokenResponse(access_token=token, user_id=user.id, username=user.username)

@app.get("/api/auth/me", response_model=UserProfileResponse)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tree = user.tree or TreeStateModel()
    streak = user.streak or StreakModel()
    settings = user.settings or UserSettings()

    return UserProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_bg=user.avatar_bg,
        daily_goal_seconds=user.daily_goal_seconds,
        ghost_mode=settings.ghost_mode,
        ambient_sound=settings.ambient_sound,
        current_streak=streak.current_streak,
        longest_streak=streak.longest_streak,
        total_study_days=streak.total_study_days,
        tree_level=tree.stage_level,
        total_leaves=tree.total_leaves,
        leaves_today=tree.leaves_today,
        xp=tree.xp,
        pot_type=tree.pot_type,
        flora_type=tree.flora_type,
        aura_type=tree.aura_type,
    )

# --------------------------------------------------------------------------
# Study Sessions & Analytics (Sections 8, 9, 28)
# --------------------------------------------------------------------------
@app.post("/api/study/session", response_model=SessionResponse)
def create_session(
    req: SessionCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Idempotent check
    existing = db.query(StudySessionModel).filter(StudySessionModel.id == req.id).first()
    if existing:
        return existing

    leaves = max(1, req.duration_seconds // 900) if req.duration_seconds >= 180 else 0
    xp = req.duration_seconds // 6

    session = StudySessionModel(
        id=req.id,
        user_id=user.id,
        room_id=req.room_id,
        mode=req.mode,
        title=req.title,
        duration_seconds=req.duration_seconds,
        target_seconds=req.target_seconds,
        leaves_earned=leaves,
        xp_earned=xp,
        completed_at=req.completed_at or datetime.datetime.utcnow(),
    )
    db.add(session)

    # Update tree progress & leveling (1 to 22)
    if user.tree:
        user.tree.total_leaves += leaves
        user.tree.leaves_today += leaves
        user.tree.xp += xp
        # 22 levels mapping: level increases organically every ~250 XP
        new_level = min(22, max(1, 1 + (user.tree.xp // 250)))
        user.tree.stage_level = new_level

    # Update streak
    today_str = datetime.date.today().isoformat()
    daily = db.query(DailyProgressModel).filter(
        DailyProgressModel.user_id == user.id,
        DailyProgressModel.date_str == today_str
    ).first()

    if not daily:
        daily = DailyProgressModel(user_id=user.id, date_str=today_str, seconds_studied=0)
        db.add(daily)

    daily.seconds_studied += req.duration_seconds
    daily.leaves_earned += leaves
    if daily.seconds_studied >= user.daily_goal_seconds:
        daily.met_goal = True
        if user.streak and user.streak.last_study_date != today_str:
            user.streak.current_streak += 1
            user.streak.longest_streak = max(user.streak.longest_streak, user.streak.current_streak)
            user.streak.total_study_days += 1
            user.streak.last_study_date = today_str

    db.commit()
    db.refresh(session)
    return session

@app.get("/api/study/analytics")
def get_analytics(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    today_str = datetime.date.today().isoformat()
    today_prog = db.query(DailyProgressModel).filter(
        DailyProgressModel.user_id == user.id,
        DailyProgressModel.date_str == today_str
    ).first()

    all_sessions = db.query(StudySessionModel).filter(StudySessionModel.user_id == user.id).all()
    total_secs = sum(s.duration_seconds for s in all_sessions)
    today_secs = today_prog.seconds_studied if today_prog else 0

    # 7-day consistency history
    week_data = []
    today = datetime.date.today()
    for i in range(7):
        d = today - datetime.timedelta(days=(today.weekday() - i))
        d_str = d.isoformat()
        prog = db.query(DailyProgressModel).filter(
            DailyProgressModel.user_id == user.id,
            DailyProgressModel.date_str == d_str
        ).first()
        week_data.append({
            "day": d.strftime("%a"),
            "date": d_str,
            "seconds": prog.seconds_studied if prog else 0,
            "met_goal": prog.met_goal if prog else False
        })

    return {
        "today_seconds": today_secs,
        "total_seconds": total_secs,
        "week_history": week_data,
        "current_streak": user.streak.current_streak if user.streak else 0,
        "longest_streak": user.streak.longest_streak if user.streak else 0,
        "total_leaves": user.tree.total_leaves if user.tree else 0,
        "tree_level": user.tree.stage_level if user.tree else 1,
    }

# --------------------------------------------------------------------------
# Offline Data Synchronization (Sections 23 & 24)
# --------------------------------------------------------------------------
@app.post("/api/sync/batch", response_model=BatchSyncResponse)
def batch_sync(
    req: BatchSyncRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    synced = 0
    today_str = datetime.date.today().isoformat()

    for item in req.sessions:
        # Check idempotency
        if db.query(StudySessionModel).filter(StudySessionModel.id == item.id).first():
            continue

        leaves = max(1, item.duration_seconds // 900) if item.duration_seconds >= 180 else 0
        xp = item.duration_seconds // 6

        session = StudySessionModel(
            id=item.id,
            user_id=user.id,
            room_id=item.room_id,
            mode=item.mode,
            title=item.title,
            duration_seconds=item.duration_seconds,
            target_seconds=item.target_seconds,
            leaves_earned=leaves,
            xp_earned=xp,
            completed_at=item.completed_at or datetime.datetime.utcnow(),
            sync_status="synced",
        )
        db.add(session)
        synced += 1

        if user.tree:
            user.tree.total_leaves += leaves
            user.tree.leaves_today += leaves
            user.tree.xp += xp
            user.tree.stage_level = min(22, max(1, 1 + (user.tree.xp // 250)))

        # Update daily record
        daily = db.query(DailyProgressModel).filter(
            DailyProgressModel.user_id == user.id,
            DailyProgressModel.date_str == today_str
        ).first()
        if not daily:
            daily = DailyProgressModel(user_id=user.id, date_str=today_str, seconds_studied=0)
            db.add(daily)
        daily.seconds_studied += item.duration_seconds
        daily.leaves_earned += leaves
        if daily.seconds_studied >= user.daily_goal_seconds:
            daily.met_goal = True

    db.commit()

    all_sessions = db.query(StudySessionModel).filter(StudySessionModel.user_id == user.id).all()
    total_study_seconds = sum(s.duration_seconds for s in all_sessions)

    return BatchSyncResponse(
        synced_count=synced,
        total_study_seconds=total_study_seconds,
        current_streak=user.streak.current_streak if user.streak else 0,
        total_leaves=user.tree.total_leaves if user.tree else 0,
        tree_level=user.tree.stage_level if user.tree else 1,
    )

# --------------------------------------------------------------------------
# Study Rooms, Leaderboard & Social Cheers (Sections 12, 13, 14, 15, 16, 17)
# --------------------------------------------------------------------------
@app.get("/api/rooms", response_model=List[StudyRoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(StudyRoomModel).all()
    res = []
    for r in rooms:
        tag_list = [t.strip() for t in r.tags.split(",") if t.strip()]
        member_list = []
        for m in r.members:
            u = m.user
            if not u:
                continue
            started_ts = m.study_started_at.timestamp() if m.study_started_at else None
            member_list.append(RoomMemberSchema(
                id=u.id,
                name=u.username,
                avatar_bg=u.avatar_bg,
                is_studying=m.is_studying,
                live_study_started_at=started_ts,
                today_seconds=m.today_seconds,
                streak_days=u.streak.current_streak if u.streak else 0,
            ))
        res.append(StudyRoomResponse(
            id=r.id,
            name=r.name,
            description=r.description,
            is_private=r.is_private,
            passcode=r.passcode,
            tags=tag_list,
            total_study_hours=r.total_study_hours,
            members=member_list,
        ))
    return res

@app.post("/api/rooms", response_model=StudyRoomResponse)
def create_room(
    req: CreateRoomRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    room_id = "room-" + str(int(datetime.datetime.utcnow().timestamp()))
    room = StudyRoomModel(
        id=room_id,
        name=req.name,
        description=req.description,
        is_private=req.is_private,
        passcode=req.passcode if req.is_private else None,
        tags=req.tags or "Study,Focus",
        total_study_hours=0.0,
        creator_id=user.id,
    )
    db.add(room)
    db.flush()

    # Add creator as member
    member = RoomMemberModel(room_id=room.id, user_id=user.id, is_studying=False)
    db.add(member)
    db.commit()

    return StudyRoomResponse(
        id=room.id,
        name=room.name,
        description=room.description,
        is_private=room.is_private,
        passcode=room.passcode,
        tags=[t.strip() for t in room.tags.split(",") if t.strip()],
        total_study_hours=0.0,
        members=[
            RoomMemberSchema(
                id=user.id,
                name=user.username,
                avatar_bg=user.avatar_bg,
                is_studying=False,
                today_seconds=0,
                streak_days=user.streak.current_streak if user.streak else 0,
                is_current_user=True,
            )
        ]
    )

@app.get("/api/rooms/{room_id}/leaderboard", response_model=List[LeaderboardEntry])
def get_room_leaderboard(
    room_id: str,
    user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    room = db.query(StudyRoomModel).filter(StudyRoomModel.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Sort members by today's study seconds
    sorted_members = sorted(room.members, key=lambda m: m.today_seconds, reverse=True)
    res = []
    for rank, m in enumerate(sorted_members, start=1):
        u = m.user
        if not u:
            continue
        res.append(LeaderboardEntry(
            rank=rank,
            username=u.username,
            study_seconds=m.today_seconds,
            streak_days=u.streak.current_streak if u.streak else 0,
            is_current_user=(user and user.id == u.id),
        ))
    return res

@app.post("/api/rooms/{room_id}/cheer", response_model=RoomCheerResponse)
def send_room_cheer(
    room_id: str,
    req: RoomCheerRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    room = db.query(StudyRoomModel).filter(StudyRoomModel.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    cheer = RoomCheerModel(
        room_id=room.id,
        from_user_name=user.username,
        to_user_name=req.to_user_name,
        reaction=req.reaction,
    )
    db.add(cheer)
    db.commit()
    db.refresh(cheer)
    return cheer

@app.get("/api/rooms/{room_id}/cheers", response_model=List[RoomCheerResponse])
def get_room_cheers(room_id: str, db: Session = Depends(get_db)):
    cheers = db.query(RoomCheerModel).filter(
        RoomCheerModel.room_id == room_id
    ).order_by(RoomCheerModel.created_at.desc()).limit(20).all()
    return cheers

# --------------------------------------------------------------------------
# AI Study Companion (Sections 18, 19, 20)
# --------------------------------------------------------------------------
STAGE_NAMES_22 = [
    "Seed", "Cracked Seed", "Sprout", "Tiny Sprout", "Small Plant",
    "Seedling", "Young Plant", "Growing Plant", "Bigger Plant", "Bushy Sapling", "Tall Sapling",
    "Small Tree", "Growing Tree", "Young Tree", "Leafy Tree", "Full Tree",
    "Lush Tree", "Budding Tree", "Flowering Tree", "Blooming Tree", "Fruiting Tree", "Mature Tree"
]

@app.post("/api/ai/companion/chat", response_model=AIChatResponse)
def companion_chat(
    req: AIChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tree = user.tree or TreeStateModel()
    streak = user.streak or StreakModel()
    level = min(22, max(1, tree.stage_level))
    stage_name = STAGE_NAMES_22[level - 1]

    today_str = datetime.date.today().isoformat()
    daily = db.query(DailyProgressModel).filter(
        DailyProgressModel.user_id == user.id,
        DailyProgressModel.date_str == today_str
    ).first()
    today_minutes = (daily.seconds_studied // 60) if daily else 102
    goal_minutes = user.daily_goal_seconds // 60

    user_context = {
        "username": user.username,
        "streak": streak.current_streak,
        "today_minutes": today_minutes,
        "goal_minutes": goal_minutes,
        "tree_level": level,
        "tree_name": stage_name,
        "room_name": req.room_name,
    }

    result = companion_manager.get_reply(req.message, user_context)

    # Save to history
    user_msg = AIConversationModel(user_id=user.id, role="user", message=req.message)
    bot_msg = AIConversationModel(user_id=user.id, role="assistant", message=result["reply"])
    db.add_all([user_msg, bot_msg])
    db.commit()

    return AIChatResponse(
        reply=result["reply"],
        provider=result["provider"]
    )

import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    User,
    UserSettings,
    TreeStateModel,
    StreakModel,
    DailyProgressModel,
    StudyRoomModel,
    RoomMemberModel,
    RoomCheerModel,
    AchievementModel
)
from .auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.username == "Protyoy").first()
        if existing_user:
            return

        # 1. Create Demo User
        protyoy = User(
            id="user-protyoy",
            username="Protyoy",
            email="protyoy@xempla.com",
            password_hash=get_password_hash("streak2026"),
            avatar_bg="#18B85A",
            daily_goal_seconds=7200,
            timezone="Asia/Kolkata",
        )
        db.add(protyoy)

        settings = UserSettings(
            user_id=protyoy.id,
            ghost_mode=False,
            sound_enabled=True,
            notifications_enabled=True,
            ambient_sound="rain",
        )
        db.add(settings)

        tree = TreeStateModel(
            user_id=protyoy.id,
            stage_level=14, # Young Tree matching sprite 14
            total_leaves=142,
            leaves_today=3,
            xp=4200,
            pot_type="terracotta",
            flora_type="sakura_blossom",
            aura_type="none",
        )
        db.add(tree)

        streak = StreakModel(
            user_id=protyoy.id,
            current_streak=12,
            longest_streak=19,
            total_study_days=48,
            last_study_date=datetime.date.today().isoformat(),
        )
        db.add(streak)

        # 2. Week Daily Progress
        today = datetime.date.today()
        for i in range(7):
            day_date = today - datetime.timedelta(days=(today.weekday() - i))
            is_past = i < today.weekday()
            is_today = i == today.weekday()
            secs = 7800 if is_past else (6120 if is_today else 0)
            progress = DailyProgressModel(
                user_id=protyoy.id,
                date_str=day_date.isoformat(),
                seconds_studied=secs,
                met_goal=secs >= 7200,
                leaves_earned=4 if is_past else (3 if is_today else 0),
            )
            db.add(progress)

        # 3. Achievements
        achievements_data = [
            ("m-3", "3-Day Momentum", "Complete 3 consecutive days of study", 3, "tree_pot", "terracotta", "Terracotta Planter"),
            ("m-7", "1-Week Foundation", "7 days of uninterrupted focus", 7, "flora", "sakura_blossom", "Cherry Blossoms"),
            ("m-14", "Fortnight Fortitude", "Two weeks of consistent progress", 14, "tree_pot", "ceramic", "Glazed Ceramic Pot"),
            ("m-30", "Monthly Habit Master", "30 days solid study consistency", 30, "aura", "sunbeam", "Morning Sunbeam Glow"),
            ("m-50", "Half-Century Scholar", "50 days unbroken dedication", 50, "flora", "golden_leaves", "Golden Leaf Highlights"),
            ("m-100", "Century Elder", "100 days of deep work", 100, "tree_pot", "zen_stone", "Carved Zen Stone Base"),
            ("m-365", "Year of Enlightenment", "365 days of relentless dedication", 365, "aura", "celestial_glow", "Celestial Starlight Aura"),
        ]
        for aid, title, desc, req, rtype, rid, rname in achievements_data:
            ach = AchievementModel(
                id=aid,
                title=title,
                description=desc,
                required_days=req,
                reward_type=rtype,
                reward_id=rid,
                reward_name=rname,
            )
            db.add(ach)

        # 4. Study Rooms
        dsa_room = StudyRoomModel(
            id="room-dsa",
            name="DSA Grind",
            description="LeetCode, algorithm problems, and interview preparation.",
            is_private=False,
            tags="Algorithms,Interviews,Competitive",
            total_study_hours=48.5,
            creator_id="user-anik",
        )
        quiet_room = StudyRoomModel(
            id="room-quiet",
            name="Quiet Library",
            description="Silent study space for reading, research, and deep focus.",
            is_private=False,
            tags="Reading,Deep Work,Solo Quiet",
            total_study_hours=124.2,
            creator_id="user-devon",
        )
        os_room = StudyRoomModel(
            id="room-os",
            name="Systems & OS Cohort",
            description="Private research group for low-level systems and kernel development.",
            is_private=True,
            passcode="482910",
            tags="Systems,C/Rust,Operating Systems",
            total_study_hours=72.8,
            creator_id="user-marcus",
        )
        db.add_all([dsa_room, quiet_room, os_room])
        db.flush()

        # Add Members to DSA Room
        now = datetime.datetime.utcnow()
        anik_user = User(
            id="user-anik",
            username="Anik",
            email="anik@xempla.com",
            password_hash=get_password_hash("study123"),
            avatar_bg="#1D8DEA",
        )
        rahul_user = User(
            id="user-rahul",
            username="Rahul",
            email="rahul@xempla.com",
            password_hash=get_password_hash("study123"),
            avatar_bg="#F59E0B",
        )
        sneha_user = User(
            id="user-sneha",
            username="Sneha",
            email="sneha@xempla.com",
            password_hash=get_password_hash("study123"),
            avatar_bg="#8B5CF6",
        )
        db.add_all([anik_user, rahul_user, sneha_user])
        db.flush()

        members = [
            RoomMemberModel(room_id=dsa_room.id, user_id=anik_user.id, is_studying=True, study_started_at=now - datetime.timedelta(minutes=135), today_seconds=8100),
            RoomMemberModel(room_id=dsa_room.id, user_id=protyoy.id, is_studying=False, today_seconds=6120),
            RoomMemberModel(room_id=dsa_room.id, user_id=rahul_user.id, is_studying=True, study_started_at=now - datetime.timedelta(minutes=48), today_seconds=2880),
            RoomMemberModel(room_id=dsa_room.id, user_id=sneha_user.id, is_studying=True, study_started_at=now - datetime.timedelta(minutes=182), today_seconds=10920),
        ]
        db.add_all(members)

        # Initial Cheers
        cheers = [
            RoomCheerModel(room_id=dsa_room.id, from_user_name="Sneha", to_user_name="Protyoy", reaction="🔥"),
            RoomCheerModel(room_id=dsa_room.id, from_user_name="Anik", to_user_name=None, reaction="👏"),
        ]
        db.add_all(cheers)

        db.commit()
    finally:
        db.close()

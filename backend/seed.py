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
        # Check if achievements already seeded
        existing_ach = db.query(AchievementModel).first()
        if not existing_ach:
            # Seed standard milestones / achievements
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

        # Check if starter rooms already seeded
        existing_room = db.query(StudyRoomModel).first()
        if not existing_room:
            dsa_room = StudyRoomModel(
                id="room-dsa",
                name="DSA Grind",
                description="LeetCode, algorithm problems, and interview preparation.",
                is_private=False,
                tags="Algorithms,Interviews,Competitive",
                total_study_hours=0.0,
                creator_id="system",
            )
            quiet_room = StudyRoomModel(
                id="room-quiet",
                name="Quiet Library",
                description="Silent study space for reading, research, and deep focus.",
                is_private=False,
                tags="Reading,Deep Work,Solo Quiet",
                total_study_hours=0.0,
                creator_id="system",
            )
            os_room = StudyRoomModel(
                id="room-os",
                name="Systems & OS Cohort",
                description="Private research group for low-level systems and kernel development.",
                is_private=True,
                passcode="482910",
                tags="Systems,C/Rust,Operating Systems",
                total_study_hours=0.0,
                creator_id="system",
            )
            db.add_all([dsa_room, quiet_room, os_room])

        db.commit()
    finally:
        db.close()

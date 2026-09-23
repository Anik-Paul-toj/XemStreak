# XemStreak: Gamification Engine & Behavioral Economics

> **Document Version:** 1.0.0  
> **Target System:** Study Streak & Focus PWA (XemStreak)  
> **Design Philosophy:** Organic Digital Garden • Anti-Burnout • Calm Gamification

---

## 1. Executive Philosophy: "Calm Gamification"

Traditional productivity applications and educational games frequently fall into two destructive traps:
1. **The Sterile Tool:** Cold spreadsheets and timer stopwatches that provide zero emotional attachment or intrinsic reward.
2. **The Hyper-Addictive Skinner Box:** Predatory streak shaming, heart-loss penalties, aggressive push alerts, and gamified anxiety (e.g. Duolingo-style streak loss intimidation).

**XemStreak rejects both models in favor of a Digital Garden.**

### The Core Metaphor
```
Knowledge = Living Organism
Consistency = Soil & Sunlight
Time = Growth & Compound Wisdom
```

* **Non-Obsessive Productivity:** The product rewards showing up daily over pulling exhaustive 14-hour marathon sessions.
* **Gentle Resilience over Destruction:** A missed day does not burn your tree to ashes. The leaves gently dull into dormancy, ready to revive the moment you sit down for your next focused session.
* **Earned Aesthetic Elevation:** Every leaf, blossom, pot, and celestial aura is a visible token of personal discipline.

---

## 2. The Multi-Tiered Progression System

XemStreak uses a **dual-gated progression architecture**. A user cannot "rush" their tree by simply running a timer overnight, nor can they level up by opening the app for 10 seconds a day without doing real work.

```
                      ┌───────────────────────────────────────┐
                      │            STUDY BEHAVIOR             │
                      └───────────────────┬───────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  TEMPORAL CONSISTENCY   │                      │     DEEP WORK TIME     │
     │      (Streak Days)     │                      │      (Study Hours)     │
     └────────────┬───────────┘                      └────────────┬───────────┘
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    22-STAGE BOTANICAL EVOLUTION       │
                      │  (Level 1: Seed ➔ Level 22: Ancient)   │
                      └───────────────────────────────────────┘
```

### The 22-Stage Botanical Evolution Table

Each sprite level corresponds to an isolated, high-resolution slice from `public/sprite_tree.png`:

| Level | Stage Group | Sprite Frame | Stage Name | Min Streak | Min Total Hours | Psychological Theme |
|:---:|:---:|:---:|:---|:---:|:---:|:---|
| **1** | **Seed** | `stage_1.png` | **Dormant Seed** | 0 days | 0.0 hrs | Potential, clean slate, beginner's mind |
| **2** | **Seed** | `stage_2.png` | **Cracked Seed** | 1 day | 1.0 hrs | First breakthrough, nascent roots |
| **3** | **Sprout** | `stage_3.png` | **Sprout** | 2 days | 2.0 hrs | Breaking the surface, early habit |
| **4** | **Sprout** | `stage_4.png` | **Tiny Sprout** | 3 days | 3.0 hrs | Vertical momentum, curiosity |
| **5** | **Plant** | `stage_5.png` | **Small Plant** | 4 days | 5.0 hrs | First true leaves, biological rhythm |
| **6** | **Plant** | `stage_6.png` | **Seedling** | 5 days | 7.0 hrs | Firm rooting, foundation set |
| **7** | **Plant** | `stage_7.png` | **Young Plant** | 6 days | 9.0 hrs | Thicker stem, resistance to drift |
| **8** | **Plant** | `stage_8.png` | **Growing Plant** | 7 days | 12.0 hrs | One full week completed |
| **9** | **Sapling** | `stage_9.png` | **Bigger Plant** | 8 days | 15.0 hrs | Broadening foliage, knowledge retention |
| **10** | **Sapling** | `stage_10.png` | **Bushy Sapling** | 9 days | 18.0 hrs | Habit internalization |
| **11** | **Sapling** | `stage_11.png` | **Tall Sapling** | 10 days | 22.0 hrs | Visible presence, scholarly confidence |
| **12** | **Tree** | `stage_12.png` | **Small Tree** | 11 days | 26.0 hrs | Hardwood bark develops |
| **13** | **Tree** | `stage_13.png` | **Growing Tree** | 12 days | 32.0 hrs | Spreading primary boughs |
| **14** | **Tree** | `stage_14.png` | **Young Tree** | 14 days | 38.0 hrs | Two weeks unbroken, canopy forms |
| **15** | **Tree** | `stage_15.png` | **Leafy Tree** | 16 days | 46.0 hrs | Broad shade, focus shelter |
| **16** | **Tree** | `stage_16.png` | **Full Tree** | 20 days | 56.0 hrs | Rounded canopy, enduring structure |
| **17** | **Tree** | `stage_17.png` | **Lush Tree** | 25 days | 70.0 hrs | Deep moss, organic vitality |
| **18** | **Flowering** | `stage_18.png` | **Budding Tree** | 30 days | 85.0 hrs | One month milestone, floral emergence |
| **19** | **Flowering** | `stage_19.png` | **Flowering Tree** | 40 days | 105.0 hrs | Blossoms open, joy of craft |
| **20** | **Flowering** | `stage_20.png` | **Blooming Tree** | 50 days | 130.0 hrs | Half-century mark, falling petals |
| **21** | **Fruiting** | `stage_21.png` | **Fruiting Tree** | 75 days | 160.0 hrs | Tangible intellectual fruit, mastery |
| **22** | **Ancient** | `stage_22.png` | **Mature Ancient Tree**| 100 days | 200.0 hrs | Ageless landmark, starlight aura |

---

## 3. The In-Game Economics: Currencies, Faucets & Sinks

XemStreak employs a **three-currency non-inflationary economy**:

```
 ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
 │    FOCUS LEAVES      │      │  EXPERIENCE POINTS   │      │    STREAK CAPITAL    │
 │         🍃           │      │         ⚡ XP         │      │          🔥          │
 ├──────────────────────┤      ├──────────────────────┤      ├──────────────────────┤
 │  Tangible output of  │      │ Continuous metric of │      │ Temporal discipline  │
 │  focused blocks      │      │ focused minutes      │      │ & habit frequency    │
 └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### 3.1 Currency A: Focus Leaves (🍃)
* **What It Represents:** Physical biological mass grown on your tree.
* **Faucet (Earning Rate):**
  * Minimum threshold: 3 minutes (0 leaves if abandoned earlier, preventing timer farming).
  * Standard rate: **1 Leaf per 15 minutes** of uninterrupted study (`Math.floor(seconds / 900)`).
  * Example: A 50-minute deep work session yields **3 Leaves**.
* **Reservoir:** Stored in database table `trees.total_leaves` and `trees.leaves_today`.
* **Sinks & Utility:**
  * Displays as an ambient cosmetic counter in Navbar and Room leaderboards.
  * Future sink: Spend leaves to unlock soundscapes, garden artifacts, or donate to community room projects.

### 3.2 Currency B: Experience Points (XP)
* **What It Represents:** The kinetic energy powering sprite advancement.
* **Faucet (Earning Rate):**
  * **10 XP per minute** of verified study (1 XP every 6 seconds: `seconds // 6`).
  * Bonus milestone completion: +100 XP lump sum.
* **Anti-Abuse Cap:**
  * Soft cap at **240 minutes (2,400 XP) per day**. Minutes beyond 4 hours generate 50% XP to discourage unhealthy sleep deprivation.
* **Level Progression Formula:**
  $$\text{Level} = \min\left(22, \max\left(1, 1 + \left\lfloor \frac{\text{Total XP}}{250} \right\rfloor \right)\right)$$
  *(Also gated by the required minimum streak/hours criteria in the stage table).*

### 3.3 Currency C: Streak Capital (🔥 Days)
* **What It Represents:** Consecutive unbroken days of reaching or exceeding the daily study goal.
* **Rules & Verification:**
  * Day evaluation resets at midnight local timezone.
  * A day counts if and only if $\text{todayStudySeconds} \ge \text{dailyGoalSeconds}$.
  * Default goal: **2 Hours (7,200s)**. User-configurable to 30m, 60m, 90m, or custom.
  * Increments maximum **once per calendar day**.

---

## 4. Emotional Attachment & Biological Tree States

The tree reacts dynamically to the user's immediate and historical study behavior:

```
     ┌───────────────────────┐
     │       TREE STATE      │
     └───────────┬───────────┘
                 │
 ┌───────────────┼───────────────┬────────────────────────┐
 │               │               │                        │
 ▼               ▼               ▼                        ▼
IDLE         ACTIVE STUDY    CONSISTENT              MISSED DAYS
Quiet sway   Sunlight pollen Rapid pulse             Dull desaturation
Default      Timer ticking   Streak >= 5             Days missed >= 2
```

1. **Idle State (`idle`):**
   * Calm, subtle breathing animation (`treeGentleSway` 6s ease-in-out).
   * Soil base firmly anchored, clean natural colors.
2. **Active Focus State (`active_studying`):**
   * Triggered when focus timer is running.
   * Floating sunlight particles rise from the canopy (`particleFloat` animation).
   * In Full Screen Zen mode, ambient radial glow expands behind the foliage.
3. **Consistent State (`consistent`):**
   * Unlocked when current streak $\ge 5$ days.
   * Vibrant leaf green highlights, healthy aura, subtle sparkle particles.
4. **Dormant / Missed Days State (`missed_days`):**
   * Triggered when $\text{daysSinceLastStudy} \ge 2$.
   * CSS filter desaturates the tree sprite to 45% saturation and reduces brightness to 88%.
   * Accompanied by supportive messaging: *"Your tree is dormant, waiting for sunlight. A single session will awaken it."*
   * **No permanent death.** Returning revives the tree instantly.

---

## 5. Milestone & Cosmetic Ecosystem (Sanctuary Unlocks)

Milestones reward long-term grit with cosmetic customizations for the tree and personal sanctuary:

```
 3 Days ──► Terracotta Planter     (Tree Pot)
 7 Days ──► Cherry Blossoms        (Flora Accent)
14 Days ──► Glazed Ceramic Pot     (Tree Pot)
30 Days ──► Morning Sunbeam Glow   (Aura FX)
50 Days ──► Golden Leaf Highlights (Flora Accent)
100 Days ──► Zen Stone Base        (Tree Pot)
365 Days ──► Celestial Starlight   (Mythic Aura)
```

### Unlock Details

| Milestone ID | Required Days | Reward Category | Item Name | Visual Impact |
|:---|:---:|:---|:---|:---|
| `m-3` | 3 Days | **Pot** | **Terracotta Planter** | Warm clay pot replacing raw ground soil |
| `m-7` | 7 Days | **Flora** | **Cherry Blossoms** | Delicate pink sakura blossoms nestled in the boughs |
| `m-14` | 14 Days | **Pot** | **Glazed Ceramic Pot** | Minimalist royal cobalt & white ceramic base |
| `m-30` | 30 Days | **Aura** | **Morning Sunbeam** | Soft golden ray filtering diagonally through foliage |
| `m-50` | 50 Days | **Flora** | **Golden Leaves** | Gilded leaf highlights that glint on hover |
| `m-100` | 100 Days | **Pot** | **Carved Zen Stone** | Hand-chiseled granite river-stone base |
| `m-365` | 365 Days | **Aura** | **Celestial Starlight** | Orbiting stardust motes and soft nebula glow |

All equipped items are persisted in `trees.pot_type`, `trees.flora_type`, and `trees.aura_type` and rendered around the sprite frame.

---

## 6. Social Economics & Study Rooms

### 6.1 Non-Toxic Leaderboard Design
Traditional leaderboards create toxicity, cheating, and demotivation for newcomers who see someone with 10,000 hours at rank #1.

**XemStreak's Social Protocol:**
1. **Daily Reset:** Room leaderboards rank members by **Today's Study Time**, giving every member a clean, fair chance to reach the podium every morning.
2. **Streak Badging:** The current streak is displayed as a companion badge (`🥇 Anik • 3h 15m (28d streak)`), highlighting daily effort above raw all-time totals.
3. **Ghost Mode Privacy (Incognito):**
   * Users who prefer solitary deep work can enable **Ghost Mode** with one click.
   * In Ghost Mode, your live timer and study minutes are completely hidden from room members, while still updating your personal tree and streak.

### 6.2 Micro-Affirmation Economy: Social Cheers
Rather than text comments that require moderation and create distraction, rooms use a **micro-reaction cheer bar**:
* 🔥 **Flame:** Honoring intense focus.
* 👏 **Clap:** Celebrating a completed milestone or session.
* ☕ **Coffee:** Offering solidarity during a late-night grind.
* 🎉 **Party:** Celebrating a level-up or streak milestone.

Cheers are lightweight (`RoomCheerModel`), ephemeral (last 20 displayed), and trigger zero interruptive push banners.

---

## 7. Anti-Abuse, Timer Integrity & Synchronization

To preserve the psychological value of streaks and levels, the economy includes strict anti-tampering guards:

| Vulnerability | Mitigation Strategy | Technical Implementation |
|:---|:---|:---|
| **Timer Throttling / Tab Sleep** | Never rely on `setInterval(sec++)` | Stores `started_at`, `paused_at`, `accumulated_seconds` timestamps. Time is calculated dynamically from the monotonic system clock. |
| **Overnight AFK Farming** | Auto-session cap | Active focus sessions cannot exceed 3 hours in a single continuous block without user interaction. |
| **Network Failure Data Loss** | Local-First Sync Queue | Sessions are written to IndexedDB/LocalStorage first with client UUIDs (`sync_status: 'pending'`). Auto-batch synced to FastAPI on reconnection. |
| **Idempotency** | Duplicate sync replay | Backend checks `db.query(StudySessionModel).filter_by(id=req.id).first()`. Duplicate requests return HTTP 200 without awarding duplicate XP or leaves. |
| **Device Clock Tampering** | Server timestamp validation | The FastAPI backend stamps `completed_at = datetime.utcnow()` and validates against server UTC calendar day. |

---

## 8. Potential SaaS & Expansion Economics

For future production tiering, the economy is structured around **value-add serenity**, never artificial roadblocks:

```
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│             FREE TIER                │  │            PRO / COHORT              │
│          (Generous Core)             │  │        (Deep Mastery & Teams)        │
├──────────────────────────────────────┤  ├──────────────────────────────────────┤
│ • Full 22-stage tree growth          │  │ • Multi-Tree Arboretum (e.g. Tree 1  │
│ • Complete offline sync              │  │   for Code, Tree 2 for Languages)    │
│ • Unlimited focus sessions           │  │ • Unlimited Groq/Gemini AI messages  │
│ • Public & private study rooms       │  │ • Custom private room branding       │
│ • Built-in contextual AI companion   │  │ • High-fidelity audio uploads        │
│ • Standard soundscapes (Rain/Forest) │  │ • Team & University cohort analytics │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 9. Architectural Summary

1. **Input:** Deep work minutes from real human focus.
2. **Engine:** Non-linear progression curve requiring both volume (hours) and habit (streak).
3. **Reward:** 22 hand-crafted sprite evolutions, cosmetic pot/aura unlocks, and calm soundscapes.
4. **Outcome:** A healthy digital garden reflecting real-world intellectual mastery.

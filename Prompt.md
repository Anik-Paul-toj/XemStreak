# Build Prompt: Study Streak PWA

You are building a production-quality **study streak and focus PWA** using:

* **Frontend:** React
* **Backend:** Python + FastAPI
* **Database:** SQLite
* **PWA:** Installable Progressive Web App
* **Authentication:** Login / registration
* **Notifications:** Web Push / PWA notifications
* **AI:** Gemini and/or Groq API
* **Offline-first:** Core study tracking must continue working without an internet connection.

The product should feel like a **modern, calm, gamified study environment**, not like a conventional productivity dashboard.

---

# 1. PRODUCT CONCEPT

The application is a gamified study tracker where users grow a **virtual tree through consistent studying**.

Instead of raising a pet, the user's long-term progress is represented by a tree.

### Core idea

> **The more consistently you study, the more your tree grows.**

The user can:

1. Create a study goal.
2. Start a study session.
3. Track active study time.
4. Build a daily streak.
5. Grow their tree.
6. Join optional public/private study rooms.
7. See how much other people in the room are currently studying.
8. View other users' streaks and study progress.
9. Receive reminders and notifications.
10. Interact with an AI-powered study companion.

The application should encourage consistency rather than obsessive productivity.

---

# 2. DESIGN DIRECTION

IMPORTANT:

**Follow this design direction strictly.**

The UI should feel like a combination of:

* modern productivity application
* calm study environment
* minimal game
* digital garden
* premium SaaS dashboard

Avoid making it look like:

* a generic admin dashboard
* a school management system
* a childish game
* a cryptocurrency dashboard
* a conventional Pomodoro app

## Visual personality

The interface should communicate:

* calm
* focused
* minimal
* rewarding
* organic
* premium
* distraction-free

The tree should be the main visual metaphor throughout the application.

---

# 3. DESIGN SYSTEM

Use a warm natural visual language.

### Primary colors

Use a palette based around:

* warm off-white / cream background
* deep forest green
* muted sage green
* dark charcoal text
* subtle brown / earth tones
* very limited accent colors

Avoid overly saturated colors.

The application should primarily use:

```text
Background:
Warm off-white

Primary:
Deep forest green

Secondary:
Sage

Text:
Dark charcoal

Muted:
Warm gray

Accent:
Natural amber / sunlight tone
```

Do not use excessive gradients.

Do not use neon colors.

Do not make every element rounded.

Use rounded corners selectively.

---

# 4. TYPOGRAPHY

Use a modern, highly readable font.

Prioritize:

* excellent readability
* large numbers for study time
* clear hierarchy
* generous spacing

The application should feel spacious.

Avoid cramming information onto the screen.

---

# 5. MAIN USER EXPERIENCE

The primary screen should immediately communicate:

### "How am I doing today?"

The user should see:

```text
Good morning, Protyoy

Your tree
        🌳

12 day streak

Today
1h 42m / 2h

[ Start Studying ]

Today's progress
██████████████░░░░

Your tree grew 3 leaves today.
```

The tree should be visually prominent.

---

# 6. TREE SYSTEM

The tree is the primary gamification mechanism.

Every user owns a tree.

The tree has multiple growth stages.

Example:

```text
Seed
 ↓
Sprout
 ↓
Sapling
 ↓
Young Tree
 ↓
Mature Tree
 ↓
Large Tree
 ↓
Ancient Tree
```

Tree growth depends on:

* total study time
* consistency
* streak length
* completed study goals
* milestones

Do NOT make growth purely dependent on raw hours.

Consistency should matter.

---

# 7. TREE STATES

The tree can visually reflect the user's activity.

### Active studying

Tree is vibrant.

Possible animation:

* subtle leaf movement
* sunlight
* floating particles
* gentle wind

### Consistent user

Tree becomes:

* larger
* fuller
* more branches
* more leaves
* flowers/fruits depending on milestones

### User misses several days

Do NOT kill the tree.

Instead:

* leaves become slightly dull
* growth pauses
* environment becomes quieter

Once the user returns:

> "Your tree is happy to see you again."

The goal is to encourage returning, not punish failure.

---

# 8. STUDY SESSION

The user can start a study session from the main screen.

Example:

```text
┌──────────────────────────────┐
│                              │
│          01:42:38            │
│                              │
│       Deep Work Session      │
│                              │
│          🌳                  │
│                              │
│       [ Pause ]              │
│       [ Finish ]             │
│                              │
└──────────────────────────────┘
```

The timer must continue accurately even if:

* browser tab changes
* screen locks
* application is minimized
* device temporarily loses internet

The frontend should calculate elapsed time using timestamps rather than relying only on `setInterval`.

---

# 9. STUDY SESSION TYPES

Allow users to select:

### Focus Session

Example:

25 minutes

50 minutes

90 minutes

Custom

### Free Study

User simply starts studying and stops whenever they want.

### Goal-based

Example:

> Study DSA for 2 hours

or

> Complete 3 chapters of Operating Systems

The MVP can initially focus on time-based sessions.

---

# 10. DAILY STREAK

A streak represents consecutive days where the user meets their minimum study goal.

Example:

```text
Daily goal: 60 minutes

Monday   ✓
Tuesday  ✓
Wednesday ✓
Thursday ✓
Friday   ✓

🔥 5 day streak
```

Store:

* current streak
* longest streak
* total study days
* total study time
* today's study time

---

# 11. STREAK MILESTONES

Create milestones such as:

```text
3 days
7 days
14 days
30 days
50 days
100 days
365 days
```

Each milestone can unlock something.

Examples:

* new tree visual
* new environment
* tree pot
* background
* leaf type
* seasonal effect
* badge

Do not make the system pay-to-win.

---

# 12. STUDY ROOMS

Study rooms are **optional**.

The user should be able to use the application completely alone.

There should be a prominent:

> "Study Rooms"

section.

Users can:

* create a room
* join a room
* leave a room
* browse public rooms
* invite others
* create private rooms

---

# 13. ROOM CONCEPT

A study room is a shared virtual study space.

Example:

```text
┌────────────────────────────────────┐
│ DSA Grind                          │
│ 24 people studying                 │
│                                    │
│ 🔥 12 people active                │
│                                    │
│ Current room study time            │
│ 38h 24m                            │
│                                    │
│ ─────────────────────────────────  │
│                                    │
│ Protyoy       1h 42m    🔥 12 days │
│ Anik          2h 15m    🔥 28 days │
│ Rahul         48m       🔥 7 days  │
│ Sneha         3h 02m    🔥 42 days │
│                                    │
│             [ Join ]               │
└────────────────────────────────────┘
```

---

# 14. ROOM LIVE STUDY STATUS

When a user is actively studying in a room:

Show:

```text
🟢 Studying

01:24:32
```

When they stop:

```text
⚪ Offline
```

or:

```text
Recently studied
```

Do not expose unnecessary personal information.

Only expose information relevant to the room.

---

# 15. ROOM PRIVACY

Support:

### Public

Anyone can join.

### Private

Requires invitation/link/code.

### Friends-only

Only approved users can join.

Users should also be able to hide their study activity.

Privacy must be considered from the beginning rather than added later.

---

# 16. ROOM LEADERBOARD

Rooms may have an optional leaderboard.

Example:

```text
This Week

🥇 Alex       14h 24m
🥈 Protyoy    12h 18m
🥉 Anik       10h 42m
```

IMPORTANT:

Do not make the leaderboard the central focus.

The primary motivation should be personal consistency.

---

# 17. SOCIAL INTERACTION

Keep social interaction lightweight.

Users can see:

* username
* avatar
* current study status
* streak
* study time
* tree level

Potential actions:

* send encouragement
* react
* cheer

Avoid building a full social media feed.

---

# 18. AI STUDY COMPANION

The application will integrate Gemini and/or Groq.

The AI should not be a generic chatbot.

It should behave like a **study companion**.

The AI knows:

* user's current streak
* study time
* goals
* recent sessions
* tree growth
* achievements
* room context where appropriate

Example:

User:

> I studied for 2 hours today.

AI:

> That's your longest session this week. Your tree just reached a new growth stage. 🌱

User:

> I don't feel like studying.

AI:

> Let's make it small. Start a 15-minute session. You only need to focus until the timer ends.

---

# 19. AI PERSONALITY

The AI should be:

* supportive
* concise
* motivating
* friendly
* occasionally playful
* never annoying

Do not make the AI constantly send motivational quotes.

It should respond naturally to the user's context.

---

# 20. AI API ARCHITECTURE

Do NOT expose Gemini/Groq API keys in the React frontend.

The architecture should be:

```text
React PWA
   ↓
FastAPI
   ↓
AI service
   ↓
Gemini / Groq
```

The API key must remain server-side.

Create a provider abstraction so the AI provider can be switched.

Example:

```text
AIProvider
├── GeminiProvider
└── GroqProvider
```

---

# 21. AUTHENTICATION

Implement:

* registration
* login
* logout
* session persistence
* password hashing
* protected routes

Users should have:

```text
User
├── id
├── username
├── email
├── password_hash
├── avatar
├── created_at
├── timezone
├── daily_goal
└── settings
```

Never store plain-text passwords.

---

# 22. SQLITE DATABASE

Use SQLite for the backend.

Design a clean relational schema.

Suggested tables:

```text
users

user_settings

trees

study_sessions

daily_progress

streaks

achievements

rooms

room_members

room_sessions

notifications

ai_conversations
```

Use proper indexes.

Use foreign keys.

Use timestamps consistently.

---

# 23. OFFLINE-FIRST REQUIREMENT

This is extremely important.

The application must continue functioning when there is no internet.

At minimum, the following must work offline:

* opening the app
* viewing today's progress
* starting a timer
* stopping a timer
* viewing streak
* viewing tree
* recording study sessions
* viewing historical sessions

Use browser-side storage for offline state.

Possible architecture:

```text
React
 ↓
IndexedDB
 ↓
Offline queue
 ↓
Internet returns
 ↓
FastAPI
 ↓
SQLite
```

Do not assume the backend is always available.

---

# 24. DATA SYNCHRONIZATION

Implement a sync mechanism.

Example:

```text
User studies offline
        ↓
Session stored locally
        ↓
sync_status = pending
        ↓
Internet restored
        ↓
POST /sync
        ↓
FastAPI validates
        ↓
SQLite updated
        ↓
sync_status = synced
```

The system should avoid duplicate study sessions.

Use unique IDs / idempotency keys.

---

# 25. PWA

The application must be installable.

Implement:

* Web App Manifest
* service worker
* offline caching
* app icons
* splash/loading experience
* standalone display mode

The application should behave like a native application when installed.

---

# 26. NOTIFICATIONS

Support notifications such as:

### Study reminder

> 🌱 Your tree is waiting for today's study session.

### Streak reminder

> 🔥 You're on a 14-day streak. Don't break it today.

### Milestone

> 🌳 Your tree just reached a new growth stage!

### Room

> 📚 8 people are studying in your room right now.

Notifications must be configurable.

Users should be able to disable them.

Do not spam notifications.

---

# 27. DASHBOARD

The dashboard is the main screen.

Recommended structure:

```text
Header
 ├── Logo
 ├── Current streak
 ├── Profile
 └── Settings

Hero
 ├── Tree
 ├── Tree level
 ├── Growth progress
 └── motivational/contextual message

Today's Study
 ├── Current time
 ├── Daily goal
 ├── Progress
 └── Start Study button

Quick Stats
 ├── Today's time
 ├── Current streak
 ├── Best streak
 └── Total study time

Study Rooms
 ├── Active rooms
 └── Join room

Recent Activity
```

---

# 28. ANALYTICS

Provide a simple analytics page.

Show:

### Study time

* today
* this week
* this month
* all time

### Streak

* current
* longest
* study days

### Consistency

Example:

```text
Mon  ███████
Tue  █████
Wed  ████████
Thu  ███
Fri  ███████
Sat  ████████
Sun  █████
```

Use clean charts.

Do not turn this into a complex BI dashboard.

---

# 29. TREE ROOM / PERSONAL SPACE

Give the user a dedicated visual space where their tree exists.

This can eventually become the emotional center of the product.

Possible elements:

```text
Tree
Study desk
Books
Lamp
Calendar
Achievements
Decorations
```

Items can unlock as the user maintains consistency.

The environment should evolve with the user.

---

# 30. GAMIFICATION

Use:

* XP
* levels
* streaks
* milestones
* achievements
* tree growth
* environmental unlocks

Avoid excessive gamification.

The product should still feel like a serious study tool.

---

# 31. RESPONSIVE DESIGN

The application must work properly across:

* desktop
* tablet
* mobile

Prioritize usability rather than simply shrinking the desktop UI.

The study timer must remain easy to access on mobile.

---

# 32. ACCESSIBILITY

Implement:

* keyboard navigation
* accessible buttons
* proper contrast
* semantic HTML
* ARIA labels where needed
* visible focus states
* reduced-motion support

Animations must not prevent usability.

---

# 33. ANIMATIONS

Animations should be subtle.

Use animations for:

* tree growth
* XP gain
* streak milestone
* session start
* session completion
* page transitions

Avoid excessive motion.

The tree can have a subtle idle animation.

---

# 34. API DESIGN

Create clean FastAPI endpoints.

Example:

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me

GET    /dashboard

GET    /study/sessions
POST   /study/sessions
PATCH  /study/sessions/{id}

GET    /streak
GET    /progress

GET    /tree
POST   /tree/interact

GET    /rooms
POST   /rooms
GET    /rooms/{id}
POST   /rooms/{id}/join
POST   /rooms/{id}/leave

GET    /rooms/{id}/members

GET    /achievements

POST   /ai/chat

POST   /sync
```

Use Pydantic schemas.

Separate:

```text
routers
services
models
schemas
repositories
utils
```

Do not put the entire backend into one Python file.

---

# 35. FRONTEND ARCHITECTURE

Use a clean React structure.

Suggested:

```text
src/

components/
  Tree/
  StudyTimer/
  Streak/
  Room/
  UI/

pages/
  Dashboard/
  Study/
  Rooms/
  Analytics/
  Profile/
  Login/

hooks/

services/
  api/
  auth/
  sync/
  notifications/

store/

utils/

types/

pwa/
```

Use reusable components.

Avoid giant components.

---

# 36. STATE MANAGEMENT

Use an appropriate lightweight state-management approach.

Separate:

* authentication state
* study timer state
* user state
* tree state
* room state
* offline sync state

Do not duplicate server state unnecessarily.

---

# 37. TIMER ENGINE

The timer is a critical feature.

Do NOT implement the timer as:

```javascript
seconds++
```

because this becomes inaccurate when the browser throttles timers.

Instead store:

```text
started_at
paused_at
accumulated_duration
```

Calculate elapsed time from timestamps.

The timer should survive:

* tab switching
* browser throttling
* temporary offline state
* page refresh where possible

---

# 38. SECURITY

Implement:

* password hashing
* authentication middleware
* protected API routes
* input validation
* rate limiting where appropriate
* CORS configuration
* secure API key storage
* authorization checks for rooms
* authorization checks for user data

Users must only be able to modify their own data.

---

# 39. ENVIRONMENT VARIABLES

Use:

```text
DATABASE_URL

JWT_SECRET

GEMINI_API_KEY

GROQ_API_KEY

VAPID_PUBLIC_KEY

VAPID_PRIVATE_KEY
```

Never commit secrets.

Provide:

```text
.env.example
```

---

# 40. DEVELOPMENT EXPERIENCE

Create:

```text
README.md
```

with:

* project overview
* architecture
* setup instructions
* environment variables
* frontend setup
* backend setup
* database setup
* development commands
* production build instructions

---

# 41. SEED DATA

Provide development seed data.

Create sample:

* users
* study sessions
* rooms
* streaks
* achievements

This should allow the UI to immediately look populated during development.

---

# 42. EMPTY STATES

Design proper empty states.

Examples:

No study sessions:

> Your tree is waiting for its first session.
> Start studying and plant your first seed.

No rooms:

> No study rooms yet.
> Create one and invite your friends.

No streak:

> Every tree starts with a seed.

---

# 43. ERROR STATES

Do not display raw API errors.

Use friendly messages.

Example:

Instead of:

> HTTP 500 Internal Server Error

show:

> Something went wrong while syncing your study session. We'll try again automatically.

---

# 44. OFFLINE UI

Clearly communicate offline state without being intrusive.

Example:

```text
● Offline
Your progress is saved locally.
```

When synchronized:

```text
✓ Synced
```

The user should never lose a study session because of network failure.

---

# 45. FIRST-TIME USER EXPERIENCE

Onboarding should be short.

Step 1:

> What should we call you?

Step 2:

> What's your daily study goal?

Options:

```text
30 min
60 min
90 min
2 hours
Custom
```

Step 3:

> Name your tree.

Step 4:

Show:

```text
🌱

Every great tree starts with a seed.

Ready to grow yours?
```

Then:

> Start your first study session.

---

# 46. DESIGN PRINCIPLE

The product should communicate one simple concept:

> **Study consistently. Watch your tree grow.**

Every major UI decision should reinforce this.

---

# 47. WHAT NOT TO BUILD

For the initial MVP, do NOT build:

* complex social feeds
* direct messaging
* payments
* subscriptions
* marketplace
* excessive profile customization
* complicated friend systems
* complicated AI agents
* unnecessary microservices
* overly complex analytics
* cryptocurrency/web3 features

Focus on the core loop.

---

# 48. CORE MVP LOOP

The MVP must make this loop excellent:

```text
Open app
    ↓
See tree
    ↓
See today's progress
    ↓
Start studying
    ↓
Timer runs
    ↓
Finish session
    ↓
Earn XP
    ↓
Tree grows
    ↓
Streak updates
    ↓
Receive satisfying feedback
    ↓
Return tomorrow
```

Optional:

```text
Join Study Room
      ↓
See others studying
      ↓
Study together
      ↓
Finish session
      ↓
Room progress updates
```

---

# 49. QUALITY BAR

Do not create a prototype that merely demonstrates functionality.

Build the application so that it feels like a real product.

Prioritize:

1. Excellent study timer
2. Reliable streak tracking
3. Beautiful tree visualization
4. Offline reliability
5. Clean authentication
6. Smooth PWA experience
7. Useful study rooms
8. Thoughtful notifications
9. AI integration
10. Clean architecture

---

# 50. FINAL INSTRUCTION TO ANTIGRAVITY

**Before implementing anything, follow the design direction above and create the application architecture around the core experience.**

Do not arbitrarily change the product concept.

Do not replace the tree with another gamification mechanic.

Do not turn the product into a generic productivity dashboard.

The tree, study timer, streak and optional study rooms are the core product identity.

First inspect the existing project structure if one exists.

Then:

1. Establish the design system.
2. Establish the database schema.
3. Establish FastAPI architecture.
4. Establish React architecture.
5. Implement authentication.
6. Implement the study timer.
7. Implement streak calculation.
8. Implement tree growth.
9. Implement offline storage and synchronization.
10. Implement PWA functionality.
11. Implement notifications.
12. Implement study rooms.
13. Implement AI study companion.
14. Implement analytics.
15. Add polished animations and empty/error/offline states.
16. Test the complete user flow.

**Do not sacrifice UX for feature count.**

The final result should feel like a **premium, calm, gamified study companion where your study consistency physically grows a digital tree.**

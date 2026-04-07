# Product Spec: Task Management App

## Overview
A mobile-first task management application that helps individuals and small teams
organize daily work, track progress, and collaborate in real-time.

## Target Users
- Individual knowledge workers (25–45 years old)
- Small teams (2–10 people)
- Students managing projects

## Key UX Goals
- **Clarity**: Zero clutter, one primary action per screen
- **Speed**: Core tasks completable in ≤2 taps
- **Delight**: Subtle animations on task completion

---

## User Flows

### Flow 1: Onboarding
1. Splash screen (logo + tagline)
2. Sign Up / Log In selection
3. Profile setup (name, avatar, timezone)
4. Create first workspace (name, color)
5. Invite teammates (optional, skippable)
6. Home dashboard (empty state with CTA)

### Flow 2: Create Task
1. Home dashboard → Tap "+" FAB
2. Task creation sheet slides up
   - Title (required)
   - Description (optional, expandable)
   - Due date picker
   - Assignee selector (avatar list)
   - Priority toggle (Low / Medium / High)
3. Tap "Create" → task appears in list with animation
4. Confirmation toast: "Task created"

### Flow 3: View & Complete Task
1. Task list → Tap task card
2. Task detail screen
   - Header: title + priority badge
   - Meta: due date, assignee avatar, created by
   - Description body
   - Activity log (comments + history)
3. Tap checkmark → completion animation (confetti burst)
4. Task moves to "Completed" section

### Flow 4: Filter & Search
1. Home dashboard → Tap search icon
2. Search bar expands with keyboard
3. Real-time results filter by title/description
4. Filter chips: All | Today | Overdue | Mine

---

## Screen Inventory

| Screen ID | Name              | Type   | Priority |
|-----------|-------------------|--------|----------|
| S-01      | Splash            | Static | High     |
| S-02      | Onboarding        | Flow   | High     |
| S-03      | Login / Sign Up   | Auth   | High     |
| S-04      | Home Dashboard    | Core   | High     |
| S-05      | Task Creation     | Sheet  | High     |
| S-06      | Task Detail       | Core   | High     |
| S-07      | Search & Filter   | Core   | Medium   |
| S-08      | Profile & Settings| Config | Medium   |
| S-09      | Team / Workspace  | Config | Low      |

---

## Design Tokens

### Colors
- Primary: #5B5BD6 (Indigo)
- Primary Light: #E8E8FF
- Success: #30A46C
- Warning: #F76B15
- Danger: #E5484D
- Surface: #FFFFFF
- Background: #F9F9FB
- Text Primary: #1C2024
- Text Secondary: #60646C
- Border: #E8E8ED

### Typography
- Font: Inter
- H1: 28px / 700
- H2: 22px / 600
- Body: 16px / 400
- Caption: 12px / 400

### Spacing
- Base unit: 8px
- Card padding: 16px
- Section gap: 24px
- Screen margin: 20px

### Components
- Corner radius: 12px (cards), 8px (buttons), 100px (pills)
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- FAB size: 56px

---

## Interaction Notes
- Pull-to-refresh on task list
- Swipe left on task card → quick delete (with undo toast)
- Swipe right on task card → mark complete
- Long press on task → context menu (Edit, Duplicate, Delete)
- Haptic feedback on task complete

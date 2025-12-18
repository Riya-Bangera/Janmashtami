# Scoring and Winner Selection Workflow Documentation

## Overview
This document describes the complete workflow for scoring participants, selecting winners, and publishing results in the Sri Krishna Janmashtami Competitions Management System.

---

## Workflow Stages

### Stage 1: Scoring Phase (Judge Dashboard)

**Location**: Judge Dashboard → Scoring Tab

**Process**:
1. Judge selects a competition from their assigned competitions
2. Judge sees list of all participants registered for that competition
3. Judge clicks "Score" button for each participant
4. Judge enters scores for each rubric criterion
5. System calculates total score automatically
6. Judge submits score (can edit later)

**Features**:
- Judges can only score competitions assigned to them
- Scores can be updated/edited at any time
- Each judge scores independently
- System tracks which judges have scored which participants

---

### Stage 2: Score Validation (Judge Dashboard)

**Location**: Judge Dashboard → Results & Publishing Tab

**Validation Rules**:
- System checks if ALL assigned judges have scored ALL participants
- Displays scoring progress for each judge with progress bars
- Shows completion percentage for each judge
- Lists missing scores in detail (expandable)

**Status Indicators**:
- ✅ **Green Alert**: "Scoring Complete" - All judges have scored all participants
- ⚠️ **Orange Alert**: "Scoring Incomplete" - Shows count of missing scores

**Judges Scoring Progress Section**:
```
Judge Name    [████████░░] 8/10  80%
Judge Name    [██████████] 10/10 100%
```

---

### Stage 3: Winner Selection (Judge Dashboard)

**Location**: Judge Dashboard → Results & Publishing Tab → Select Winners Button

**Features**:
1. **Participants Ranking Table**:
   - Shows all participants sorted by average score (highest first)
   - Displays average score from all judges
   - Shows how many judges have scored each participant

2. **Winner Selection Dialog**:
   - Three dropdowns for 1st, 2nd, and 3rd place
   - Each dropdown shows participant name and their average score
   - Participants sorted by score (highest first)
   - Emoji indicators: 🥇 🥈 🥉

3. **Two Action Buttons**:
   - **"Save as Draft"**: Saves winners without publishing (always enabled)
   - **"Publish Results"**: Publishes winners to public (disabled until scoring complete)

**Validation**:
- Must select all three ranks (1st, 2nd, 3rd)
- Cannot publish until all judges have scored all participants
- Can save as draft even if scoring incomplete
- Warning shown if trying to publish with incomplete scoring

---

### Stage 4: Draft vs Published States

**Draft State** (Orange Badge):
- Winners are saved but not public
- Only visible to judges
- Can be edited at any time
- Not visible to hosts or public
- Allows judges to prepare results before final publication

**Published State** (Green Badge):
- Winners are public
- Visible to hosts in Host Dashboard
- Visible to public in Hall of Fame
- Can still be edited by judges (re-publish required)
- Timestamp recorded (publishedAt)

**Current Winners Display**:
Shows on Results tab when winners exist:
```
Current Winners [Published/Draft Badge]
🥇 1st Place: Participant Name
🥈 2nd Place: Participant Name
🥉 3rd Place: Participant Name
```

---

### Stage 5: Host Dashboard View

**Location**: Host Dashboard → Divine Ranks Tab

**Features**:
- Shows only published results
- Filtered by selected age category and competition
- Displays winners with celebration styling
- Host can announce winners to audience

**Display Format**:
```
🏆 DIVINE RANKS 🏆

🥇 1st Place
   Participant Name

🥈 2nd Place
   Participant Name

🥉 3rd Place
   Participant Name
```

---

### Stage 6: Public Hall of Fame

**Location**: Home Page → Hall of Fame Link → Hall of Fame Page

**Features**:
- Shows only published results
- Grouped by age category
- Each age category shows all competitions with published results
- Beautiful card-based layout with gradient backgrounds

**Display Structure**:
```
Hall of Fame
├── Krishna Kids (up to 5 years)
│   ├── Competition 1
│   │   ├── 🥇 1st Place: Name
│   │   ├── 🥈 2nd Place: Name
│   │   └── 🥉 3rd Place: Name
│   └── Competition 2
│       └── ...
├── Krishna Juniors (6 to 9 years)
│   └── ...
└── Krishna Teens (10 to 15 years)
    └── ...
```

**Visual Design**:
- Gold gradient for 1st place (yellow border)
- Silver gradient for 2nd place (gray border)
- Bronze gradient for 3rd place (orange border)
- Published badge on each competition
- Age group headers with icons

---

## Complete Workflow Example

### Scenario: "Colouring" Competition for Kids

**Step 1: Admin Setup**
- Admin creates "Colouring" competition
- Admin assigns 2 judges: Judge A and Judge B
- 5 participants register for the competition

**Step 2: Judges Score**
- Judge A logs in, scores all 5 participants
- Judge B logs in, scores 4 out of 5 participants
- System shows: "1 score(s) missing"

**Step 3: Attempt to Publish (Fails)**
- Judge A tries to publish results
- System shows orange alert: "Scoring Incomplete"
- Publish button is disabled
- Judge A can still save winners as draft

**Step 4: Complete Scoring**
- Judge B scores the remaining participant
- System shows green alert: "Scoring Complete"
- Publish button becomes enabled

**Step 5: Select and Save Winners**
- Judge A opens winner selection dialog
- Sees participants ranked by average score:
  1. Ravi - 95.5
  2. Priya - 92.0
  3. Amit - 88.5
  4. Neha - 85.0
  5. Kiran - 80.0
- Selects: 1st: Ravi, 2nd: Priya, 3rd: Amit
- Clicks "Save as Draft"
- Winners saved but not public yet

**Step 6: Review and Edit**
- Judge B reviews the winners
- Decides to change 3rd place to Neha instead of Amit
- Opens winner selection dialog
- Changes 3rd place selection
- Clicks "Save as Draft" again

**Step 7: Publish Results**
- Both judges agree on final winners
- Judge A clicks "Publish Results"
- System publishes results with timestamp
- Status changes to "Published" (green badge)

**Step 8: Host Announces**
- Host logs in to Host Dashboard
- Selects "Kids" age category
- Selects "Colouring" competition
- Sees Divine Ranks display
- Announces winners to audience

**Step 9: Public Viewing**
- Public visits Hall of Fame page
- Sees "Krishna Kids (up to 5 years)" section
- Sees "Colouring" competition card
- Sees winners: Ravi (1st), Priya (2nd), Neha (3rd)

---

## Technical Implementation

### Files Modified

**1. src/pages/judge/JudgeDashboard.tsx**
- Added `checkScoringComplete()` function
- Added `getAssignedJudges()` function
- Added `handleSaveWinners()` function
- Updated `handlePublishResults()` with validation
- Added scoring status alerts
- Added judges scoring progress bars
- Added current winners display
- Separated save and publish actions
- Added useEffect to load existing winners

**2. src/pages/HallOfFame.tsx**
- Added age group grouping logic
- Added `resultsByAgeGroup` object
- Added `ageGroupLabels` mapping
- Updated display to show age categories
- Added gradient backgrounds for winners
- Added published badge display

**3. src/components/ui/alert.tsx** (imported)
- Used for scoring status alerts

**4. src/components/ui/badge.tsx** (imported)
- Used for published/draft status badges

### Data Flow

```
Judge Scores
    ↓
Score Validation
    ↓
Winner Selection (Draft)
    ↓
[Editable]
    ↓
Publish Results
    ↓
├─→ Host Dashboard (Divine Ranks)
└─→ Public Hall of Fame
```

### Validation Logic

```typescript
checkScoringComplete() {
  // Get all judges assigned to competition
  const assignedJudges = getAssignedJudges();
  
  // Check each judge has scored each participant
  for (judge in assignedJudges) {
    for (participant in participants) {
      if (!hasScore(judge, participant)) {
        return { complete: false, message: "X scores missing" };
      }
    }
  }
  
  return { complete: true, message: "All judges scored" };
}
```

---

## User Interface Elements

### Judge Dashboard - Results Tab

**1. Scoring Status Alert**
- Green: All complete, can publish
- Orange: Incomplete, shows missing count
- Expandable details list

**2. Current Winners Display**
- Shows when winners exist
- Badge indicates Published/Draft status
- Lists all three winners

**3. Judges Scoring Progress**
- Progress bar for each judge
- Shows count: "8/10"
- Shows percentage: "80%"
- Green when 100%, primary color otherwise

**4. Participants Ranking Table**
- Rank number
- Participant name
- Average score (2 decimals)
- Judges scored count

**5. Select Winners Button**
- Text changes based on state:
  - "Select Winners" (no winners yet)
  - "Edit Winners" (winners exist and published)

### Winner Selection Dialog

**1. Warning Alert** (if scoring incomplete)
- Shows when scoring not complete
- Explains can save draft but not publish

**2. Winner Dropdowns**
- Three dropdowns with emoji labels
- Shows participant name + score
- Sorted by score (highest first)

**3. Action Buttons**
- "Save as Draft" (outline style, always enabled)
- "Publish Results" (primary style, disabled if incomplete)
- Helper text when publish disabled

### Hall of Fame Page

**1. Age Group Sections**
- Large heading with icon
- Age range in label

**2. Competition Cards**
- Competition name in header
- Published badge
- Three winner boxes with gradients

**3. Winner Boxes**
- Gold/Silver/Bronze gradients
- Large emoji (🥇🥈🥉)
- Rank badge
- Participant name

---

## Error Handling

### Validation Errors

**1. Missing Ranks**
```
Error: Please select all three ranks
```

**2. Incomplete Scoring**
```
Error: Cannot publish: All judges must score all participants first
```

### Success Messages

**1. Save Draft**
```
Success: Winners saved successfully! You can edit them anytime before publishing.
```

**2. Publish Results**
```
Success: Results published successfully! Winners are now visible to hosts and public.
```

---

## Best Practices

### For Judges

1. **Score Regularly**: Score participants as competitions complete
2. **Review Scores**: Check score matrix before selecting winners
3. **Save Drafts**: Use draft feature to prepare results
4. **Verify Completion**: Ensure all judges have scored before publishing
5. **Double Check**: Review winners before publishing

### For Admins

1. **Assign Multiple Judges**: Assign at least 2 judges per competition
2. **Monitor Progress**: Check scoring completion status
3. **Communicate**: Inform judges about scoring deadlines
4. **Backup**: Ensure at least one judge can access system

### For Hosts

1. **Check Published Status**: Only published results appear
2. **Verify Before Announcing**: Confirm results are correct
3. **Celebrate Winners**: Use Divine Ranks display for announcements

---

## Troubleshooting

### Issue: Publish button disabled

**Cause**: Not all judges have scored all participants

**Solution**:
1. Go to Results tab
2. Check "Judges Scoring Progress" section
3. Identify which judge hasn't completed scoring
4. Contact that judge to complete scoring
5. Once all progress bars show 100%, publish button enables

### Issue: Winners not showing in Hall of Fame

**Cause**: Results not published (still in draft)

**Solution**:
1. Judge must click "Publish Results" (not just "Save as Draft")
2. Verify green "Published" badge appears
3. Refresh Hall of Fame page

### Issue: Need to change published winners

**Solution**:
1. Judge can still edit published results
2. Open winner selection dialog
3. Change selections
4. Click "Publish Results" again
5. New winners will replace old ones

---

## Summary

The scoring and winner selection workflow ensures:
- ✅ All judges complete scoring before publication
- ✅ Winners can be prepared as drafts
- ✅ Winners are editable even after publishing
- ✅ Clear separation between draft and published states
- ✅ Transparent scoring progress tracking
- ✅ Beautiful public display grouped by age category
- ✅ Complete audit trail with timestamps

This workflow maintains data integrity while providing flexibility for judges to review and edit results before making them public.

# Two-Stage Winner Publication Workflow

## Summary

Implemented a two-stage approval process for publishing competition winners. Judges first publish results which become visible only to Hosts. Hosts then review and publish the results to make them visible in the Hall of Fame (public).

## Workflow

### Stage 1: Judge Publication
1. Judge scores participants and selects winners (Rank 1, 2, 3)
2. Judge clicks "Publish Results"
3. Results are marked as `published: true` and `publishedByHost: false`
4. Results become visible to **Hosts only**
5. Toast message: "Results published successfully! Winners are now visible to hosts for final approval."

### Stage 2: Host Publication
1. Host views the competition and clicks "Show Winners"
2. Host sees the Divine Ranks display with all three winners
3. Host clicks "Publish to Hall of Fame" button
4. Results are marked as `publishedByHost: true`
5. Results become visible in **Hall of Fame** (public)
6. Toast message: "Results published to Hall of Fame! Winners are now visible to the public."

## Changes Made

### 1. Type Definitions (`src/types/types.ts`)

**Added Fields to Result Interface:**
```typescript
export interface Result {
  id: string;
  competitionId: string;
  rank1: string;
  rank2: string;
  rank3: string;
  published: boolean;              // Judge published
  publishedAt?: string;
  publishedByHost: boolean;        // NEW: Host published
  publishedByHostAt?: string;      // NEW: Host publish timestamp
}
```

### 2. Database Migration (`supabase/migrations/00004_add_host_publication_fields.sql`)

**Added Columns to results Table:**
```sql
-- Add published_by_host column
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS published_by_host boolean DEFAULT false NOT NULL;

-- Add published_by_host_at column
ALTER TABLE results 
ADD COLUMN IF NOT EXISTS published_by_host_at timestamptz;

-- Update existing results to have published_by_host = false
UPDATE results 
SET published_by_host = false 
WHERE published_by_host IS NULL;
```

### 3. Database API (`src/db/api.ts`)

#### Updated getAllResults()
```typescript
return (data || []).map(row => ({
  id: row.id,
  competitionId: row.competition_id,
  rank1: row.rank1,
  rank2: row.rank2,
  rank3: row.rank3,
  published: row.published,
  publishedAt: row.published_at,
  publishedByHost: row.published_by_host || false,     // NEW
  publishedByHostAt: row.published_by_host_at          // NEW
}));
```

#### Updated createResult()
```typescript
.insert({
  competition_id: result.competitionId,
  rank1: result.rank1,
  rank2: result.rank2,
  rank3: result.rank3,
  published: result.published,
  published_at: result.publishedAt,
  published_by_host: result.publishedByHost,           // NEW
  published_by_host_at: result.publishedByHostAt       // NEW
})
```

#### Updated updateResult()
```typescript
if (updates.publishedByHost !== undefined) 
  updateData.published_by_host = updates.publishedByHost;        // NEW
if (updates.publishedByHostAt !== undefined) 
  updateData.published_by_host_at = updates.publishedByHostAt;   // NEW
```

### 4. Judge Dashboard (`src/pages/judge/JudgeDashboard.tsx`)

**Updated Publish Logic:**
```typescript
// When judge publishes results
if (existingResult) {
  updateResult(existingResult.id, {
    rank1: selectedRanks.rank1,
    rank2: selectedRanks.rank2,
    rank3: selectedRanks.rank3,
    published: true,
    publishedAt: new Date().toISOString(),
    publishedByHost: false                    // NEW: Not yet published by host
  });
} else {
  addResult({
    competitionId: selectedCompetition,
    rank1: selectedRanks.rank1,
    rank2: selectedRanks.rank2,
    rank3: selectedRanks.rank3,
    published: true,
    publishedAt: new Date().toISOString(),
    publishedByHost: false                    // NEW: Not yet published by host
  });
}

toast({
  title: 'Success',
  description: 'Results published successfully! Winners are now visible to hosts for final approval.'
});
```

**Updated Save Draft Logic:**
```typescript
addResult({
  competitionId: selectedCompetition,
  rank1: selectedRanks.rank1,
  rank2: selectedRanks.rank2,
  rank3: selectedRanks.rank3,
  published: false,
  publishedByHost: false                      // NEW
});
```

### 5. Host Dashboard (`src/pages/host/HostDashboard.tsx`)

**Added updateResult to Context:**
```typescript
const { currentUser, data, updateRegistration, getResultByCompetition, updateResult, logout } = useApp();
```

**Added Publish to Public Function:**
```typescript
const handlePublishToPublic = () => {
  if (!result) return;

  updateResult(result.id, {
    publishedByHost: true,
    publishedByHostAt: new Date().toISOString()
  });

  toast({
    title: 'Success',
    description: 'Results published to Hall of Fame! Winners are now visible to the public.'
  });
};
```

**Updated Winners Display:**
```typescript
<div className="text-center mt-8 space-y-4">
  {!result.publishedByHost && (
    <Button 
      onClick={handlePublishToPublic} 
      className="rounded-[3rem] w-full md:w-auto" 
      size="lg"
    >
      <i className="fas fa-globe mr-2" />
      Publish to Hall of Fame
    </Button>
  )}
  {result.publishedByHost && (
    <div className="p-4 bg-green-500/20 rounded-[3rem] border border-green-500/30">
      <i className="fas fa-check-circle text-green-600 mr-2" />
      <span className="text-green-700 font-semibold">Published to Hall of Fame</span>
    </div>
  )}
  <Button onClick={() => setShowWinners(false)} variant="outline" className="rounded-[3rem]" size="lg">
    <i className="fas fa-arrow-left mr-2" />
    Back to Queue
  </Button>
</div>
```

### 6. Hall of Fame (`src/pages/HallOfFame.tsx`)

**Updated Filter Logic:**
```typescript
// OLD: Get only published results
const publishedResults = data.results.filter(r => r.published);

// NEW: Get only results published by host (public)
const publishedResults = data.results.filter(r => r.published && r.publishedByHost);
```

**Added Dynamic Year Display:**
```typescript
// Get event year
const getEventYear = () => {
  if (data.settings.eventDate) {
    return new Date(data.settings.eventDate).getFullYear();
  }
  if (data.settings.eventYear) {
    return data.settings.eventYear;
  }
  return new Date().getFullYear();
};

const eventYear = getEventYear();

// Updated footer
<p>{eventYear} Sri Krishna Janmashtami Competitions</p>
```

## User Flow Diagrams

### Complete Publication Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    JUDGE WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
              Judge scores participants
                           ↓
              Judge selects Rank 1, 2, 3
                           ↓
              Judge clicks "Publish Results"
                           ↓
         ┌──────────────────────────────────────┐
         │  Result Status:                      │
         │  • published = true                  │
         │  • publishedByHost = false           │
         └──────────────────────────────────────┘
                           ↓
         Toast: "Winners visible to hosts for approval"
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    HOST WORKFLOW                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
              Host selects competition
                           ↓
              Host clicks "Show Winners"
                           ↓
              Host reviews Divine Ranks
                           ↓
              Host clicks "Publish to Hall of Fame"
                           ↓
         ┌──────────────────────────────────────┐
         │  Result Status:                      │
         │  • published = true                  │
         │  • publishedByHost = true            │
         └──────────────────────────────────────┘
                           ↓
         Toast: "Winners visible to public"
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC VIEW                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
              Results appear in Hall of Fame
                           ↓
              Public can view winners
```

### State Transitions

```
Initial State:
┌──────────────────────────────────┐
│ No Result                        │
│ • published = N/A                │
│ • publishedByHost = N/A          │
└──────────────────────────────────┘

         ↓ Judge saves draft

Draft State:
┌──────────────────────────────────┐
│ Draft Result                     │
│ • published = false              │
│ • publishedByHost = false        │
│ Visible to: Judge only           │
└──────────────────────────────────┘

         ↓ Judge publishes

Judge Published State:
┌──────────────────────────────────┐
│ Judge Published                  │
│ • published = true               │
│ • publishedByHost = false        │
│ Visible to: Judge, Host          │
└──────────────────────────────────┘

         ↓ Host publishes

Host Published State:
┌──────────────────────────────────┐
│ Fully Published                  │
│ • published = true               │
│ • publishedByHost = true         │
│ Visible to: Judge, Host, Public  │
└──────────────────────────────────┘
```

## Visibility Matrix

| Result State | Judge | Host | Public (Hall of Fame) |
|-------------|-------|------|----------------------|
| Draft (published=false, publishedByHost=false) | ✅ | ❌ | ❌ |
| Judge Published (published=true, publishedByHost=false) | ✅ | ✅ | ❌ |
| Host Published (published=true, publishedByHost=true) | ✅ | ✅ | ✅ |

## UI Changes

### Judge Dashboard
**Before:**
```
Toast: "Results published successfully! Winners are now visible to hosts and public."
```

**After:**
```
Toast: "Results published successfully! Winners are now visible to hosts for final approval."
```

### Host Dashboard
**Before:**
```
[Divine Ranks Display]
[Back to Queue Button]
```

**After:**
```
[Divine Ranks Display]

[Publish to Hall of Fame Button]  ← NEW (if not published)
OR
[✓ Published to Hall of Fame]     ← NEW (if published)

[Back to Queue Button]
```

### Hall of Fame
**Before:**
```typescript
// Shows all results where published = true
const publishedResults = data.results.filter(r => r.published);
```

**After:**
```typescript
// Shows only results where published = true AND publishedByHost = true
const publishedResults = data.results.filter(r => r.published && r.publishedByHost);
```

## Benefits

1. **Quality Control**: Host can review results before public announcement
2. **Error Prevention**: Allows correction of mistakes before public visibility
3. **Controlled Announcement**: Host controls timing of public announcement
4. **Audit Trail**: Separate timestamps for judge and host publication
5. **Flexibility**: Host can review multiple competitions before publishing
6. **Professional**: Ensures polished, verified results reach the public

## Testing Scenarios

### Test 1: Judge Publishes, Host Not Yet Published
1. Login as Judge
2. Score participants and select winners
3. Click "Publish Results"
4. **Expected**: Toast shows "visible to hosts for approval"
5. Navigate to Hall of Fame
6. **Expected**: Results NOT visible
7. Login as Host
8. Select competition and click "Show Winners"
9. **Expected**: Winners ARE visible with "Publish to Hall of Fame" button

### Test 2: Host Publishes to Public
1. Login as Host
2. Select competition with judge-published results
3. Click "Show Winners"
4. Click "Publish to Hall of Fame"
5. **Expected**: Toast shows "visible to the public"
6. **Expected**: Button changes to green "Published to Hall of Fame" indicator
7. Logout and navigate to Hall of Fame
8. **Expected**: Results ARE visible to public

### Test 3: Multiple Competitions
1. Judge publishes results for Competition A
2. Judge publishes results for Competition B
3. Host publishes Competition A only
4. Navigate to Hall of Fame
5. **Expected**: Only Competition A results visible
6. **Expected**: Competition B results NOT visible

## Database Schema

### results Table Structure

| Column | Type | Default | Nullable | Description |
|--------|------|---------|----------|-------------|
| id | uuid | gen_random_uuid() | NO | Primary key |
| competition_id | uuid | - | NO | Foreign key to competitions |
| rank1 | text | - | NO | Registration ID of 1st place |
| rank2 | text | - | NO | Registration ID of 2nd place |
| rank3 | text | - | NO | Registration ID of 3rd place |
| published | boolean | false | NO | Judge published flag |
| published_at | timestamptz | - | YES | Judge publish timestamp |
| published_by_host | boolean | false | NO | **NEW**: Host published flag |
| published_by_host_at | timestamptz | - | YES | **NEW**: Host publish timestamp |
| created_at | timestamptz | now() | NO | Record creation time |

## Verification

✅ All TypeScript files pass linting (89 files checked)
✅ No compilation errors
✅ Database migration applied successfully
✅ Two-stage publication workflow implemented
✅ Judge can publish to host
✅ Host can publish to public
✅ Hall of Fame filters by host publication
✅ Toast messages updated
✅ UI indicators added
✅ Dynamic year display added to Hall of Fame

## Related Files

- **Modified**: `src/types/types.ts` - Added publishedByHost fields
- **Modified**: `src/db/api.ts` - Updated CRUD operations
- **Modified**: `src/pages/judge/JudgeDashboard.tsx` - Updated publish logic
- **Modified**: `src/pages/host/HostDashboard.tsx` - Added publish to public feature
- **Modified**: `src/pages/HallOfFame.tsx` - Updated filter and added dynamic year
- **Created**: `supabase/migrations/00004_add_host_publication_fields.sql` - Database migration

## Future Enhancements (Optional)

1. **Bulk Publishing**: Allow host to publish multiple competitions at once
2. **Unpublish Feature**: Allow host to unpublish results if needed
3. **Notification System**: Notify host when judge publishes results
4. **Approval Comments**: Allow host to add comments when publishing
5. **Publication History**: Track all publication state changes
6. **Scheduled Publishing**: Allow host to schedule publication time

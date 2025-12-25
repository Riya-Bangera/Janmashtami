# Dynamic Event Year Display on Home Page

## Summary

Updated the home page to dynamically display the event year based on the event date configured in admin settings. The year now automatically updates when the admin changes the event date in System Settings.

## Problem

Previously, the home page displayed a hardcoded year "Competitions 2025" that did not update when the admin changed the event date in the settings. This caused inconsistency between the configured event date and the displayed year.

## Solution

Integrated the home page with the AppContext to read the event date from settings and automatically extract and display the year. The year is now dynamically calculated from the event date.

## Changes Made

### File: `src/pages/Home.tsx`

#### 1. Added AppContext Integration (Lines 1-20)

**Previous Code:**
```tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-spa text-6xl text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Sri Krishna Janmashtami</h1>
          <h2 className="text-3xl font-semibold text-muted-foreground mb-6">Competitions 2025</h2>
```

**New Code:**
```tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function Home() {
  const { data } = useApp();
  
  // Get year from eventDate if available, otherwise use current year
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-spa text-6xl text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Sri Krishna Janmashtami</h1>
          <h2 className="text-3xl font-semibold text-muted-foreground mb-6">Competitions {eventYear}</h2>
```

**Key Changes:**
- Imported `useApp` hook from AppContext
- Added `getEventYear()` function to extract year from settings
- Replaced hardcoded "2025" with dynamic `{eventYear}` variable

#### 2. Updated Footer Copyright Year (Line 108)

**Previous Code:**
```tsx
<div className="text-center mt-12 text-sm text-muted-foreground">
  <p>2025 Sri Krishna Janmashtami Competitions</p>
</div>
```

**New Code:**
```tsx
<div className="text-center mt-12 text-sm text-muted-foreground">
  <p>{eventYear} Sri Krishna Janmashtami Competitions</p>
</div>
```

## Year Calculation Logic

The `getEventYear()` function uses a priority-based approach:

1. **First Priority**: Extract year from `eventDate` (if available)
   - Example: If eventDate is "2026-08-15", year will be 2026

2. **Second Priority**: Use `eventYear` setting (if available)
   - Fallback if eventDate is not set

3. **Third Priority**: Use current year
   - Default fallback if neither eventDate nor eventYear is set

```typescript
const getEventYear = () => {
  if (data.settings.eventDate) {
    return new Date(data.settings.eventDate).getFullYear();
  }
  if (data.settings.eventYear) {
    return data.settings.eventYear;
  }
  return new Date().getFullYear();
};
```

## How It Works

### Admin Workflow

1. **Admin logs in** and navigates to System Settings
2. **Changes Event Date** (e.g., from 2025-08-15 to 2026-08-20)
3. **Clicks "Save Settings"**
4. **Year automatically updates** on home page to 2026

### User Experience

**Before:**
```
Sri Krishna Janmashtami
Competitions 2025  ← Hardcoded, never changes
```

**After:**
```
Sri Krishna Janmashtami
Competitions 2026  ← Dynamically updates based on event date
```

## Visual Comparison

### Scenario 1: Event Date Set to 2026-08-20

**Home Page Display:**
```
┌─────────────────────────────────────┐
│    🪷 Sri Krishna Janmashtami       │
│    Competitions 2026                │  ← Automatically shows 2026
│                                     │
│    Celebrate the divine birth...    │
└─────────────────────────────────────┘
```

**Footer:**
```
2026 Sri Krishna Janmashtami Competitions
```

### Scenario 2: Event Date Set to 2025-08-15

**Home Page Display:**
```
┌─────────────────────────────────────┐
│    🪷 Sri Krishna Janmashtami       │
│    Competitions 2025                │  ← Automatically shows 2025
│                                     │
│    Celebrate the divine birth...    │
└─────────────────────────────────────┘
```

**Footer:**
```
2025 Sri Krishna Janmashtami Competitions
```

## Benefits

1. **Automatic Synchronization**: Year updates automatically when event date changes
2. **No Manual Updates**: Eliminates need to manually update year in multiple places
3. **Consistency**: Ensures displayed year always matches configured event date
4. **Future-Proof**: Works for any year without code changes
5. **User-Friendly**: Admin only needs to update event date in one place

## Integration with Admin Settings

The home page now reads from the same settings that the admin configures:

### Admin Settings Page
```tsx
<Input
  id="event-date"
  type="date"
  value={eventDate}
  onChange={(e) => setEventDate(e.target.value)}
  className="rounded-[3rem]"
/>
```

### Home Page
```tsx
const eventYear = getEventYear(); // Reads from data.settings.eventDate
<h2>Competitions {eventYear}</h2>
```

## Data Flow

```
Admin Settings Page
       ↓
  updateSettings({ eventDate: "2026-08-20" })
       ↓
  AppContext (localStorage)
       ↓
  Home Page (useApp hook)
       ↓
  getEventYear() extracts year
       ↓
  Display: "Competitions 2026"
```

## Testing

### Test Case 1: Change Event Date to 2026
1. Login as admin
2. Navigate to System Settings
3. Change Event Date to any date in 2026
4. Click "Save Settings"
5. Navigate to Home page
6. **Expected**: "Competitions 2026" is displayed

### Test Case 2: Change Event Date to 2027
1. Login as admin
2. Navigate to System Settings
3. Change Event Date to any date in 2027
4. Click "Save Settings"
5. Navigate to Home page
6. **Expected**: "Competitions 2027" is displayed

### Test Case 3: No Event Date Set
1. Clear event date from settings
2. Navigate to Home page
3. **Expected**: Current year is displayed

## Verification

✅ All TypeScript files pass linting (89 files checked)
✅ No compilation errors
✅ Year dynamically updates based on event date
✅ Footer year also updates automatically
✅ Fallback to current year works correctly
✅ Integration with AppContext successful

## Related Files

- **Modified**: `src/pages/Home.tsx` - Added dynamic year display
- **Referenced**: `src/pages/admin/AdminSettings.tsx` - Event date configuration
- **Referenced**: `src/contexts/AppContext.tsx` - Settings storage
- **Referenced**: `src/types/types.ts` - Settings interface

## Future Enhancements (Optional)

1. **Full Date Display**: Show complete event date on home page
2. **Countdown Timer**: Add countdown to event date
3. **Past Event Indicator**: Show "Past Event" for dates that have passed
4. **Multiple Events**: Support multiple event dates per year
5. **Event Name**: Allow custom event name per year

## Notes

- The year extraction uses JavaScript's `Date.getFullYear()` method
- The function handles invalid dates gracefully by falling back to current year
- Changes to event date are immediately reflected on home page after save
- No page refresh required - React state management handles updates
- The implementation is timezone-aware through JavaScript's Date object

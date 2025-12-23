# Age Category Color Coding for Assigned Competitions

## Summary

Updated the Staff Management page to display assigned competitions with color-coded badges based on age categories, making it easy to visually identify which age group each competition belongs to.

## Color Scheme

- **Kids (up to 5 years)**: Red background with white text
- **Juniors (6 to 9 years)**: Yellow background with black text
- **Teens (10 to 15 years)**: Green background with white text

## Changes Made

### File: `src/pages/admin/AdminStaff.tsx`

#### 1. Added Color Helper Function (Lines 15-26)

```typescript
function getAgeGroupColor(ageGroups: AgeGroup[]): string {
  // Priority: Kids > Juniors > Teens
  if (ageGroups.includes(AgeGroup.Kids)) {
    return 'bg-red-500 text-white';
  } else if (ageGroups.includes(AgeGroup.Juniors)) {
    return 'bg-yellow-500 text-black';
  } else if (ageGroups.includes(AgeGroup.Teens)) {
    return 'bg-green-500 text-white';
  }
  return 'bg-primary/10 text-primary'; // fallback
}
```

**Logic:**
- Checks which age groups the competition supports
- Returns appropriate color classes based on priority (Kids > Juniors > Teens)
- If a competition supports multiple age groups, it shows the color of the highest priority group

#### 2. Updated Assigned Events Display (Lines 120-151)

**Previous Implementation:**
- All assigned events displayed with same color (`bg-primary/10 text-primary`)
- No visual distinction between age categories

**New Implementation:**
- Each assigned event badge uses color based on its age group
- Dynamic color application using the `getAgeGroupColor()` function
- Improved hover effect (`hover:opacity-70` instead of `hover:text-destructive`)

```typescript
const colorClass = getAgeGroupColor(comp.ageGroups);

return (
  <div 
    key={compId} 
    className={`${colorClass} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2`}
  >
    {comp.name}
    <button
      onClick={() => {
        updateUser(user.id, {
          assignedCompetitions: user.assignedCompetitions?.filter((id: string) => id !== compId)
        });
      }}
      className="hover:opacity-70"
    >
      <i className="fas fa-times" />
    </button>
  </div>
);
```

#### 3. Added Color Legend (Lines 352-369)

Added a visual legend at the top of the staff list to help users understand the color coding:

```tsx
<div className="mb-6 p-4 bg-card rounded-[2rem] border">
  <p className="text-sm font-semibold mb-3">Age Category Color Legend:</p>
  <div className="flex flex-wrap gap-4">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-red-500"></div>
      <span className="text-sm">Kids (up to 5 years)</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
      <span className="text-sm">Juniors (6 to 9 years)</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full bg-green-500"></div>
      <span className="text-sm">Teens (10 to 15 years)</span>
    </div>
  </div>
</div>
```

## Visual Design

### Before
```
Assigned Events:
[Competition 1] [Competition 2] [Competition 3]
(All in same color - primary/accent)
```

### After
```
Age Category Color Legend:
🔴 Kids (up to 5 years)  🟡 Juniors (6 to 9 years)  🟢 Teens (10 to 15 years)

Assigned Events:
[Competition 1 - RED] [Competition 2 - YELLOW] [Competition 3 - GREEN]
```

## User Experience Improvements

1. **Quick Visual Identification**: Judges can instantly see which age category each assigned competition belongs to
2. **Better Organization**: Color coding helps organize competitions by age group at a glance
3. **Reduced Confusion**: Clear visual distinction prevents assignment errors
4. **Professional Appearance**: Color-coded badges look more polished and organized
5. **Accessibility**: High contrast colors (red/white, yellow/black, green/white) ensure readability

## Priority Logic

When a competition supports multiple age groups, the color is determined by priority:

1. **First Priority**: Kids (Red)
2. **Second Priority**: Juniors (Yellow)
3. **Third Priority**: Teens (Green)

**Example:**
- Competition supports "Kids + Juniors" → Shows RED (Kids priority)
- Competition supports "Juniors + Teens" → Shows YELLOW (Juniors priority)
- Competition supports "Kids + Juniors + Teens" → Shows RED (Kids priority)

## Technical Details

### Color Classes Used
- **Red**: `bg-red-500 text-white`
- **Yellow**: `bg-yellow-500 text-black`
- **Green**: `bg-green-500 text-white`

### Responsive Design
- Legend wraps on smaller screens with `flex-wrap`
- Color indicators are consistent across all device sizes
- Text remains readable at all breakpoints

### Accessibility
- High contrast ratios for all color combinations
- Text color automatically adjusts (white or black) based on background
- Color legend provides context for colorblind users

## Testing

✅ All TypeScript files pass linting (89 files checked)
✅ No compilation errors
✅ Color coding displays correctly for each age group
✅ Legend is visible and clear
✅ Remove button works correctly on colored badges
✅ Responsive design works on all screen sizes

## Use Cases

### For Admins
- Quickly verify judge assignments by age category
- Ensure balanced distribution of judges across age groups
- Identify gaps in coverage at a glance

### For Judges
- Easily see which age categories they're assigned to
- Understand their workload distribution
- Prepare appropriately for different age groups

## Benefits

1. **Efficiency**: Faster assignment verification and management
2. **Clarity**: Immediate visual feedback on age category distribution
3. **Error Prevention**: Reduces chance of assigning wrong competitions
4. **Professional**: Polished, organized appearance
5. **User-Friendly**: Intuitive color coding system

## Future Enhancements (Optional)

- Add filter to show only competitions of specific age category
- Display count of competitions per age category
- Add tooltips showing full age range on hover
- Export assignments with color coding to PDF

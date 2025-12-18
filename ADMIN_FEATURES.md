# Admin Dashboard - Complete Feature Guide

The Admin Dashboard serves as the command center for the entire Sri Krishna Janmashtami event. This document provides a detailed breakdown of all features implemented.

---

## 🎯 Dashboard Overview (Real-time Statistics)

The overview tab provides a high-level summary of the event's progress at a glance:

### Statistics Cards

1. **Total Participants**
   - Tracks the total number of children registered across all categories
   - Real-time count updates as new registrations are added
   - Icon: Users icon

2. **Total Revenue**
   - Calculates gross income based on registration fees collected
   - Includes base fees and additional event fees
   - Displays in Indian Rupees (₹)
   - Icon: Rupee sign

3. **Confirmed Registrations**
   - Shows count of confirmed participant registrations
   - Helps track registration completion rate
   - Icon: Check circle

4. **System Status** ⭐ NEW
   - Displays whether the public registration portal is "Open" or "Closed"
   - Visual indicator with color coding:
     - Green/Muted background when Open
     - Red/Destructive background when Closed
   - Dynamic icon changes based on status:
     - Door Open icon when registration is active
     - Door Closed icon when registration is inactive
   - Allows immediate status verification at a glance

### Quick Navigation Cards
- Direct links to Registration Management
- Direct links to Staff Management
- Hover effects for better user experience

---

## 📋 Registration Management

This is the most functional part of the dashboard, offering comprehensive participant management capabilities.

### Master Registration List

**Features:**
- Complete, scrollable ledger of every registration in the system
- Displays comprehensive participant information:
  - Registration ID (unique identifier)
  - Participant Name
  - Age
  - Age Category (Kids/Juniors/Teens) with badge styling
  - Selected Competitions
  - Total Fee
  - Payment Method (Online/Cash) with color-coded badges
  - Registration Status with visual indicators

### Advanced Filtering System

**Category Filter:**
Allows administrators to drill down into specific data with two-level filtering:

1. **Age Group Filter**
   - Filter by: All, Kids, Juniors, Teens
   - Instantly narrows down the participant list
   - Helps organize participants by category

2. **Competition Filter**
   - Filter by specific competition
   - Shows only participants registered for selected event
   - Useful for event-specific participant lists

**Combined Filtering:**
- Both filters work together
- Example: View only "Kids" participating in "Fancy Dress"
- Real-time list updates as filters are applied

### Payment Verification ⭐ NEW

**View Proof Feature:**
- "View Proof" button appears for all online payments
- Click to open a modal dialog with the payment screenshot
- Large, clear image display for easy verification
- Features:
  - High-resolution image viewing
  - Zoom-friendly display (up to 70% viewport height)
  - Clean modal interface
  - Easy close functionality
- Helps verify bank transfers and UPI payments
- Ensures payment authenticity before event day

**Payment Method Indicators:**
- Online payments: Blue badge with "View Proof" button
- Cash payments: Gray badge, no proof button (not applicable)

### On-Spot Registration

**Purpose:**
Dedicated form for walk-in participants who register at the venue.

**Features:**
- Simplified registration process for organizers
- No file upload required (unlike public form)
- Instant fee calculation based on selected events
- Payment method selection:
  - Cash (for in-person payments)
  - Online (for immediate UPI transfers)

**Form Fields:**
1. Participant Name
2. Date of Birth (with date picker)
3. Competition Selection (multi-select checkboxes)
4. Payment Method (dropdown)
5. Automatic calculations:
   - Age calculation
   - Age group assignment
   - Total fee calculation

**Workflow:**
1. Admin enters participant details
2. Selects competitions
3. Chooses payment method
4. System automatically:
   - Calculates age and assigns category
   - Calculates total fee
   - Generates unique registration ID
   - Sets status to "Confirmed"
5. Registration is immediately added to the master list

---

## 🏆 Competition Management

Define the "Rules of Engagement" for the festival.

### Competition Configuration

**Add New Competition:**
- Competition name
- Scheduled time
- Base fee (for first competition)
- Additional fee (for subsequent competitions)
- Age group eligibility (multi-select)

### Scoring Rubrics System

**Purpose:**
Define specific criteria for judges to score participants.

**Features:**
- Add multiple rubrics per competition
- Each rubric includes:
  - Criterion name (e.g., "Creativity", "Confidence")
  - Maximum score allowed
- Rubrics appear as input fields for judges during scoring
- Ensures consistent and fair judging

**Examples:**
- **Fancy Dress Competition:**
  - Creativity (Max: 10)
  - Confidence (Max: 10)
  - Costume Quality (Max: 10)

- **Sloka Recitation:**
  - Pronunciation (Max: 15)
  - Memory (Max: 10)
  - Expression (Max: 5)

### Competition Management Actions
- View all configured competitions
- Delete competitions (with confirmation)
- Real-time updates to judge and host portals

---

## 👥 Staff Management (Users)

Manages accounts for everyone working behind the scenes.

### Staff Roles

1. **Judges**
   - Score participants
   - Publish results
   - View only assigned competitions

2. **Hosts**
   - Manage stage queue
   - Call participants
   - Display winner announcements

3. **Admins**
   - Full system access
   - Manage all aspects of the event

### Add New Staff

**Form Fields:**
- Username (unique identifier)
- Password (secure access)
- Role selection (Judge/Host/Admin)
- Competition assignment (for Judges only)

**Judge-Event Mapping:**
- Assign specific competitions to specific judges
- Multi-select competition assignment
- Judges only see participants for assigned events
- Prevents confusion and data entry errors

### Edit Staff

**Capabilities:**
- Update username
- Change password
- Modify role
- Reassign competitions (for judges)
- Real-time updates

### Delete Staff
- Remove staff accounts
- Confirmation dialog prevents accidental deletion
- Immediate effect on access

### Staff List Display
- Table view of all staff members
- Shows: Username, Role, Assigned Competitions
- Edit and Delete actions for each staff member

---

## ⚙️ System Settings

Controls the "Front-Door" and financial aspects of the application.

### Registration Toggle

**Master Switch:**
- Open/Close public registration portal
- Visual toggle switch
- Immediate effect on public-facing pages

**When Open:**
- Public users can access registration form
- "Start Registration" button is active on home page
- Payment QR codes are displayed

**When Closed:**
- Public users see "Registration Closed" message
- Registration form is inaccessible
- Prevents new registrations after capacity is reached

### UPI ID Configuration

**Purpose:**
Configure the official UPI ID for payment collection.

**Features:**
- Text input for UPI ID
- Real-time QR code preview
- Dynamic QR code generation
- Instant updates across the system

**QR Code Preview:**
- Shows exactly what participants will see
- Sample amount (₹100) for preview
- Large, scannable display
- Helps verify UPI ID before going live

**Impact:**
- Updates payment QR codes on public registration page
- Ensures funds are sent to correct account
- Critical for financial accuracy

### Save Settings
- Single button to save all settings
- Toast notification confirms successful save
- Immediate effect across all user portals

---

## 🔐 Security Features

### Role-Based Access Control
- Admin-only access to dashboard
- Automatic redirect if not authenticated
- Session management via context

### Data Validation
- Form validation on all inputs
- Age calculation verification
- Fee calculation accuracy
- Registration ID uniqueness

### Payment Verification
- Screenshot upload for online payments
- Admin review capability
- Prevents fraudulent registrations

---

## 📊 Data Management

### localStorage Integration
- All data persists in browser localStorage
- Key: `iskcon_v23_db`
- Real-time updates across all components
- No backend required

### Data Structure
```javascript
{
  users: [],           // Staff accounts
  competitions: [],    // Event configurations
  registrations: [],   // Participant data
  scores: [],         // Judge scores
  results: [],        // Published winners
  settings: {         // System configuration
    registrationOpen: boolean,
    upiId: string
  }
}
```

---

## 🎨 User Interface Features

### Design System
- Cream background (#fdfaf6)
- Saffron accents (#ffe4bc)
- Pure black text (#000000)
- Rounded corners (3rem)
- FontAwesome icons
- Lotus symbol (fa-spa) as brand icon

### Responsive Design
- Desktop-optimized layout
- Mobile-friendly tables
- Scrollable content areas
- Touch-friendly buttons

### Visual Feedback
- Toast notifications for actions
- Loading states
- Hover effects
- Color-coded badges
- Status indicators

---

## 🚀 Workflow Examples

### Complete Event Setup Workflow

1. **Initial Login**
   - Username: `Riya A`
   - Password: `Radha@108`

2. **Configure Competitions**
   - Add all competition events
   - Set times and fees
   - Define scoring rubrics
   - Assign age groups

3. **Add Staff**
   - Create judge accounts
   - Assign competitions to judges
   - Create host accounts
   - Share credentials with staff

4. **Configure Payment**
   - Enter UPI ID in Settings
   - Verify QR code preview
   - Save settings

5. **Open Registration**
   - Toggle registration to "Open"
   - Monitor incoming registrations
   - Verify payment proofs

6. **Event Day Management**
   - Add on-spot registrations
   - Monitor participant counts
   - Track revenue
   - Coordinate with judges and hosts

7. **Post-Event**
   - Review all registrations
   - Verify payment completion
   - Close registration
   - Generate reports (if needed)

### Payment Verification Workflow

1. **View Registrations**
   - Navigate to Registration Management
   - Filter by online payments (if needed)

2. **Check Payment Proof**
   - Locate registration in table
   - Click "View Proof" button
   - Review payment screenshot in modal

3. **Verify Details**
   - Check transaction ID
   - Verify amount matches fee
   - Confirm UPI ID matches
   - Check timestamp

4. **Take Action**
   - If valid: No action needed (already confirmed)
   - If invalid: Contact participant for clarification
   - If missing: Request payment proof

---

## 💡 Tips and Best Practices

### For Administrators

**Before Opening Registration:**
- ✅ Configure all competitions
- ✅ Add all judges and hosts
- ✅ Test UPI QR code
- ✅ Verify fee calculations
- ✅ Review age group assignments

**During Registration Period:**
- 📊 Monitor registrations daily
- 💰 Verify payment proofs regularly
- 📞 Respond to participant queries
- 🔄 Update competition details if needed

**On Event Day:**
- 🚪 Close online registration
- 📝 Focus on on-spot registrations
- 👥 Coordinate with staff
- 📊 Monitor real-time statistics

**Post-Event:**
- ✅ Verify all payments received
- 📊 Generate final reports
- 💾 Backup data (export localStorage)
- 🎉 Review for next year's improvements

---

## 🆘 Troubleshooting

### Common Issues

**Registration Not Showing:**
- Check filters (reset to "All")
- Verify data is saved in localStorage
- Refresh the page

**Payment Proof Not Visible:**
- Ensure registration used "Online" payment method
- Check if screenshot was uploaded during registration
- Verify browser supports image display

**Staff Cannot Login:**
- Verify credentials are correct
- Check role assignment
- Ensure account was saved

**QR Code Not Updating:**
- Save settings after changing UPI ID
- Refresh the page
- Clear browser cache if needed

---

## 📈 Future Enhancements (Potential)

- Export registration data to CSV/Excel
- Print participant lists by competition
- SMS notifications to participants
- Email confirmations
- Attendance tracking
- Certificate generation
- Photo gallery integration
- Feedback collection

---

**May Lord Krishna bless your event with success! 🙏**

*This system is designed to make your Janmashtami competition management smooth, efficient, and joyful.*

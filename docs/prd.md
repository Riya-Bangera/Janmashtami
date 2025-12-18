# Sri Krishna Janmashtami Competitions Management System Requirements Document
\n## 1. Application Overview\n
### 1.1 Application Name
Sri Krishna Janmashtami Competitions Management System\n
### 1.2 Application Description
A comprehensive web-based competition management platform for organizing and managing Sri Krishna Janmashtami festival competitions. The system supports multi-role access (Public Users, Admins, Judges, Hosts) with complete registration, scoring, and result management capabilities.

## 2. Technical Architecture

### 2.1 Technology Stack
- **Frontend Framework**: React v19 with TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **State Management**: React Context API (AppProvider)
- **Data Persistence**: localStorage (key: iskcon_v23_db)
- **Routing**: react-router-dom with HashRouter\n- **Icons**: FontAwesome 6.4.0 (primary brand mark: fa-spa Lotus symbol)

### 2.2 Data Storage
- All data persists in browser localStorage
- Key data entities: users, registrations, scores, results, settings

## 3. Design Specifications

### 3.1 Visual Design
- **Color Scheme**:
  - Background: Cream/Off-white (#fdfaf6)
  - Primary Accent: Pastel Saffron (#ffe4bc)
  - Secondary Accents: Soft Blue (#e0f2fe), Light Green (#f0fdf4)
  - Text Color: Pure Dark Black (#000000) for maximum contrast
- **Visual Elements**:
  - Rounded corners: rounded-[3rem]
  - Icon-based UI with FontAwesome Lotus symbol
  - No external images
  - Whitespace-driven layout
\n## 4. Core Functionality

### 4.1 Public User (Participant) Features
\n#### 4.1.1 Home Page
- Access to Registration portal
- View 'Hall of Fame' (Winners list)

#### 4.1.2 Multi-Step Registration Process
**Step 1 - Profile Information**:
- Input: Name, Date of Birth
- Auto-calculation: Age and AgeGroup assignment (Kids/Juniors/Teens)

**Step 2 - Event Selection**:
- Dynamic competition filtering based on calculated AgeGroup
- Multi-event selection with fee calculation\n
**Step 3 - Payment**:
- Display UPI ID and dynamically generated QR Code
- Upload payment screenshot\n
#### 4.1.3 Registration Confirmation
- Generate unique Registration ID
- Display registration QR code
- Download Receipt button (triggers window.print() with optimized CSS)
\n### 4.2 Admin Dashboard Features

The Admin Dashboard serves as the command center for the entire Janmashtami event, providing comprehensive control and monitoring capabilities.\n
#### 4.2.1 Overview (Real-time Statistics)
Provides a high-level summary of the event's progress at a glance:\n- **Participant Count**: Tracks the total number of children registered across all categories\n- **Total Revenue**: Calculates the gross income based on registration fees collected (including base fees and additional event discounts)
- **System Status**: Displays whether the public registration portal is currently 'Open' or 'Closed' for immediate status verification

#### 4.2.2 Registrations (Participant Management)
The most functional part of the dashboard, offering three distinct viewing and entry modes:

**Category Filter**:
- Drill down into specific data by Age Group (e.g., Krishna Kids)
- Further filter by Specific Competition (e.g., Fancy Dress)
- View exactly who is participating in what event

**Master Card**:
- Complete, scrollable ledger of every registration in the system
- Display participant's name, contact details, selected events, and payment status
\n**On-Spot Entry**:
- Dedicated form for walk-in participants\n- Simplified process for organizers\n- Record 'Cash' or 'Online' payments immediately without requiring file upload
- Automatic fee calculation based on event count

**Payment Verification**:
- 'View Proof' button to inspect payment screenshots uploaded by public users
- Verify bank transfers\n
#### 4.2.3 Competitions (Event Configuration)
Define the 'Rules of Engagement' for the festival:
\n**Dynamic Creation**:
- Add new competitions on the fly\n- Specify name, eligible age group, and scheduled time

**Rubric Management**:
- Define Scoring Criteria (Rubrics) for every competition
- Example: 'Fancy Dress' might have rubrics like Creativity, Confidence, and Costume
- Example: 'Sloka' might have Pronunciation and Memory
- These rubrics appear as input fields for Judges during scoring

#### 4.2.4 Users (Staff & Access Control)
Manages accounts for everyone working behind the scenes:

**Role Assignment**:
- Create specific accounts for Judges (who score), Hosts (who manage the stage queue), and other Admins
\n**Credential Management**:
- View and edit usernames and passwords for all staff members
- Ensure no one gets locked out during the busy event day

**Judge-Event Mapping**:
- Assign specific competitions to specific Judges
- Judges only see participants for events they have been assigned to
- Prevents confusion and data entry errors
\n**Admin Credentials**:
- Username: Riya A
- Password: Radha@108

#### 4.2.5 Settings (Global Controls)
Controls the 'Front-Door' and financial aspects of the app:
\n**Registration Toggle**:
- Master switch to open or close the public registration link
- When closed, parents see a 'Registration Closed' message on the home screen
\n**UPI ID Configuration**:\n- Update the official UPI ID (e.g., temple@upi)
- Dynamic QR Code on the public registration page updates instantly for all users when changed
- Ensures funds are always sent to the correct account

### 4.3 Judge Portal Features

#### 4.3.1 Event Access
- View only assigned competitions
\n#### 4.3.2 Scoring Interface
- Select participant from list
- Input marks based on event-specific rubrics\n- Matrix view for score consolidation across judges
- Select and publish Rank 1, 2, 3 winners

### 4.4 Host Portal Features

#### 4.4.1 Stage Management\n- View participant queue for selected events
- Call participants to stage\n
#### 4.4.2 Winner Announcement
- 'Divine Ranks' celebration screen
- Display published results\n
## 5. Business Logic

### 5.1 Age Calculation
- Automatic calculation based on birth date and current date
- Auto-assignment to AgeGroup categories

### 5.2 Fee Calculation
- Fixed base fee for first event
- Discounted rate for additional events

### 5.3 Result Publishing
- Results visible to Host and Public only after Judge publishes
- Explicit publish action required

### 5.4 Print Optimization
- @media print queries for receipt formatting\n- Single-page layout with UI clutter removal

## 6. Additional Requirements
\n### 6.1 Metadata
- App title: 'Sri Krishna Janmashtami Competitions'
- Camera permissions in metadata.json for future QR scanning

### 6.2 Accessibility
- Mobile-first responsive design
- High contrast text (black on light backgrounds)\n- Clear navigation for all user roles
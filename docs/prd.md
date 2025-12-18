# Sri Krishna Janmashtami Competitions Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
Sri Krishna Janmashtami Competitions Management System\n
### 1.2 Application Description
A comprehensive web-based competition management platform for organizing and managing Sri Krishna Janmashtami festival competitions. The system supports multi-role access (Public Users, Admins, Judges, Hosts) with complete registration, scoring, and result management capabilities.
\n## 2. Technical Architecture

### 2.1 Technology Stack
- **Frontend Framework**: React v19with TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **State Management**: React Context API (AppProvider)
- **Data Persistence**: localStorage (key: iskcon_v23_db)
- **Routing**: react-router-dom with HashRouter
- **Icons**: FontAwesome 6.4.0 (primary brand mark: fa-spa Lotus symbol)

### 2.2 Data Storage
- All data persists in browser localStorage
- Key data entities: users, registrations, scores, results, settings
\n## 3. Design Specifications

### 3.1 Visual Design
- **Color Scheme**:
  - Background: Cream/Off-white (#fdfaf6)
  - Primary Accent: Pastel Saffron (#ffe4bc)
  - Secondary Accents: Soft Blue (#e0f2fe), Light Green (#f0fdf4)
  - Text Color: Pure Dark Black (#000000) for maximum contrast
- **Visual Elements**:
  - Rounded corners: rounded-[3rem]\n  - Icon-based UI with FontAwesome Lotus symbol
  - No external images\n  - Whitespace-driven layout

## 4. Age Group and Competition Structure

### 4.1 Age Group Categories
Based on the provided competition schedule (WhatsApp Image 2025-12-18 at 6.22.28 PM.jpeg), the system shall use the following age group categorization:

**Krishna Kids (upto 5 years)**:\n- Age Range: 0-5 years
- Competitions:\n  - Colouring (Sheet will be provided) - 09:30 AM to 10:30 AM
  - Bhagavad Gita Shloka recitation (2 slokas) - 10:30 AM to 11:30 AM
  - Fancy dress (Theme: Krishna Leela) - 11:30 AM to 12:30 PM
\n**Krishna Juniors (6 to 9 years)**:
- Age Range: 6-9 years\n- Competitions:
  - Bday card making for Sri Krishna (Card provided) - 09:30 AM to 10:30 AM\n  - Solo dance performance (3mins max) - 09:30 AM to 10:30 AM
  - Bhagavad Gita sloka recitations (3 slokas) - 10:30 AM to 11:30 AM
  - Fancy dress (Theme: Krishna leela) - 11:30 AM to 12:30 PM

**Krishna Teens (10 to 15 years)**:
- Age Range: 10-15 years\n- Competitions:
  - Pot painting (Pots will be provided) - 09:30 AM to 10:30 AM
  - Solo Dance Performance (3mins max) - 09:30 AM to 10:30 AM
  - Sloka Recitation - Bhagavad-Gita (3 slokas) - 10:30 AM to 11:30 AM
  - Fancy Dress (Theme: Krishna Leela) - 11:30 AM to 12:30 PM

### 4.2 Registration Fees
- Rs.100 per competition
- Discounted rate for additional events (as per existing fee calculation logic)

## 5. Core Functionality

### 5.1 Public User (Participant) Features
\n#### 5.1.1 Home Page
- Access to Registration portal
- View'Hall of Fame' (Winners list)
- Display event poster images: image.png, screenshot.png, WhatsApp Image 2025-12-18 at 6.22.28 PM.jpeg
\n#### 5.1.2 Multi-Step Registration Process
**Step 1 - Profile Information**:\n- Input: Name, Date of Birth\n- Auto-calculation: Age and AgeGroup assignment based on the following rules:
  - Krishna Kids: 0-5 years
  - Krishna Juniors: 6-9 years
  - Krishna Teens: 10-15 years
\n**Step 2 - Event Selection**:
- Dynamic competition filtering based on calculated AgeGroup
- Display competitions with scheduled timings as per the structure defined in section 4.1
- Multi-event selection with fee calculation (Rs.100 per competition)

**Step 3 - Payment**:
- Display UPI ID and dynamically generated QR Code\n- Upload payment screenshot
\n#### 5.1.3 Registration Confirmation
- Generate unique Registration ID
- Display registration QR code
- Download Receipt button (triggers window.print() with optimized CSS)

### 5.2 Admin Dashboard Features

The Admin Dashboard serves as the command center for the entire Janmashtami event, providing comprehensive control and monitoring capabilities.

#### 5.2.1 Overview (Real-time Statistics)
Provides a high-level summary of the event's progress at a glance:
- **Participant Count**: Tracks the total number of children registered across all categories (Krishna Kids, Krishna Juniors, Krishna Teens)
- **Total Revenue**: Calculates the gross income based on registration fees collected (Rs.100 per competition)
- **System Status**: Displays whether the public registration portal is currently'Open' or 'Closed' for immediate status verification

#### 5.2.2 Registrations (Participant Management)
The most functional part of the dashboard, offering three distinct viewing and entry modes:

**Category Filter**:
- Drill down into specific data by Age Group (Krishna Kids / Krishna Juniors / Krishna Teens)
- Further filter by Specific Competition (e.g., Fancy Dress, Sloka Recitation, Solo Dance, etc.)
- View exactly who is participating in what event

**Master Card**:
- Complete, scrollable ledger of every registration in the system
- Display participant's name, contact details, selected events, and payment status
\n**On-Spot Entry**:
- Dedicated form for walk-in participants
- Simplified process for organizers\n- Record 'Cash' or 'Online' payments immediately without requiring file upload
- Automatic fee calculation based on event count (Rs.100 per competition)

**Payment Verification**:
- 'View Proof' button to inspect payment screenshots uploaded by public users
- Verify bank transfers\n\n#### 5.2.3 Competitions (Event Configuration)
Define the 'Rules of Engagement' for the festival:
\n**Pre-configured Competitions**:
The system shall be pre-populated with competitions as defined in section 4.1, including:
- Competition name
- Eligible age group (Krishna Kids / Krishna Juniors / Krishna Teens)
- Scheduled time\n- Special notes (e.g., 'Sheet will be provided', 'Card provided', 'Pots will be provided', '3mins max')

**Dynamic Creation**:
- Add new competitions on the fly
- Specify name, eligible age group, and scheduled time
\n**Rubric Management**:
- Define Scoring Criteria (Rubrics) for every competition
- Example: 'Fancy Dress' might have rubrics like Creativity, Confidence, and Costume\n- Example: 'Sloka' might have Pronunciation and Memory\n- These rubrics appear as input fields for Judges during scoring

#### 5.2.4 Users (Staff & Access Control)
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

**Admin Credentials**:
- Username: Riya A
- Password: Radha@108
\n#### 5.2.5 Settings (Global Controls)
Controls the 'Front-Door' and financial aspects of the app:

**Registration Toggle**:
- Master switch to open or close the public registration link
- When closed, parents see a 'Registration Closed' message on the home screen
\n**UPI ID Configuration**:
- Update the official UPI ID (e.g., temple@upi)\n- Dynamic QR Code on the public registration page updates instantly for all users when changed
- Ensures funds are always sent to the correct account

### 5.3 Judge Portal Features

#### 5.3.1 Event Access
- View only assigned competitions
- Competitions organized by age group (Krishna Kids / Krishna Juniors / Krishna Teens)
\n#### 5.3.2 Scoring Interface
- Select participant from list
- Input marks based on event-specific rubrics
- Matrix view for score consolidation across judges
- Select and publish Rank1,2, 3 winners

### 5.4 Host Portal Features

#### 5.4.1 Stage Management
- View participant queue for selected events
- Display scheduled timings for each competition
- Call participants to stage
\n#### 5.4.2 Winner Announcement
- 'Divine Ranks' celebration screen
- Display published results
\n## 6. Business Logic

### 6.1 Age Calculation\n- Automatic calculation based on birth date and current date
- Auto-assignment to AgeGroup categories:\n  - Krishna Kids: 0-5 years
  - Krishna Juniors: 6-9 years
  - Krishna Teens: 10-15 years

### 6.2 Fee Calculation
- Fixed fee: Rs.100 per competition
- Total fee = Number of competitions × Rs.100
\n### 6.3 Result Publishing
- Results visible to Host and Public only after Judge publishes\n- Explicit publish action required

### 6.4 Print Optimization
- @media print queries for receipt formatting
- Single-page layout with UI clutter removal
\n## 7. Additional Requirements

### 7.1 Metadata
- App title: 'Sri Krishna Janmashtami Competitions'\n- Camera permissions in metadata.json for future QR scanning
\n### 7.2 Accessibility
- Mobile-first responsive design
- High contrast text (black on light backgrounds)
- Clear navigation for all user roles

### 7.3 Reference Images
- Use image.png as event branding element
- Use screenshot.png for UI reference
- Use WhatsApp Image 2025-12-18 at 6.22.28 PM.jpeg as the official competition schedule poster displaying age groups, competitions, timings, and registration details throughout the website
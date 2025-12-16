# Sri Krishna Janmashtami Competitions Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
Sri Krishna Janmashtami Competitions Management System\n
### 1.2 Application Description
A comprehensive web-based competition management platform for organizing and managing Sri Krishna Janmashtami festival competitions. The system supports multi-role access (Public Users, Admins, Judges, Hosts) with complete registration, scoring, and result management capabilities.\n
## 2. Technical Architecture

### 2.1 Technology Stack
- **Frontend Framework**: React v19 with TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **State Management**: React Context API (AppProvider)\n- **Data Persistence**: localStorage (key: iskcon_v23_db)
- **Routing**: react-router-dom with HashRouter
- **Icons**: FontAwesome 6.4.0 (primary brand mark: fa-spa Lotus symbol)

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
  - Rounded corners: rounded-[3rem]\n  - Icon-based UI with FontAwesome Lotus symbol
  - No external images\n  - Whitespace-driven layout

## 4. Core Functionality

### 4.1 Public User (Participant) Features
\n#### 4.1.1 Home Page
- Access to Registration portal
- View'Hall of Fame' (Winners list)
\n#### 4.1.2 Multi-Step Registration Process
**Step 1 - Profile Information**:\n- Input: Name, Date of Birth
- Auto-calculation: Age and AgeGroup assignment (Kids/Juniors/Teens)

**Step 2 - Event Selection**:
- Dynamic competition filtering based on calculated AgeGroup
- Multi-event selection with fee calculation

**Step 3 - Payment**:
- Display UPI ID and dynamically generated QR Code
- Upload payment screenshot

#### 4.1.3 Registration Confirmation
- Generate unique Registration ID
- Display registration QR code
- Download Receipt button (triggers window.print() with optimized CSS)

### 4.2 Admin Dashboard Features

#### 4.2.1 Overview Dashboard
- Real-time statistics: total participants, total revenue, registration status
\n#### 4.2.2 Registration Management
- Master list with filters: AgeGroup, CompetitionID
- On-spot entry form for walk-in registrations
- Payment method selection: Cash/Online
\n#### 4.2.3 Staff Management
- Add new staff (Judges/Hosts)\n- Edit existing staff: Username, Password, Role
- Judge assignment to specific competition events

#### 4.2.4 Competition Management\n- Define event names and times
- Configure scoring rubrics for each competition
\n#### 4.2.5 System Settings
- Toggle global registration availability
- Update UPI ID with real-time QR code preview

### 4.3 Judge Portal Features

#### 4.3.1 Event Access
- View only assigned competitions\n\n#### 4.3.2 Scoring Interface
- Select participant from list\n- Input marks based on event-specific rubrics
- Matrix view for score consolidation across judges
- Select and publish Rank 1, 2, 3 winners

### 4.4 Host Portal Features

#### 4.4.1 Stage Management
- View participant queue for selected events
- Call participants to stage
\n#### 4.4.2 Winner Announcement
- 'Divine Ranks' celebration screen\n- Display published results

## 5. Business Logic

### 5.1 Age Calculation
- Automatic calculation based on birth date and current date
- Auto-assignment to AgeGroup categories

### 5.2 Fee Calculation
- Fixed base fee for first event\n- Discounted rate for additional events
\n### 5.3 Result Publishing
- Results visible to Host and Public only after Judge publishes
- Explicit publish action required

### 5.4 Print Optimization
- @media print queries for receipt formatting
- Single-page layout with UI clutter removal

## 6. Additional Requirements

### 6.1 Metadata
- App title: 'Sri Krishna Janmashtami Competitions'
- Camera permissions in metadata.json for future QR scanning

### 6.2 Accessibility
- Mobile-first responsive design
- High contrast text (black on light backgrounds)
- Clear navigation for all user roles
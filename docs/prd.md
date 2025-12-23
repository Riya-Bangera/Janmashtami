# Sri Krishna Janmashtami Competitions Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
Sri Krishna Janmashtami Competitions Management System\n
### 1.2 Application Description
A comprehensive web-based competition management platform for organizing and managing Sri Krishna Janmashtami festival competitions. The system supports multi-role access (Public Users, Admins, Judges, Hosts) with complete registration, scoring, and result management capabilities. **The system is designed for concurrent multi-device access with real-time data synchronization and annual reusability with configurable event dates.**

## 2. Technical Architecture

### 2.1 Technology Stack
- **Frontend Framework**: React v19with TypeScript
- **Styling**: Tailwind CSS (mobile-first, responsive design)
- **State Management**: React Context API (AppProvider) with real-time sync
- **Data Persistence**: Cloud-based backend with real-time database (Firebase Realtime Database or Firestore)
- **Local Caching**: IndexedDB for offline capability and performance optimization
- **Routing**: react-router-dom with HashRouter\n- **Icons**: FontAwesome 6.4.0 (primary brand mark: fa-spa Lotus symbol)
- **PDF Generation**: jsPDF library for receipt download
- **Excel Export**: SheetJS (xlsx) library for data export functionality
- **SMS/WhatsApp Integration**: API integration for sending receipt to parent's phone number
- **Real-time Sync**: WebSocket or Firebase SDK for live data updates across devices

### 2.2 Multi-Device Architecture
- **Cloud Database**: All data stored in centralized cloud database (Firebase/Firestore)
- **Real-time Synchronization**: Changes made on any device instantly reflect on all connected devices
- **Conflict Resolution**: Last-write-wins strategy with timestamp-based conflict resolution
- **Offline Support**: IndexedDB cache allows read-only access when offline; writes queued and synced when connection restored
- **Session Management**: JWT-based authentication with role-based access control
- **Concurrent Editing**: Optimistic UI updates with server-side validation

### 2.3 Data Storage
- **Primary Storage**: Cloud database (Firebase Realtime Database or Firestore)\n- **Local Cache**: IndexedDB for offline access and performance
- **Key Data Entities**: users, registrations, scores, results, settings, eventConfig
- **Data Sync Strategy**: \n  - Real-time listeners for critical data (registrations, scores, results)
  - Periodic sync for non-critical data (settings, user profiles)
  - Automatic retry mechanism for failed sync operations

### 2.4 Multi-Device Compatibility Features
- **Responsive Design**: Optimized layouts for desktop, tablet, and mobile devices
- **Cross-Browser Support**: Compatible with Chrome, Firefox, Safari, Edge
- **Real-time Updates**: Live data refresh without page reload
- **Concurrent Access Control**: Multiple admins/judges can work simultaneously without data loss
- **Session Persistence**: Users remain logged in across device restarts
- **Bandwidth Optimization**: Delta sync (only changed data transmitted)

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
  - Real-time sync indicator (animated icon showing connection status)

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
- View'Hall of Fame' (Winners list) displaying results in the format:
  - Age Category
  - Competition Name
  - Winners (Rank 1, 2, 3)\n- Display event poster images: image.png, screenshot.png, WhatsApp Image 2025-12-18 at 6.22.28 PM.jpeg
- **Real-time Updates**: Winners list updates automatically when judges publish results
\n#### 5.1.2 Multi-Step Registration Process
**Step 1 - Profile Information**:\n- Input: Child's Name, Date of Birth\n- Input: Parent's Name (mandatory field)
- Input: Parent's Phone Number (mandatory field,10-digit validation)
- Auto-calculation: Age and AgeGroup assignment based on the following rules:
  - Krishna Kids: 0-5 years
  - Krishna Juniors: 6-9 years
  - Krishna Teens: 10-15 years
\n**Step 2 - Event Selection**:
- Dynamic competition filtering based on calculated AgeGroup
- Display competitions with scheduled timings as per the structure defined in section 4.1
- Multi-event selection with fee calculation (Rs.100 per competition)
- **Real-time Availability**: Show current registration count for each competition

**Step 3 - Payment**:
- Display calculated Total Fee amount prominently
- Display UPI ID and dynamically generated QR Code\n- Upload payment screenshot (mandatory)\n- **Payment Verification Logic**:
  - System must extract and verify the payment amount from the uploaded screenshot matches the calculated Total Fee
  - System must extract and validate the payment timestamp from the screenshot
  - If amount mismatch or timestamp cannot be verified, display error message: 'Payment verification failed. Please ensure the screenshot shows the correct amount (Rs.XXX) and payment timestamp is visible.'
  - Only proceed to registration submission if verification passes

#### 5.1.3 Registration Submission and Approval Workflow
**Updated Registration Flow**:
1. **Submission Confirmation**: After successful payment verification, display message: 'Your registration has been submitted successfully. Registration ID: [ID]. Your registration is pending admin approval. You will receive the receipt on your registered phone number once approved.'
2. **Status Display**: Show registration status as 'Pending Approval'\n3. **No Immediate Receipt**: Receipt generation and download are disabled until admin approval
4. **Real-time Status Updates**: Registration status updates automatically across all devices when admin approves/declines

**Post-Approval Process** (triggered by Admin):
1. Generate unique Registration ID
2. Generate registration QR code
3. **Automatic Receipt Delivery**: System automatically sends the PDF receipt to the parent's registered phone number via SMS/WhatsApp
4. Receipt contains:
   - Registration ID
   - Child's Name and Date of Birth
   - Parent's Name and Phone Number
   - Selected competitions with timings
   - Total Fee paid
   - Payment timestamp
   - Registration QR code
   - Approval timestamp
5. Update registration status to 'Confirmed'
6. **Multi-device Sync**: Status change instantly reflects on all connected devices
\n### 5.2 Admin Dashboard Features

The Admin Dashboard serves as the command center for the entire Janmashtami event, providing comprehensive control and monitoring capabilities. **Multiple admins can work simultaneously from different devices without conflicts.**

#### 5.2.1 Overview (Real-time Statistics)
Provides a high-level summary of the event's progress at a glance:
- **Participant Count**: Tracks the total number of children registered across all categories (Krishna Kids, Krishna Juniors, Krishna Teens)
- **Pending Approvals**: Displays count of registrations awaiting approval
- **Total Revenue**: Calculates the gross income based on registration fees collected (Rs.100 per competition)
- **System Status**: Displays whether the public registration portal is currently'Open' or 'Closed' for immediate status verification
- **Active Users**: Shows number of admins, judges, and hosts currently online
- **Real-time Updates**: All statistics update automatically without page refresh
- **Data Export Button**: Prominent'Export All Data to Excel' button for downloading complete system data

#### 5.2.2 Registrations (Participant Management)
The most functional part of the dashboard, offering three distinct viewing and entry modes:

**Registration Status Management**:
- **Status Column**: Each registration displays current status:\n  - 'Pending': Awaiting admin review
  - 'Confirmed': Approved by admin, receipt sent
  - 'Declined': Rejected by admin\n- **Action Buttons** (for Pending registrations):
  - **Approve Button**: \n    - Triggers receipt generation\n    - Sends PDF receipt to parent's phone number via SMS/WhatsApp
    - Updates status to 'Confirmed'
    - Displays confirmation message: 'Registration approved. Receipt sent to [phone number]'
    - **Multi-device Sync**: Approval instantly reflects on all admin/judge/host devices
  - **Decline Button**:
    - Updates status to 'Declined'
    - Optional: Add decline reason field
    - Sends notification to parent's phone: 'Your registration [ID] has been declined. Please contact9686892217 for details.'
    - **Multi-device Sync**: Decline action instantly updates across all devices
- **Concurrent Editing Protection**: If another admin is currently reviewing a registration, show indicator: 'Admin [Name] is reviewing this registration'\n- **Export to Excel Button**: Export filtered registration data to Excel file

**Category Filter**:
- Drill down into specific data by Age Group (Krishna Kids / Krishna Juniors / Krishna Teens)
- Further filter by Specific Competition (e.g., Fancy Dress, Sloka Recitation, Solo Dance, etc.)
- Filter by Status (All / Pending / Confirmed / Declined)
- View exactly who is participating in what event
- **Real-time Filter Results**: List updates automatically as new registrations arrive

**Master Card**:
- Complete, scrollable ledger of every registration in the system
- Display participant's name, parent's name, parent's phone number, contact details, selected events, payment status, and approval status
- Color-coded status indicators:\n  - Yellow/Orange: Pending\n  - Green: Confirmed\n  - Red: Declined\n- **Live Updates**: New registrations appear automatically without refresh
\n**On-Spot Entry**:
- Dedicated form for walk-in participants
- Simplified process for organizers
- Record 'Cash' or 'Online' payments immediately without requiring file upload
- Automatic fee calculation based on event count (Rs.100 per competition)
- Collect child's name, date of birth, parent's name, and parent's phone number
- **Auto-Approval**: On-spot registrations are automatically marked as 'Confirmed' and receipt is immediately sent to parent's phone number
- **Multi-device Sync**: On-spot entries instantly appear on all connected devices

**Payment Verification**:
- 'View Proof' button to inspect payment screenshots uploaded by public users
- Verify bank transfers\n- **Concurrent Review**: Multiple admins can view proofs simultaneously
\n#### 5.2.3 Competitions (Event Configuration)
Define the 'Rules of Engagement' for the festival:
\n**Pre-configured Competitions**:
The system shall be pre-populated with competitions as defined in section 4.1, including:
- Competition name
- Eligible age group (Krishna Kids / Krishna Juniors / Krishna Teens)
- Scheduled time\n- Special notes (e.g., 'Sheet will be provided', 'Card provided', 'Pots will be provided', '3mins max')
\n**Dynamic Creation**:
- Add new competitions on the fly
- Specify name, eligible age group, and scheduled time
- **Multi-device Sync**: New competitions instantly appear on all devices including public registration portal
\n**Rubric Management**:
- Define Scoring Criteria (Rubrics) for every competition
- Example: 'Fancy Dress' might have rubrics like Creativity, Confidence, and Costume\n- Example: 'Sloka' might have Pronunciation and Memory\n- These rubrics appear as input fields for Judges during scoring
- **Real-time Updates**: Rubric changes sync immediately to all judge devices

#### 5.2.4 Users (Staff & Access Control)
Manages accounts for everyone working behind the scenes:

**Role Assignment**:
- Create specific accounts for Judges (who score), Hosts (who manage the stage queue), and other Admins
- **Session Management**: Track active sessions across devices
\n**Credential Management**:
- View and edit usernames and passwords for all staff members
- Ensure no one gets locked out during the busy event day
- **Multi-device Login**: Users can log in from multiple devices simultaneously

**Judge-Event Mapping**:
- Assign specific competitions to specific Judges
- Judges only see participants for events they have been assigned to
- Prevents confusion and data entry errors
- **Real-time Assignment**: Judge assignments sync immediately to judge devices

**Admin Credentials**:
- Username: Riya A
- Password: Radha@108
\n#### 5.2.5 Settings (Global Controls)
Controls the 'Front-Door' and financial aspects of the app:

**Event Date Configuration**:
- **Competition Date Field**: Admin can set/update the competition date (format: DD/MM/YYYY)
- **Competition Year Field**: Admin can set/update the competition year (format: YYYY)\n- **Date Display**: Updated date and year automatically reflect on:\n  - Public home page
  - Registration forms
  - PDF receipts
  - Hall of Fame\n  - All event-related displays
- **Multi-device Sync**: Date changes propagate to all devices and public pages within 2 seconds
- **Annual Reset Option**: 'Prepare for Next Year' button that:\n  - Archives current year's data
  - Clears registrations and scores\n  - Retains competition structure and staff accounts
  - Updates year to next year

**Registration Toggle**:
- Master switch to open or close the public registration link
- When closed, parents see a'Registration Closed' message on the home screen
- **Multi-device Sync**: Toggle change instantly reflects on all public-facing pages

**UPI ID Configuration**:
- Update the official UPI ID (e.g., temple@upi)\n- Dynamic QR Code on the public registration page updates instantly for all users when changed
- Ensures funds are always sent to the correct account
- **Real-time Update**: QR code regenerates and syncs across all devices immediately

**SMS/WhatsApp Configuration**:
- Configure API credentials for SMS/WhatsApp service
- Set message templates for receipt delivery and decline notifications
\n**System Health Monitor**:
- Display database connection status
- Show sync latency metrics
- Alert if any device loses connection\n\n**Data Export Settings**:
- Configure Excel export preferences (columns to include, date format, etc.)
- Export history log showing previous exports with timestamps
\n#### 5.2.6 Data Export Functionality
**Excel Export Feature**:
- **Export All Data Button**: Prominent button in Admin Dashboard to export complete system data
- **Export Options**:
  - All Registrations (with filters applied)
  - All Scores and Results
  - Revenue Summary
  - Competition-wise Participant Lists
  - Judge-wise Score Sheets
  - Complete System Data (all tables)
- **Excel File Structure**:
  - Multiple sheets in single workbook:\n    - Sheet 1: Registrations (ID, Child Name, DOB, Age, Category, Parent Name, Phone, Competitions, Fee, Payment Method, Status, Registration Date)\n    - Sheet 2: Scores (Competition, Age Group, Participant Name, Judge Name, Rubric Scores, Total Score, Rank)\n    - Sheet 3: Results (Age Group, Competition, Rank1, Rank 2, Rank 3)\n    - Sheet 4: Revenue (Total Registrations, Total Revenue, Payment Method Breakdown, Date-wise Revenue)
    - Sheet 5: Competition Summary (Competition Name, Age Group, Total Participants, Scheduled Time)\n- **File Naming Convention**: 'Janmashtami_[Year]_Export_[Date]_[Time].xlsx'
- **Export Triggers**:
  - Manual export via button click
  - Automatic export at end of event day
  - Scheduled exports (configurable)
- **Multi-device Support**: Export can be triggered from any admin device
- **Download Options**: Direct download to device or email to admin

### 5.3 Judge Portal Features

#### 5.3.1 Event Access\n- View only assigned competitions
- Competitions organized by age group (Krishna Kids / Krishna Juniors / Krishna Teens)
- View only'Confirmed' registrations (Pending and Declined registrations are hidden)
- **Real-time Participant List**: List updates automatically as admins approve new registrations
\n#### 5.3.2 Scoring Interface
- Select participant from list
- Input marks based on event-specific rubrics
- Matrix view for score consolidation across judges
- **Multi-Judge Coordination**: See which participants have been scored by other judges in real-time
- **Auto-save**: Scores save automatically as judges type, preventing data loss

**Winner Selection Workflow**:
1. **Score Validation Check**: Before allowing winner selection, the system must verify that all assigned judges have submitted scores for all participants in the competition
2. **Real-time Score Aggregation**: System continuously calculates average scores as judges submit their marks
3. **Automatic Winner Calculation**: Once all judges have scored, the system automatically calculates and suggests Rank 1, 2, and 3 winners based on aggregated scores
4. **Manual Winner Override**: Judges retain the ability to manually edit and adjust the winner rankings even after the system has calculated the results
5. **Publish to Host**: After finalizing the winners, judges can publish the results, which are then transmitted to the Host Portal for announcement
6. **Multi-device Sync**: Published results instantly appear on all host and admin devices

### 5.4 Host Portal Features

#### 5.4.1 Stage Management
- View participant queue for selected events
- Display scheduled timings for each competition
- Call participants to stage\n- View only 'Confirmed' registrations\n- **Real-time Queue Updates**: Participant list updates automatically as new registrations are approved
- **Multi-Host Coordination**: Multiple hosts can manage different stages simultaneously

#### 5.4.2 Winner Announcement
- 'Divine Ranks' celebration screen
- Display published results received from Judge Portal
- Results are organized in the following format:
  - **Age Category** (Krishna Kids / Krishna Juniors / Krishna Teens)
  - **Competition Name**
  - **Winners** (Rank 1, Rank 2, Rank 3with participant names)
- **Real-time Results**: Winner announcements appear automatically when judges publish results
- **Public Display Control**: Host can choose when to publish results to public Hall of Fame
\n## 6. Business Logic

### 6.1 Age Calculation\n- Automatic calculation based on birth date and current date
- Auto-assignment to AgeGroup categories:\n  - Krishna Kids: 0-5 years
  - Krishna Juniors: 6-9 years
  - Krishna Teens: 10-15 years
\n### 6.2 Fee Calculation
- Fixed fee: Rs.100 per competition
- Total fee = Number of competitions × Rs.100
\n### 6.3 Payment Verification
- Extract payment amount from uploaded screenshot using OCR or image analysis
- Compare extracted amount with calculated Total Fee
- Extract payment timestamp from screenshot metadata or visible timestamp
- Validate timestamp is recent (within reasonable timeframe)
- Block registration completion if verification fails

### 6.4 Registration Approval Workflow
**New Approval Logic with Multi-Device Support**:
1. **Submission**: User completes registration with payment verification
2. **Pending State**: Registration enters 'Pending' status, visible only to Admin
3. **Real-time Notification**: All connected admin devices receive notification of new pending registration
4. **Admin Review**: Admin reviews payment proof and registration details
5. **Concurrent Review Protection**: System prevents multiple admins from approving/declining the same registration simultaneously
6. **Approval Actions**:
   - **Approve**: \n     - Generate PDF receipt using jsPDF
     - Send receipt to parent's phone via SMS/WhatsApp API
     - Update status to 'Confirmed'
     - Registration becomes visible to Judges and Hosts
     - **Multi-device Sync**: Status change propagates to all connected devices within 1 second
   - **Decline**:
     - Update status to 'Declined'
     - Send decline notification to parent's phone
     - Registration remains hidden from Judges and Hosts
     - **Multi-device Sync**: Decline action updates across all devices immediately
7. **On-Spot Registrations**: Auto-approved with immediate receipt delivery and instant sync to all devices

### 6.5 Result Publishing
**Updated Result Publishing Workflow with Multi-Device Support**:
1. **Judge Scoring Phase**: All assigned judges must submit scores for all participants in a competition
2. **Real-time Score Sync**: Scores sync across all judge devices as they are entered
3. **Score Validation**: System checks if all judges have completed scoring before enabling winner selection
4. **Winner Determination**: System automatically calculates winners based on aggregated scores, but judges can manually override the rankings
5. **Judge Publication**: Judges publish the finalized winner list\n6. **Host Reception**: Published results are transmitted to the Host Portal in real-time
7. **Public Display**: Host publishes results to the main page (Hall of Fame) in the format:
   - Age Category\n   - Competition Name
   - Winners (Rank 1,2, 3)
8. **Visibility Rule**: Results are visible to Host and Public only after Judge publishes and Host approves for public display
9. **Multi-device Sync**: All result updates propagate to all connected devices instantly

### 6.6 PDF Receipt Generation
- Use jsPDF library to generate downloadable PDF receipt
- Include all registration details, payment information, and QR code
- Include current competition date and year from settings
- Optimize for mobile and desktop download
- Automatically trigger receipt generation upon admin approval

### 6.7 SMS/WhatsApp Integration
- Integrate with SMS/WhatsApp API service for automated message delivery
- Send PDF receipt as attachment or provide download link
- Send approval confirmation and decline notifications
- Log all message delivery attempts and statuses

### 6.8 Multi-Device Synchronization Logic
**Real-time Data Sync**:
- **Registration Data**: Sync within 1 second of submission/approval/decline
- **Score Data**: Sync immediately as judges enter marks
- **Result Data**: Sync instantly when judges publish winners
- **Settings Changes**: Propagate to all devices within 2 seconds
- **Event Date Changes**: Sync to all devices and public pages within 2 seconds

**Conflict Resolution**:
- **Timestamp-based**: Last write wins for non-critical data
- **Lock-based**: Prevent concurrent edits for critical operations (approval/decline)
- **Merge Strategy**: Combine scores from multiple judges without conflicts
\n**Offline Handling**:
- **Read Access**: Users can view cached data when offline
- **Write Queue**: Offline writes queued and synced when connection restored
- **Conflict Alert**: Notify user if offline changes conflict with server state

**Performance Optimization**:
- **Delta Sync**: Only transmit changed data, not entire datasets
- **Lazy Loading**: Load data on-demand for large lists
- **Connection Pooling**: Reuse database connections for efficiency

### 6.9 Excel Export Logic
**Data Export Process**:
1. **Data Collection**: Gather all relevant data from cloud database based on export selection
2. **Data Formatting**: Format data according to Excel export structure (multiple sheets)\n3. **File Generation**: Use SheetJS (xlsx) library to create Excel workbook
4. **File Naming**: Apply naming convention with year, date, and time
5. **Download Trigger**: Initiate browser download or email delivery
6. **Export Logging**: Record export action with admin name, timestamp, and export type
7. **Multi-device Support**: Export can be triggered from any admin device without conflicts

### 6.10 Annual Event Reset Logic
**Year-End Preparation**:
1. **Data Archiving**: Move current year's registrations, scores, and results to archive database
2. **Data Clearing**: Clear active registrations and scores tables
3. **Structure Retention**: Preserve competition definitions, rubrics, and staff accounts
4. **Year Update**: Increment year in event configuration
5. **Date Reset**: Clear competition date (admin must set new date for next year)
6. **Confirmation Prompt**: Require admin confirmation before executing reset
7. **Backup Creation**: Automatic backup of all data before reset
8. **Multi-device Notification**: Notify all connected devices of system reset

## 7. Additional Requirements

### 7.1 Metadata\n- App title: 'Sri Krishna Janmashtami Competitions'
- Camera permissions in metadata.json for future QR scanning
\n### 7.2 Accessibility
- Mobile-first responsive design
- High contrast text (black on light backgrounds)
- Clear navigation for all user roles
- Touch-friendly interface for mobile devices

### 7.3 Multi-Device Compatibility
- **Responsive Breakpoints**: Optimized layouts for mobile (320px+), tablet (768px+), desktop (1024px+)
- **Cross-Browser Testing**: Verified on Chrome, Firefox, Safari, Edge\n- **Network Resilience**: Graceful degradation on slow connections
- **Session Persistence**: Users remain logged in across device restarts and browser sessions

### 7.4 Reference Images
- Use image.png as event branding element
- Use screenshot.png for UI reference
- Use WhatsApp Image2025-12-18 at 6.22.28 PM.jpeg as the official competition schedule poster displaying age groups, competitions, timings, and registration details throughout the website\n
### 7.5 Security Considerations
- **Authentication**: JWT-based token authentication with role-based access control
- **Data Encryption**: All data transmitted over HTTPS/WSS
- **Session Management**: Automatic logout after 24 hours of inactivity
- **Audit Logging**: Track all critical actions (approvals, score changes, result publications, data exports, date changes) with user and timestamp\n- **Export Security**: Restrict Excel export functionality to Admin role only
- **Data Privacy**: Ensure exported Excel files contain only authorized data based on admin permissions
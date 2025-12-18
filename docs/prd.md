# Sri Krishna Janmashtami Competitions Management System Requirements Document

## 1. Application Overview

### 1.1 Application Name
Sri Krishna Janmashtami Competitions Management System

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
- **PDF Generation**: jsPDF library for receipt download
- **SMS/WhatsApp Integration**: API integration for sending receipt to parent's phone number

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
\n**Krishna Kids (upto 5 years)**:\n- Age Range: 0-5 years
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

**Step 3 - Payment**:
- Display calculated Total Fee amount prominently
- Display UPI ID and dynamically generated QR Code\n- Upload payment screenshot (mandatory)
- **Payment Verification Logic**:
  - System must extract and verify the payment amount from the uploaded screenshot matches the calculated Total Fee
  - System must extract and validate the payment timestamp from the screenshot
  - If amount mismatch or timestamp cannot be verified, display error message: 'Payment verification failed. Please ensure the screenshot shows the correct amount (Rs.XXX) and payment timestamp is visible.'
  - Only proceed to registration submission if verification passes

#### 5.1.3 Registration Submission and Approval Workflow
**Updated Registration Flow**:
1. **Submission Confirmation**: After successful payment verification, display message: 'Your registration has been submitted successfully. Registration ID: [ID]. Your registration is pending admin approval. You will receive the receipt on your registered phone number once approved.'
2. **Status Display**: Show registration status as 'Pending Approval'\n3. **No Immediate Receipt**: Receipt generation and download are disabled until admin approval\n
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

### 5.2 Admin Dashboard Features

The Admin Dashboard serves as the command center for the entire Janmashtami event, providing comprehensive control and monitoring capabilities.

#### 5.2.1 Overview (Real-time Statistics)
Provides a high-level summary of the event's progress at a glance:
- **Participant Count**: Tracks the total number of children registered across all categories (Krishna Kids, Krishna Juniors, Krishna Teens)
- **Pending Approvals**: Displays count of registrations awaiting approval
- **Total Revenue**: Calculates the gross income based on registration fees collected (Rs.100 per competition)
- **System Status**: Displays whether the public registration portal is currently'Open' or 'Closed' for immediate status verification

#### 5.2.2 Registrations (Participant Management)
The most functional part of the dashboard, offering three distinct viewing and entry modes:

**Registration Status Management**:
- **Status Column**: Each registration displays current status:\n  - 'Pending': Awaiting admin review
  - 'Confirmed': Approved by admin, receipt sent
  - 'Declined': Rejected by admin\n- **Action Buttons** (for Pending registrations):
  - **Approve Button**: \n    - Triggers receipt generation\n    - Sends PDF receipt to parent's phone number via SMS/WhatsApp
    - Updates status to 'Confirmed'
    - Displays confirmation message: 'Registration approved. Receipt sent to [phone number]'
  - **Decline Button**:
    - Updates status to 'Declined'
    - Optional: Add decline reason field
    - Sends notification to parent's phone: 'Your registration [ID] has been declined. Please contact9686892217 for details.'

**Category Filter**:
- Drill down into specific data by Age Group (Krishna Kids / Krishna Juniors / Krishna Teens)
- Further filter by Specific Competition (e.g., Fancy Dress, Sloka Recitation, Solo Dance, etc.)
- Filter by Status (All / Pending / Confirmed / Declined)
- View exactly who is participating in what event

**Master Card**:
- Complete, scrollable ledger of every registration in the system
- Display participant's name, parent's name, parent's phone number, contact details, selected events, payment status, and approval status
- Color-coded status indicators:\n  - Yellow/Orange: Pending\n  - Green: Confirmed\n  - Red: Declined\n\n**On-Spot Entry**:
- Dedicated form for walk-in participants
- Simplified process for organizers
- Record 'Cash' or 'Online' payments immediately without requiring file upload
- Automatic fee calculation based on event count (Rs.100 per competition)
- Collect child's name, date of birth, parent's name, and parent's phone number
- **Auto-Approval**: On-spot registrations are automatically marked as 'Confirmed' and receipt is immediately sent to parent's phone number

**Payment Verification**:
- 'View Proof' button to inspect payment screenshots uploaded by public users
- Verify bank transfers\n\n#### 5.2.3 Competitions (Event Configuration)
Define the'Rules of Engagement' for the festival:
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
- Create specific accounts for Judges (who score), Hosts (who manage the stage queue), and other Admins\n\n**Credential Management**:
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
- When closed, parents see a'Registration Closed' message on the home screen
\n**UPI ID Configuration**:
- Update the official UPI ID (e.g., temple@upi)\n- Dynamic QR Code on the public registration page updates instantly for all users when changed
- Ensures funds are always sent to the correct account

**SMS/WhatsApp Configuration**:
- Configure API credentials for SMS/WhatsApp service
- Set message templates for receipt delivery and decline notifications
\n### 5.3 Judge Portal Features

#### 5.3.1 Event Access
- View only assigned competitions
- Competitions organized by age group (Krishna Kids / Krishna Juniors / Krishna Teens)
- View only'Confirmed' registrations (Pending and Declined registrations are hidden)
\n#### 5.3.2 Scoring Interface
- Select participant from list
- Input marks based on event-specific rubrics
- Matrix view for score consolidation across judges
\n**Winner Selection Workflow**:
1. **Score Validation Check**: Before allowing winner selection, the system must verify that all assigned judges have submitted scores for all participants in the competition
2. **Automatic Winner Calculation**: Once all judges have scored, the system automatically calculates and suggests Rank 1, 2, and 3 winners based on aggregated scores
3. **Manual Winner Override**: Judges retain the ability to manually edit and adjust the winner rankings even after the system has calculated the results
4. **Publish to Host**: After finalizing the winners, judges can publish the results, which are then transmitted to the Host Portal for announcement

### 5.4 Host Portal Features

#### 5.4.1 Stage Management
- View participant queue for selected events
- Display scheduled timings for each competition
- Call participants to stage\n- View only 'Confirmed' registrations\n
#### 5.4.2 Winner Announcement
- 'Divine Ranks' celebration screen
- Display published results received from Judge Portal
- Results are organized in the following format:
  - **Age Category** (Krishna Kids / Krishna Juniors / Krishna Teens)
  - **Competition Name**
  - **Winners** (Rank 1, Rank 2, Rank 3with participant names)
\n## 6. Business Logic\n
### 6.1 Age Calculation
- Automatic calculation based on birth date and current date
- Auto-assignment to AgeGroup categories:\n  - Krishna Kids: 0-5 years
  - Krishna Juniors: 6-9 years
  - Krishna Teens: 10-15 years

### 6.2 Fee Calculation
- Fixed fee: Rs.100 per competition
- Total fee = Number of competitions × Rs.100
\n### 6.3 Payment Verification
- Extract payment amount from uploaded screenshot using OCR or image analysis
- Compare extracted amount with calculated Total Fee
- Extract payment timestamp from screenshot metadata or visible timestamp
- Validate timestamp is recent (within reasonable timeframe)
- Block registration completion if verification fails

### 6.4 Registration Approval Workflow
**New Approval Logic**:
1. **Submission**: User completes registration with payment verification
2. **Pending State**: Registration enters 'Pending' status, visible only to Admin
3. **Admin Review**: Admin reviews payment proof and registration details
4. **Approval Actions**:
   - **Approve**: \n     - Generate PDF receipt using jsPDF
     - Send receipt to parent's phone via SMS/WhatsApp API
     - Update status to 'Confirmed'
     - Registration becomes visible to Judges and Hosts
   - **Decline**:
     - Update status to 'Declined'
     - Send decline notification to parent's phone
     - Registration remains hidden from Judges and Hosts
5. **On-Spot Registrations**: Auto-approved with immediate receipt delivery

### 6.5 Result Publishing
**Updated Result Publishing Workflow**:
1. **Judge Scoring Phase**: All assigned judges must submit scores for all participants in a competition
2. **Score Validation**: System checks if all judges have completed scoring before enabling winner selection
3. **Winner Determination**: System automatically calculates winners based on aggregated scores, but judges can manually override the rankings
4. **Judge Publication**: Judges publish the finalized winner list\n5. **Host Reception**: Published results are transmitted to the Host Portal\n6. **Public Display**: Host publishes results to the main page (Hall of Fame) in the format:
   - Age Category
   - Competition Name
   - Winners (Rank 1, 2, 3)
7. **Visibility Rule**: Results are visible to Host and Public only after Judge publishes and Host approves for public display

### 6.6 PDF Receipt Generation
- Use jsPDF library to generate downloadable PDF receipt
- Include all registration details, payment information, and QR code
- Optimize for mobile and desktop download
- Automatically trigger receipt generation upon admin approval

### 6.7 SMS/WhatsApp Integration
- Integrate with SMS/WhatsApp API service for automated message delivery
- Send PDF receipt as attachment or provide download link
- Send approval confirmation and decline notifications
- Log all message delivery attempts and statuses

## 7. Additional Requirements

### 7.1 Metadata\n- App title: 'Sri Krishna Janmashtami Competitions'
- Camera permissions in metadata.json for future QR scanning
\n### 7.2 Accessibility
- Mobile-first responsive design
- High contrast text (black on light backgrounds)
- Clear navigation for all user roles
\n### 7.3 Reference Images
- Use image.png as event branding element
- Use screenshot.png for UI reference
- Use WhatsApp Image 2025-12-18 at 6.22.28 PM.jpeg as the official competition schedule poster displaying age groups, competitions, timings, and registration details throughout the website
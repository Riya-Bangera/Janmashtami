# Task: Sri Krishna Janmashtami Competitions Management System

## Plan
- [x] 1. Setup and Configuration
  - [x] 1.1 Install FontAwesome 6.4.0 for icons
  - [x] 1.2 Update index.css with custom color scheme (cream, saffron, black text)
  - [x] 1.3 Update tailwind.config.js with custom colors
  - [x] 1.4 Update index.html with proper title and metadata

- [x] 2. Type Definitions
  - [x] 2.1 Create types for User, Registration, Competition, Score, Result, Settings
  - [x] 2.2 Define AgeGroup enum (Kids, Juniors, Teens)
  - [x] 2.3 Define UserRole enum (admin, judge, host, public)

- [x] 3. Context and State Management
  - [x] 3.1 Create AppContext with localStorage integration (key: iskcon_v23_db)
  - [x] 3.2 Implement data management functions (CRUD operations)
  - [x] 3.3 Add authentication state management

- [x] 4. Utility Functions
  - [x] 4.1 Create age calculation utility
  - [x] 4.2 Create fee calculation utility
  - [x] 4.3 Create registration ID generator
  - [x] 4.4 Create QR code data formatter

- [x] 5. Public User Pages
  - [x] 5.1 Home page with navigation
  - [x] 5.2 Multi-step registration form (Profile, Event Selection, Payment)
  - [x] 5.3 Registration confirmation page with QR code and receipt
  - [x] 5.4 Hall of Fame (Winners list)

- [x] 6. Admin Dashboard
  - [x] 6.1 Admin login page
  - [x] 6.2 Overview dashboard with statistics
  - [x] 6.3 Registration management with filters
  - [x] 6.4 On-spot registration form
  - [x] 6.5 Staff management (add/edit judges and hosts)
  - [x] 6.6 Competition management (events, times, rubrics)
  - [x] 6.7 System settings (UPI ID, registration toggle)

- [x] 7. Judge Portal
  - [x] 7.1 Judge login page
  - [x] 7.2 View assigned competitions
  - [x] 7.3 Scoring interface with rubrics
  - [x] 7.4 Score matrix view
  - [x] 7.5 Winner selection and publishing

- [x] 8. Host Portal
  - [x] 8.1 Host login page
  - [x] 8.2 Participant queue view
  - [x] 8.3 Call participants to stage
  - [x] 8.4 Divine Ranks celebration screen
  - [x] 8.5 Winner announcement display

- [x] 9. Routing and Navigation
  - [x] 9.1 Setup HashRouter
  - [x] 9.2 Create routes.tsx with all routes
  - [x] 9.3 Implement protected routes for different roles

- [x] 10. Print Styles
  - [x] 10.1 Add @media print styles for receipt
  - [x] 10.2 Optimize single-page layout for printing

- [x] 11. Testing and Validation
  - [x] 11.1 Run npm run lint
  - [x] 11.2 Test all user flows
  - [x] 11.3 Verify localStorage persistence

## Notes
- QRCodeDataUrl component exists at src/components/ui/qrcodedataurl.tsx
- Using HashRouter instead of BrowserRouter as per requirements
- All data persists in localStorage with key: iskcon_v23_db
- FontAwesome Lotus icon: fa-spa
- Color scheme: cream (#fdfaf6), saffron (#ffe4bc), black (#000000)
- Rounded corners: rounded-[3rem]
- All tasks completed successfully!
- Linting passed with no errors

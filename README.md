# Sri Krishna Janmashtami Competitions Management System

A comprehensive web-based competition management platform for organizing and managing Sri Krishna Janmashtami festival competitions with multi-role access support.

## Features

### 🎭 Multi-Role Access System
- **Public Users**: Registration and viewing winners
- **Administrators**: Complete system management
- **Judges**: Scoring and result publishing
- **Hosts**: Stage management and winner announcements

### 📝 Public User Features
- Multi-step registration process (Profile → Event Selection → Payment)
- Automatic age calculation and category assignment
- Dynamic competition filtering based on age group
- UPI payment with QR code generation
- Registration confirmation with downloadable receipt
- Hall of Fame to view published winners

### 👨‍💼 Admin Dashboard
- Real-time statistics (participants, revenue, registrations)
- Registration management with advanced filters
- On-spot registration for walk-in participants
- Staff management (add/edit judges and hosts)
- Competition management (events, times, scoring rubrics)
- System settings (UPI ID, registration toggle)

### ⚖️ Judge Portal
- View assigned competitions only
- Score participants using event-specific rubrics
- Score matrix view across all judges
- Select and publish top 3 winners
- Results visible only after publishing

### 🎤 Host Portal
- View participant queue for selected events
- Call participants to stage
- Divine Ranks celebration screen
- Winner announcement display

## Technical Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router (HashRouter)
- **Icons**: FontAwesome 6.4.0
- **Data Persistence**: localStorage

### Design System
- **Color Scheme**: 
  - Background: Cream (#fdfaf6)
  - Primary: Pastel Saffron (#ffe4bc)
  - Secondary: Soft Blue (#e0f2fe)
  - Accent: Light Green (#f0fdf4)
  - Text: Pure Black (#000000)
- **Visual Style**: Rounded corners (3rem), icon-based UI, whitespace-driven layout
- **Brand Icon**: Lotus symbol (fa-spa)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── common/          # Common components
│   ├── contexts/
│   │   └── AppContext.tsx   # Global state management
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Register.tsx
│   │   ├── RegistrationConfirmation.tsx
│   │   ├── HallOfFame.tsx
│   │   ├── admin/           # Admin pages
│   │   ├── judge/           # Judge pages
│   │   └── host/            # Host pages
│   ├── types/
│   │   └── types.ts         # TypeScript definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── routes.tsx           # Route configuration
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles
```

## Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev -- --host 127.0.0.1
```

3. Build for production:
```bash
npm run build
```

## Default Credentials

### Admin Access
- Username: `Riya A`
- Password: `Radha@108`

### Initial Setup
1. Login as admin
2. Add judges and hosts in Staff Management
3. Configure competitions in Competition Management
4. Update UPI ID in System Settings
5. Toggle registration status when ready

## Data Storage

All data is stored in browser localStorage with the key: `iskcon_v23_db`

### Data Structure
- Users (with roles and permissions)
- Competitions (with rubrics and age groups)
- Registrations (participant data)
- Scores (judge scores)
- Results (published winners)
- Settings (system configuration)

## Key Features Implementation

### Age Calculation & Grouping
- Automatic age calculation from date of birth
- Auto-assignment to age groups:
  - Kids: ≤ 8 years
  - Juniors: 9-12 years
  - Teens: ≥ 13 years

### Fee Calculation
- Base fee for first competition
- Discounted additional fee for subsequent competitions
- Automatic total calculation

### QR Code Generation
- Payment QR codes with UPI deep links
- Registration confirmation QR codes
- Print-optimized receipt layout

### Scoring System
- Multiple judges can score each participant
- Average score calculation
- Score matrix view for transparency
- Winner selection and publishing

### Print Optimization
- Dedicated print styles for receipts
- Single-page optimized layout
- Clean, professional appearance

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

2025 Sri Krishna Janmashtami Competitions

## Support

For issues or questions, please refer to the system documentation or contact the administrator.

# Sri Krishna Janmashtami Competitions - Quick Reference Card

## 🔑 Admin Login Credentials
```
Username: Riya A
Password: Radha@108
```

## 📊 Dashboard Statistics (4 Cards)
1. **Total Participants** - Count of all registered children
2. **Total Revenue** - Total fees collected (₹)
3. **Confirmed Registrations** - Number of confirmed participants
4. **System Status** - Registration portal status (Open/Closed)

## 🎯 Main Features

### 1️⃣ Registration Management
- **View All**: Master list of all registrations
- **Filter by Age Group**: Kids / Juniors / Teens
- **Filter by Competition**: Specific event filtering
- **View Proof**: Click to see payment screenshots (online payments only)
- **On-Spot Entry**: Add walk-in registrations with cash/online payment

### 2️⃣ Competition Management
- **Add Competition**: Name, time, fees, age groups
- **Define Rubrics**: Scoring criteria for judges
- **Delete Competition**: Remove events

### 3️⃣ Staff Management
- **Add Staff**: Create judge/host accounts
- **Assign Competitions**: Map judges to specific events
- **Edit Staff**: Update credentials and assignments
- **Delete Staff**: Remove accounts

### 4️⃣ System Settings
- **Registration Toggle**: Open/Close public registration
- **UPI ID**: Configure payment collection account
- **QR Preview**: See payment QR code before going live

## 🎨 Age Groups & Auto-Assignment
- **Kids**: ≤ 8 years old
- **Juniors**: 9-12 years old
- **Teens**: ≥ 13 years old
- *Automatically calculated from date of birth*

## 💰 Fee Calculation
- **Base Fee**: Charged for first competition
- **Additional Fee**: Discounted rate for extra competitions
- *Automatically calculated based on event count*

## 🔄 Typical Workflow

### Before Event
1. ✅ Login as admin
2. ✅ Add all competitions with rubrics
3. ✅ Create judge and host accounts
4. ✅ Assign judges to competitions
5. ✅ Configure UPI ID
6. ✅ Open registration

### During Registration
1. 📊 Monitor dashboard statistics
2. 💳 Verify payment proofs
3. 📞 Handle participant queries
4. 📝 Add on-spot registrations

### Event Day
1. 🚪 Close online registration
2. 📝 Focus on walk-in registrations
3. 👥 Coordinate with judges and hosts
4. 📊 Track real-time participation

## 🎭 User Roles

| Role | Access | Key Functions |
|------|--------|---------------|
| **Admin** | Full system | All management features |
| **Judge** | Assigned competitions | Score participants, publish results |
| **Host** | All competitions | Manage queue, announce winners |
| **Public** | Registration & Hall of Fame | Register, view winners |

## 🔐 Security Notes
- Change admin password after first login (via Staff Management)
- Keep staff credentials secure
- Verify payment proofs before event day
- Backup localStorage data regularly

## 📱 Access URLs

### Public Pages
- `/` - Home page
- `/register` - Registration form
- `/hall-of-fame` - Winners display

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Overview
- `/admin/registrations` - Participant management
- `/admin/staff` - Staff management
- `/admin/competitions` - Event configuration
- `/admin/settings` - System settings

### Judge Pages
- `/judge/login` - Judge login
- `/judge/dashboard` - Scoring interface

### Host Pages
- `/host/login` - Host login
- `/host/dashboard` - Queue & announcements

## 💡 Quick Tips

### Registration Management
- Use filters to find specific participants quickly
- Click "View Proof" to verify online payments
- On-spot entry is faster than public form

### Payment Verification
- Check transaction ID matches
- Verify amount equals total fee
- Confirm UPI ID is correct
- Check payment timestamp

### Competition Setup
- Define clear rubric names
- Set realistic maximum scores
- Assign appropriate age groups
- Schedule competitions with buffer time

### Staff Management
- Use descriptive usernames
- Assign judges to their expertise areas
- Create backup admin accounts
- Share credentials securely

## 🆘 Emergency Contacts

**Technical Issues:**
- Check browser console for errors
- Clear localStorage if data corrupted
- Refresh page for updates
- Use Chrome/Firefox for best compatibility

**Data Backup:**
- localStorage key: `iskcon_v23_db`
- Export data before major changes
- Keep backup of initial configuration

## 📊 Data Storage

All data stored in browser localStorage:
- Users (staff accounts)
- Competitions (events & rubrics)
- Registrations (participant data)
- Scores (judge scores)
- Results (published winners)
- Settings (UPI ID, registration status)

**Important:** Clearing browser data will erase all information!

## 🎉 Success Checklist

### Pre-Event
- [ ] All competitions configured
- [ ] All staff accounts created
- [ ] Judges assigned to events
- [ ] UPI ID tested and working
- [ ] Registration opened
- [ ] Test registration completed

### During Event
- [ ] Monitor registrations
- [ ] Verify payments
- [ ] Add on-spot entries
- [ ] Coordinate with staff
- [ ] Track statistics

### Post-Event
- [ ] All payments verified
- [ ] All results published
- [ ] Data backed up
- [ ] Registration closed

---

**Hare Krishna! May your event be blessed with success! 🙏**

*For detailed information, refer to:*
- `README.md` - Technical documentation
- `USER_GUIDE.md` - Complete user guide
- `ADMIN_FEATURES.md` - Detailed admin features

import type { ReactNode } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import RegistrationConfirmation from './pages/RegistrationConfirmation';
import HallOfFame from './pages/HallOfFame';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminPaymentVerification from './pages/admin/AdminPaymentVerification';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCompetitions from './pages/admin/AdminCompetitions';
import AdminSettings from './pages/admin/AdminSettings';
import JudgeLogin from './pages/judge/JudgeLogin';
import JudgeDashboard from './pages/judge/JudgeDashboard';
import HostLogin from './pages/host/HostLogin';
import HostDashboard from './pages/host/HostDashboard';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />
  },
  {
    name: 'Registration Confirmation',
    path: '/registration-confirmation/:registrationId',
    element: <RegistrationConfirmation />
  },
  {
    name: 'Hall of Fame',
    path: '/hall-of-fame',
    element: <HallOfFame />
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    name: 'Admin Registrations',
    path: '/admin/registrations',
    element: <AdminRegistrations />
  },
  {
    name: 'Admin Payment Verification',
    path: '/admin/payment-verification',
    element: <AdminPaymentVerification />
  },
  {
    name: 'Admin Staff',
    path: '/admin/staff',
    element: <AdminStaff />
  },
  {
    name: 'Admin Competitions',
    path: '/admin/competitions',
    element: <AdminCompetitions />
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    element: <AdminSettings />
  },
  {
    name: 'Judge Login',
    path: '/judge/login',
    element: <JudgeLogin />
  },
  {
    name: 'Judge Dashboard',
    path: '/judge/dashboard',
    element: <JudgeDashboard />
  },
  {
    name: 'Host Login',
    path: '/host/login',
    element: <HostLogin />
  },
  {
    name: 'Host Dashboard',
    path: '/host/dashboard',
    element: <HostDashboard />
  }
];

export default routes;

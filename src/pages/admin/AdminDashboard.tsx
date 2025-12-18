import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { UserRole, RegistrationStatus } from '@/types/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, data, logout } = useApp();

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const totalParticipants = data.registrations.length;
  const totalRevenue = data.registrations.reduce((sum, reg) => sum + reg.totalFee, 0);
  const confirmedRegistrations = data.registrations.filter(r => r.status === RegistrationStatus.Confirmed).length;
  const pendingRegistrations = data.registrations.filter(r => r.status === RegistrationStatus.Pending).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-spa text-3xl text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-[3rem]">
            <i className="fas fa-sign-out-alt mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-[3rem] border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-users text-primary" />
                Total Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalParticipants}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-rupee-sign text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">₹{totalRevenue}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-check-circle text-primary" />
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{confirmedRegistrations}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-clock text-yellow-600" />
                Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold">{pendingRegistrations}</p>
                {pendingRegistrations > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    Action Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {pendingRegistrations > 0 && (
          <Card className="rounded-[3rem] border-2 bg-yellow-50 dark:bg-yellow-950/20 mb-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <i className="fas fa-exclamation-triangle text-yellow-600 text-3xl" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {pendingRegistrations} Payment{pendingRegistrations > 1 ? 's' : ''} Awaiting Verification
                    </h3>
                    <p className="text-muted-foreground">
                      Review payment screenshots and approve or reject registrations
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/admin/payment-verification')}
                  size="lg"
                  className="rounded-[3rem]"
                >
                  <i className="fas fa-check-double mr-2" />
                  Verify Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/payment-verification')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <i className="fas fa-money-check-alt text-primary text-2xl" />
                Payment Verification
                {pendingRegistrations > 0 && (
                  <Badge variant="destructive">{pendingRegistrations}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Review payment screenshots and approve or reject online registrations
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/registrations')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <i className="fas fa-clipboard-list text-primary text-2xl" />
                Registration Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View all registrations, add on-spot entries, and manage participant data
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/staff')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <i className="fas fa-user-tie text-primary text-2xl" />
                Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add and manage judges and hosts, assign competitions to judges
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/competitions')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <i className="fas fa-trophy text-primary text-2xl" />
                Competition Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Define events, set times, configure scoring rubrics
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/settings')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <i className="fas fa-cog text-primary text-2xl" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Toggle registration availability, update UPI ID and payment settings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/types';

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
  const confirmedRegistrations = data.registrations.filter(r => r.status === 'confirmed').length;

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

          <Card className={`rounded-[3rem] border-2 ${data.settings.registrationOpen ? 'bg-muted/50' : 'bg-destructive/10'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className={`fas ${data.settings.registrationOpen ? 'fa-door-open' : 'fa-door-closed'} text-primary`} />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {data.settings.registrationOpen ? 'Open' : 'Closed'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Registration Portal
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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

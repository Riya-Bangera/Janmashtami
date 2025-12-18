import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

export default function AdminSettings() {
  const navigate = useNavigate();
  const { currentUser, data, updateSettings } = useApp();
  const { toast } = useToast();

  const [upiId, setUpiId] = useState(data.settings.upiId);
  const [registrationOpen, setRegistrationOpen] = useState(data.settings.registrationOpen);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSave = () => {
    updateSettings({
      upiId,
      registrationOpen
    });

    toast({
      title: 'Success',
      description: 'Settings updated successfully'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left mr-2" />
            </Button>
            <h1 className="text-2xl font-bold">System Settings</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card className="rounded-[3rem]">
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registration-toggle" className="text-base font-semibold">
                    Registration Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable public registration
                  </p>
                </div>
                <Switch
                  id="registration-toggle"
                  checked={registrationOpen}
                  onCheckedChange={setRegistrationOpen}
                />
              </div>
              <div className="p-4 bg-accent/30 rounded-[3rem]">
                <p className="text-sm">
                  Current Status: <span className="font-semibold">{registrationOpen ? 'Open' : 'Closed'}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem]">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="rounded-[3rem]"
                  placeholder="yourname@upi"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This UPI ID will be used for payment collection
                </p>
              </div>

              <div>
                <Label>QR Code Preview</Label>
                <div className="flex justify-center p-6 bg-accent/30 rounded-[3rem] mt-2">
                  <QRCodeDataUrl text={`upi://pay?pa=${upiId}&am=100`} width={200} />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  This QR code will be shown to participants during registration
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1 rounded-[3rem]" size="lg">
              <i className="fas fa-save mr-2" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 rounded-[3rem]"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

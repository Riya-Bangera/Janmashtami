import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { UserRole, RegistrationStatus } from '@/types/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminPaymentVerification() {
  const navigate = useNavigate();
  const { currentUser, data, updateRegistration } = useApp();
  const { toast } = useToast();
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const pendingRegistrations = data.registrations.filter(
    reg => reg.status === RegistrationStatus.Pending
  );

  const handleApprove = (registrationId: string) => {
    const registration = data.registrations.find(r => r.id === registrationId);
    if (!registration) return;

    updateRegistration(registrationId, {
      status: RegistrationStatus.Confirmed
    });

    toast({
      title: 'Registration Approved',
      description: `Registration ${registration.registrationId} has been approved`
    });
  };

  const handleReject = (registrationId: string) => {
    const registration = data.registrations.find(r => r.id === registrationId);
    if (!registration) return;

    updateRegistration(registrationId, {
      status: RegistrationStatus.Cancelled
    });

    toast({
      title: 'Registration Rejected',
      description: `Registration ${registration.registrationId} has been rejected`,
      variant: 'destructive'
    });
  };

  const handleViewScreenshot = (registrationId: string) => {
    setSelectedRegistration(registrationId);
    setScreenshotDialogOpen(true);
  };

  const selectedReg = selectedRegistration 
    ? data.registrations.find(r => r.id === selectedRegistration)
    : null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Payment Verification</h1>
          <p className="text-muted-foreground">
            Review and verify payment screenshots for pending registrations
          </p>
        </div>

        {pendingRegistrations.length === 0 ? (
          <Card className="rounded-[3rem]">
            <CardContent className="py-12 text-center">
              <i className="fas fa-check-circle text-6xl text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No pending registrations to verify at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingRegistrations.map((registration) => {
              const competitions = data.competitions.filter(c =>
                registration.competitions.includes(c.id)
              );

              return (
                <Card key={registration.id} className="rounded-[3rem]">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {registration.name}
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {registration.registrationId}
                          </Badge>
                          <Badge variant="secondary">
                            {registration.ageGroup}
                          </Badge>
                          <Badge variant="secondary">
                            {registration.age} years
                          </Badge>
                        </div>
                      </div>
                      <Badge className="text-lg px-4 py-1">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">
                          Participant Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">{registration.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DOB:</span>
                            <span className="font-semibold">
                              {formatDate(registration.dateOfBirth)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age:</span>
                            <span className="font-semibold">
                              {registration.age} years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-semibold">
                              {registration.ageGroup}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3">
                          Parent/Guardian Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">
                              {registration.parentName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-semibold">
                              {registration.parentPhone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3">
                        Registered Competitions
                      </h3>
                      <div className="space-y-2">
                        {competitions.map((comp) => (
                          <div
                            key={comp.id}
                            className="flex justify-between items-center p-3 bg-accent/30 rounded-[3rem]"
                          >
                            <span className="font-semibold">{comp.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {comp.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Payment Details</h3>
                        <span className="text-2xl font-bold text-primary">
                          ₹{registration.totalFee}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Payment Method:
                          </span>
                          <span className="font-semibold">Online (UPI)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Registration Date:
                          </span>
                          <span className="font-semibold">
                            {formatDate(registration.createdAt)}
                          </span>
                        </div>
                      </div>

                      {registration.paymentScreenshot && (
                        <div className="mb-4">
                          <Button
                            onClick={() => handleViewScreenshot(registration.id)}
                            variant="outline"
                            className="w-full rounded-[3rem]"
                          >
                            <i className="fas fa-image mr-2" />
                            View Payment Screenshot
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleReject(registration.id)}
                          variant="destructive"
                          className="flex-1 rounded-[3rem]"
                        >
                          <i className="fas fa-times mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(registration.id)}
                          className="flex-1 rounded-[3rem]"
                        >
                          <i className="fas fa-check mr-2" />
                          Approve Payment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={screenshotDialogOpen} onOpenChange={setScreenshotDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot</DialogTitle>
            </DialogHeader>
            {selectedReg && selectedReg.paymentScreenshot && (
              <div className="space-y-4">
                <div className="bg-accent/30 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Registration ID:</span>
                      <p className="font-semibold">{selectedReg.registrationId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Amount:</span>
                      <p className="font-semibold text-primary text-xl">
                        ₹{selectedReg.totalFee}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Participant:</span>
                      <p className="font-semibold">{selectedReg.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Parent Phone:</span>
                      <p className="font-semibold">{selectedReg.parentPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedReg.paymentScreenshot}
                    alt="Payment Screenshot"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      handleReject(selectedReg.id);
                      setScreenshotDialogOpen(false);
                    }}
                    variant="destructive"
                    className="flex-1 rounded-[3rem]"
                  >
                    <i className="fas fa-times mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedReg.id);
                      setScreenshotDialogOpen(false);
                    }}
                    className="flex-1 rounded-[3rem]"
                  >
                    <i className="fas fa-check mr-2" />
                    Approve Payment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-8">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="rounded-[3rem]"
          >
            <i className="fas fa-arrow-left mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

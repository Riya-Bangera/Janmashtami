import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { formatDate } from '@/lib/utils';

export default function RegistrationConfirmation() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const navigate = useNavigate();
  const { data } = useApp();

  const registration = data.registrations.find(r => r.registrationId === registrationId);

  if (!registration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-[3rem]">
          <CardHeader>
            <CardTitle className="text-center">Registration Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')} className="rounded-[3rem]">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const competitions = data.competitions.filter(c => registration.competitions.includes(c.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="no-print text-center mb-8">
          <i className="fas fa-check-circle text-6xl text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Registration Successful!</h1>
          <p className="text-muted-foreground">Your registration has been confirmed</p>
        </div>

        <Card className="rounded-[3rem] print-area">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <i className="fas fa-spa text-5xl text-primary" />
            </div>
            <CardTitle className="text-3xl">Sri Krishna Janmashtami</CardTitle>
            <p className="text-xl">Competition Registration Receipt</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <QRCodeDataUrl text={registration.registrationId} width={150} />
              </div>
              <p className="text-2xl font-bold">{registration.registrationId}</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Participant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{registration.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold">{registration.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{registration.ageGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold">{formatDate(registration.dateOfBirth)}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Registered Competitions</h3>
              <div className="space-y-2">
                {competitions.map((comp) => (
                  <div key={comp.id} className="flex justify-between items-center p-3 bg-accent/30 rounded-[3rem]">
                    <div>
                      <p className="font-semibold">{comp.name}</p>
                      <p className="text-sm text-muted-foreground">Time: {comp.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Fee Paid</span>
                <span>₹{registration.totalFee}</span>
              </div>
            </div>

            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
              <p>Registration Date: {formatDate(registration.createdAt)}</p>
              <p className="mt-2">Please bring this receipt on the day of the event</p>
            </div>
          </CardContent>
        </Card>

        <div className="no-print flex gap-4 mt-8">
          <Button onClick={handlePrint} className="flex-1 rounded-[3rem]" size="lg">
            <i className="fas fa-print mr-2" />
            Download Receipt
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1 rounded-[3rem]" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

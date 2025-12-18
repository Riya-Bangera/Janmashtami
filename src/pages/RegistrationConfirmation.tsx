import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

export default function RegistrationConfirmation() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const navigate = useNavigate();
  const { data } = useApp();
  const { toast } = useToast();

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

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Sri Krishna Janmashtami', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Competition Registration Receipt', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Registration ID
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Registration ID:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(registration.registrationId, 70, yPos);
      yPos += 10;

      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Participant Details Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Participant Details', 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Name:', 20, yPos);
      doc.text(registration.name, 70, yPos);
      yPos += 7;

      doc.text('Date of Birth:', 20, yPos);
      doc.text(formatDate(registration.dateOfBirth), 70, yPos);
      yPos += 7;

      doc.text('Age:', 20, yPos);
      doc.text(`${registration.age} years`, 70, yPos);
      yPos += 7;

      doc.text('Category:', 20, yPos);
      doc.text(registration.ageGroup, 70, yPos);
      yPos += 10;

      // Parent Details Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Parent/Guardian Details', 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Parent Name:', 20, yPos);
      doc.text(registration.parentName, 70, yPos);
      yPos += 7;

      doc.text('Phone Number:', 20, yPos);
      doc.text(registration.parentPhone, 70, yPos);
      yPos += 10;

      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Registered Competitions Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Registered Competitions', 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      competitions.forEach((comp, index) => {
        doc.text(`${index + 1}. ${comp.name}`, 25, yPos);
        yPos += 6;
        if (comp.time) {
          doc.setFontSize(9);
          doc.text(`   Time: ${comp.time}`, 25, yPos);
          doc.setFontSize(11);
          yPos += 6;
        }
      });
      yPos += 5;

      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Payment Details Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Payment Method:', 20, yPos);
      doc.text('Online (UPI)', 70, yPos);
      yPos += 7;

      if (registration.paymentAmount) {
        doc.text('Amount Paid:', 20, yPos);
        doc.text(`₹${registration.paymentAmount}`, 70, yPos);
        yPos += 7;
      }

      if (registration.paymentTimestamp) {
        doc.text('Payment Time:', 20, yPos);
        doc.text(formatDate(registration.paymentTimestamp), 70, yPos);
        yPos += 7;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Fee Paid:', 20, yPos);
      doc.text(`₹${registration.totalFee}`, 70, yPos);
      yPos += 10;

      // Horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;

      // Footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Registration Date: ${formatDate(registration.createdAt)}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 7;
      
      doc.setFontSize(9);
      doc.text('Please bring this receipt on the day of the event', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(8);
      doc.text('2025 Sri Krishna Janmashtami Competitions', pageWidth / 2, yPos, { align: 'center' });

      // Save PDF
      doc.save(`Registration_${registration.registrationId}.pdf`);

      toast({
        title: 'Success',
        description: 'Receipt downloaded successfully!'
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <i className="fas fa-check-circle text-6xl text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Registration Successful!</h1>
          <p className="text-muted-foreground">Your registration has been confirmed and payment verified</p>
        </div>

        <Card className="rounded-[3rem]">
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
              <h3 className="font-semibold text-lg mb-4">Parent/Guardian Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Parent Name</p>
                  <p className="font-semibold">{registration.parentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{registration.parentPhone}</p>
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
              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold">Online (UPI)</span>
                </div>
                {registration.paymentAmount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold">₹{registration.paymentAmount}</span>
                  </div>
                )}
                {registration.paymentTimestamp && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Time</span>
                    <span className="font-semibold">{formatDate(registration.paymentTimestamp)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                  <span>Total Fee Paid</span>
                  <span className="text-primary">₹{registration.totalFee}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
              <p>Registration Date: {formatDate(registration.createdAt)}</p>
              <p className="mt-2">Please bring this receipt on the day of the event</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-8">
          <Button onClick={handleDownloadPDF} className="flex-1 rounded-[3rem]" size="lg">
            <i className="fas fa-download mr-2" />
            Download PDF Receipt
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="flex-1 rounded-[3rem]" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

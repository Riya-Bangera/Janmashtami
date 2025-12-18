import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { calculateAge, getAgeGroup, calculateFee, generateRegistrationId } from '@/lib/utils';
import { AgeGroup, PaymentMethod, RegistrationStatus } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

export default function Register() {
  const navigate = useNavigate();
  const { data, addRegistration } = useApp();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    age: 0,
    ageGroup: AgeGroup.Kids,
    selectedCompetitions: [] as string[],
    totalFee: 0,
    paymentScreenshot: '',
    paymentAmount: '',
    paymentTimestamp: ''
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dateOfBirth || !formData.parentName || !formData.parentPhone) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields including parent information',
        variant: 'destructive'
      });
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.parentPhone)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive'
      });
      return;
    }

    const age = calculateAge(formData.dateOfBirth);
    const ageGroup = getAgeGroup(age);
    
    setFormData(prev => ({ ...prev, age, ageGroup }));
    setStep(2);
  };

  const handleEventSelection = () => {
    if (formData.selectedCompetitions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one competition',
        variant: 'destructive'
      });
      return;
    }

    const totalFee = calculateFee(data.competitions, formData.selectedCompetitions);
    setFormData(prev => ({ ...prev, totalFee }));
    setStep(3);
  };

  const handleCompetitionToggle = (competitionId: string) => {
    setFormData(prev => {
      const selected = prev.selectedCompetitions.includes(competitionId)
        ? prev.selectedCompetitions.filter(id => id !== competitionId)
        : [...prev.selectedCompetitions, competitionId];
      return { ...prev, selectedCompetitions: selected };
    });
  };

  const handlePaymentScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, paymentScreenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    if (!formData.paymentScreenshot) {
      toast({
        title: 'Error',
        description: 'Please upload payment screenshot',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.paymentAmount || !formData.paymentTimestamp) {
      toast({
        title: 'Error',
        description: 'Please enter payment amount and timestamp',
        variant: 'destructive'
      });
      return;
    }

    // Verify payment amount matches total fee
    const enteredAmount = parseFloat(formData.paymentAmount);
    if (isNaN(enteredAmount) || enteredAmount !== formData.totalFee) {
      toast({
        title: 'Payment Verification Failed',
        description: `Payment amount (₹${enteredAmount}) does not match total fee (₹${formData.totalFee}). Please verify and enter the correct amount.`,
        variant: 'destructive'
      });
      return;
    }

    // Validate payment timestamp format and reasonableness
    const paymentDate = new Date(formData.paymentTimestamp);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (isNaN(paymentDate.getTime())) {
      toast({
        title: 'Error',
        description: 'Invalid payment timestamp format',
        variant: 'destructive'
      });
      return;
    }

    if (paymentDate > now) {
      toast({
        title: 'Payment Verification Failed',
        description: 'Payment timestamp cannot be in the future',
        variant: 'destructive'
      });
      return;
    }

    if (paymentDate < oneWeekAgo) {
      toast({
        title: 'Payment Verification Failed',
        description: 'Payment timestamp is too old (more than 7 days ago). Please contact support if this is a valid payment.',
        variant: 'destructive'
      });
      return;
    }

    const registrationId = generateRegistrationId();
    
    addRegistration({
      registrationId,
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      age: formData.age,
      ageGroup: formData.ageGroup,
      competitions: formData.selectedCompetitions,
      totalFee: formData.totalFee,
      paymentMethod: PaymentMethod.Online,
      paymentScreenshot: formData.paymentScreenshot,
      paymentAmount: enteredAmount,
      paymentTimestamp: formData.paymentTimestamp,
      status: RegistrationStatus.Confirmed,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone
    });

    toast({
      title: 'Success',
      description: 'Registration completed successfully! Payment verified.'
    });

    navigate(`/registration-confirmation/${registrationId}`);
  };

  const availableCompetitions = data.competitions.filter(comp =>
    comp.ageGroups.includes(formData.ageGroup)
  );

  if (!data.settings.registrationOpen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-[3rem]">
          <CardHeader>
            <CardTitle className="text-center">Registration Closed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Registration is currently closed. Please check back later.
            </p>
            <Button onClick={() => navigate('/')} className="rounded-[3rem]">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <i className="fas fa-spa text-5xl text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-2">Competition Registration</h1>
          <p className="text-muted-foreground">Step {step} of 3</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="rounded-[3rem]">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Participant's Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-[3rem]"
                    placeholder="Enter participant's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="rounded-[3rem]"
                    required
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="parentName">Parent's Full Name</Label>
                      <Input
                        id="parentName"
                        value={formData.parentName}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                        className="rounded-[3rem]"
                        placeholder="Enter parent's name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Parent's Phone Number</Label>
                      <Input
                        id="parentPhone"
                        type="tel"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                        className="rounded-[3rem]"
                        placeholder="10-digit phone number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter 10-digit phone number without spaces or special characters
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-[3rem]" size="lg">
                  Next
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="rounded-[3rem]">
            <CardHeader>
              <CardTitle>Select Competitions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Age: {formData.age} years | Category: {formData.ageGroup}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {availableCompetitions.map((comp) => (
                  <div key={comp.id} className="flex items-start space-x-3 p-4 border rounded-[3rem] hover:bg-accent/50">
                    <Checkbox
                      id={comp.id}
                      checked={formData.selectedCompetitions.includes(comp.id)}
                      onCheckedChange={() => handleCompetitionToggle(comp.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={comp.id} className="cursor-pointer font-semibold">
                        {comp.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Time: {comp.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-[3rem]">
                  Back
                </Button>
                <Button onClick={handleEventSelection} className="flex-1 rounded-[3rem]">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="rounded-[3rem]">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> After making the payment, please enter the exact amount and timestamp from your payment confirmation to verify your transaction.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <p className="text-2xl font-bold mb-2">Total Fee: ₹{formData.totalFee}</p>
                <p className="text-sm text-muted-foreground mb-4">UPI ID: {data.settings.upiId}</p>
                <div className="flex justify-center mb-4">
                  <QRCodeDataUrl text={`upi://pay?pa=${data.settings.upiId}&am=${formData.totalFee}`} width={200} />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Payment Verification</h3>
                
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount (₹)</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={formData.paymentAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentAmount: e.target.value }))}
                    className="rounded-[3rem]"
                    placeholder={`Enter ${formData.totalFee}`}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must match total fee: ₹{formData.totalFee}
                  </p>
                </div>

                <div>
                  <Label htmlFor="paymentTimestamp">Payment Date & Time</Label>
                  <Input
                    id="paymentTimestamp"
                    type="datetime-local"
                    value={formData.paymentTimestamp}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTimestamp: e.target.value }))}
                    className="rounded-[3rem]"
                    max={new Date().toISOString().slice(0, 16)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the exact date and time shown in your payment confirmation
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentScreenshot}
                  className="rounded-[3rem]"
                  required
                />
                {formData.paymentScreenshot && (
                  <div className="mt-4">
                    <img src={formData.paymentScreenshot} alt="Payment" className="max-w-xs mx-auto rounded-[3rem]" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-[3rem]">
                  Back
                </Button>
                <Button onClick={handleFinalSubmit} className="flex-1 rounded-[3rem]">
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { UserRole, AgeGroup, PaymentMethod, RegistrationStatus } from '@/types/types';
import { calculateAge, getAgeGroup, calculateFee, generateRegistrationId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminRegistrations() {
  const navigate = useNavigate();
  const { currentUser, data, addRegistration } = useApp();
  const { toast } = useToast();
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');
  const [filterCompetition, setFilterCompetition] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parentName: '',
    parentPhone: '',
    selectedCompetitions: [] as string[],
    paymentMethod: PaymentMethod.Cash
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const filteredRegistrations = data.registrations.filter(reg => {
    if (filterAgeGroup !== 'all' && reg.ageGroup !== filterAgeGroup) return false;
    if (filterCompetition !== 'all' && !reg.competitions.includes(filterCompetition)) return false;
    return true;
  });

  const handleCompetitionToggle = (competitionId: string) => {
    setFormData(prev => {
      const selected = prev.selectedCompetitions.includes(competitionId)
        ? prev.selectedCompetitions.filter(id => id !== competitionId)
        : [...prev.selectedCompetitions, competitionId];
      return { ...prev, selectedCompetitions: selected };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || formData.selectedCompetitions.length === 0 || !formData.parentName || !formData.parentPhone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 100) {
      toast({
        title: 'Error',
        description: 'Please enter a valid age (1-100)',
        variant: 'destructive'
      });
      return;
    }

    const ageGroup = getAgeGroup(age);
    const totalFee = calculateFee(data.competitions, formData.selectedCompetitions);
    const registrationId = generateRegistrationId();

    // Calculate approximate date of birth (current year - age)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const approximateDOB = `${birthYear}-01-01`;

    addRegistration({
      registrationId,
      name: formData.name,
      dateOfBirth: approximateDOB,
      age,
      ageGroup,
      competitions: formData.selectedCompetitions,
      totalFee,
      paymentMethod: formData.paymentMethod,
      status: RegistrationStatus.Confirmed,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone
    });

    toast({
      title: 'Success',
      description: 'On-spot registration added successfully'
    });

    setFormData({
      name: '',
      age: '',
      parentName: '',
      parentPhone: '',
      selectedCompetitions: [],
      paymentMethod: PaymentMethod.Cash
    });
    setDialogOpen(false);
  };

  const getCompetitionNames = (competitionIds: string[]) => {
    return competitionIds
      .map(id => data.competitions.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleViewProof = (screenshot?: string) => {
    if (screenshot) {
      setSelectedProof(screenshot);
      setProofDialogOpen(true);
    } else {
      toast({
        title: 'No Proof Available',
        description: 'This registration does not have a payment screenshot',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left mr-2" />
            </Button>
            <h1 className="text-2xl font-bold">Registration Management</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Label>Filter by Age Group</Label>
            <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
              <SelectTrigger className="rounded-[3rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Age Groups</SelectItem>
                <SelectItem value={AgeGroup.Kids}>{AgeGroup.Kids}</SelectItem>
                <SelectItem value={AgeGroup.Juniors}>{AgeGroup.Juniors}</SelectItem>
                <SelectItem value={AgeGroup.Teens}>{AgeGroup.Teens}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label>Filter by Competition</Label>
            <Select value={filterCompetition} onValueChange={setFilterCompetition}>
              <SelectTrigger className="rounded-[3rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Competitions</SelectItem>
                {data.competitions.map(comp => (
                  <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-[3rem]">
                  <i className="fas fa-plus mr-2" />
                  On-Spot Registration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add On-Spot Registration</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Child's Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="rounded-[3rem]"
                      placeholder="Enter child's name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="rounded-[3rem]"
                      placeholder="Enter age"
                      required
                    />
                    {formData.age && parseInt(formData.age) > 0 && (
                      <div className="mt-2 p-3 bg-muted rounded-[3rem] text-sm">
                        <p><strong>Age:</strong> {formData.age} years</p>
                        <p><strong>Age Group:</strong> {getAgeGroup(parseInt(formData.age))}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="parentName">Parent's Name</Label>
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
                    <Label htmlFor="parentPhone">WhatsApp Number</Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                      className="rounded-[3rem]"
                      placeholder="Enter WhatsApp number"
                      required
                    />
                  </div>
                  <div>
                    <Label>Select Competitions (Based on Age Group)</Label>
                    <div className="space-y-2 mt-2">
                      {formData.age && parseInt(formData.age) > 0 && data.competitions
                        .filter(comp => comp.ageGroups.includes(getAgeGroup(parseInt(formData.age))))
                        .map((comp) => (
                          <div key={comp.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`comp-${comp.id}`}
                              checked={formData.selectedCompetitions.includes(comp.id)}
                              onCheckedChange={() => handleCompetitionToggle(comp.id)}
                            />
                            <Label htmlFor={`comp-${comp.id}`} className="cursor-pointer">
                              {comp.name}
                            </Label>
                          </div>
                        ))}
                      {(!formData.age || parseInt(formData.age) <= 0) && (
                        <p className="text-sm text-muted-foreground">Please enter age first</p>
                      )}
                    </div>
                  </div>
                  {formData.selectedCompetitions.length > 0 && (
                    <div className="p-4 bg-primary/10 rounded-[3rem]">
                      <p className="text-lg font-bold">
                        Total Fee: ₹{calculateFee(data.competitions, formData.selectedCompetitions)}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                    >
                      <SelectTrigger className="rounded-[3rem]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentMethod.Cash}>Paid Cash</SelectItem>
                        <SelectItem value={PaymentMethod.Online}>Paid Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full rounded-[3rem]">
                    Add Registration
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="rounded-[3rem]">
          <CardHeader>
            <CardTitle>All Registrations ({filteredRegistrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Competitions</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-mono text-sm">{reg.registrationId}</TableCell>
                      <TableCell className="font-semibold">{reg.name}</TableCell>
                      <TableCell>{reg.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-[3rem]">{reg.ageGroup}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{getCompetitionNames(reg.competitions)}</TableCell>
                      <TableCell>₹{reg.totalFee}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={reg.paymentMethod === PaymentMethod.Online ? 'default' : 'secondary'}
                          className="rounded-[3rem] capitalize"
                        >
                          {reg.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={reg.status === RegistrationStatus.Confirmed ? 'default' : 'outline'}
                          className="rounded-[3rem] capitalize"
                        >
                          {reg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reg.paymentMethod === PaymentMethod.Online && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewProof(reg.paymentScreenshot)}
                            className="rounded-[3rem]"
                          >
                            <i className="fas fa-image mr-2" />
                            View Proof
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={proofDialogOpen} onOpenChange={setProofDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Proof</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4">
              {selectedProof && (
                <img 
                  src={selectedProof} 
                  alt="Payment Screenshot" 
                  className="max-w-full max-h-[70vh] object-contain rounded-[3rem]"
                />
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setProofDialogOpen(false)} className="rounded-[3rem]">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

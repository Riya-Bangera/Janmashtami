import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { UserRole, AgeGroup, type Rubric } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminCompetitions() {
  const navigate = useNavigate();
  const { currentUser, data, addCompetition, updateCompetition, deleteCompetition } = useApp();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    time: '',
    fee: 100,
    additionalFee: 50,
    ageGroups: [] as AgeGroup[],
    rubrics: [{ id: 'r1', name: '', maxScore: 10 }] as Rubric[]
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleAgeGroupToggle = (ageGroup: AgeGroup) => {
    setFormData(prev => {
      const groups = prev.ageGroups.includes(ageGroup)
        ? prev.ageGroups.filter(g => g !== ageGroup)
        : [...prev.ageGroups, ageGroup];
      return { ...prev, ageGroups: groups };
    });
  };

  const handleRubricChange = (index: number, field: 'name' | 'maxScore', value: string | number) => {
    setFormData(prev => {
      const rubrics = [...prev.rubrics];
      rubrics[index] = { ...rubrics[index], [field]: value };
      return { ...prev, rubrics };
    });
  };

  const addRubric = () => {
    setFormData(prev => ({
      ...prev,
      rubrics: [...prev.rubrics, { id: `r${prev.rubrics.length + 1}`, name: '', maxScore: 10 }]
    }));
  };

  const removeRubric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rubrics: prev.rubrics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.ageGroups.length === 0 || formData.rubrics.some(r => !r.name)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addCompetition({
      name: formData.name,
      time: formData.time,
      fee: formData.fee,
      additionalFee: formData.additionalFee,
      ageGroups: formData.ageGroups,
      rubrics: formData.rubrics
    });

    toast({
      title: 'Success',
      description: 'Competition added successfully'
    });

    setFormData({
      name: '',
      time: '',
      fee: 100,
      additionalFee: 50,
      ageGroups: [],
      rubrics: [{ id: 'r1', name: '', maxScore: 10 }]
    });
    setDialogOpen(false);
  };

  const handleDelete = (competitionId: string) => {
    if (confirm('Are you sure you want to delete this competition?')) {
      deleteCompetition(competitionId);
      toast({
        title: 'Success',
        description: 'Competition deleted successfully'
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
            <h1 className="text-2xl font-bold">Competition Management</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-end mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-[3rem]">
                <i className="fas fa-plus mr-2" />
                Add Competition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Competition</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Competition Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-[3rem]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="rounded-[3rem]"
                    placeholder="e.g., 10:00 AM"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fee">Base Fee (₹)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData(prev => ({ ...prev, fee: Number(e.target.value) }))}
                      className="rounded-[3rem]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="additionalFee">Additional Fee (₹)</Label>
                    <Input
                      id="additionalFee"
                      type="number"
                      value={formData.additionalFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalFee: Number(e.target.value) }))}
                      className="rounded-[3rem]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Age Groups</Label>
                  <div className="space-y-2 mt-2">
                    {Object.values(AgeGroup).map((group) => (
                      <div key={group} className="flex items-center space-x-2">
                        <Checkbox
                          id={`age-${group}`}
                          checked={formData.ageGroups.includes(group)}
                          onCheckedChange={() => handleAgeGroupToggle(group)}
                        />
                        <Label htmlFor={`age-${group}`} className="cursor-pointer">
                          {group}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Scoring Rubrics</Label>
                    <Button type="button" size="sm" onClick={addRubric} className="rounded-[3rem]">
                      <i className="fas fa-plus mr-2" />
                      Add Rubric
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.rubrics.map((rubric, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label>Rubric Name</Label>
                          <Input
                            value={rubric.name}
                            onChange={(e) => handleRubricChange(index, 'name', e.target.value)}
                            className="rounded-[3rem]"
                            placeholder="e.g., Voice Quality"
                            required
                          />
                        </div>
                        <div className="w-32">
                          <Label>Max Score</Label>
                          <Input
                            type="number"
                            value={rubric.maxScore}
                            onChange={(e) => handleRubricChange(index, 'maxScore', Number(e.target.value))}
                            className="rounded-[3rem]"
                            required
                          />
                        </div>
                        {formData.rubrics.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeRubric(index)}
                            className="rounded-[3rem]"
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-[3rem]">
                  Add Competition
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="rounded-[3rem]">
          <CardHeader>
            <CardTitle>All Competitions ({data.competitions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Age Groups</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Rubrics</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.competitions.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-semibold">{comp.name}</TableCell>
                      <TableCell>{comp.time}</TableCell>
                      <TableCell>{comp.ageGroups.join(', ')}</TableCell>
                      <TableCell>₹{comp.fee} / ₹{comp.additionalFee}</TableCell>
                      <TableCell>{comp.rubrics.length} rubrics</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(comp.id)}
                          className="rounded-[3rem]"
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

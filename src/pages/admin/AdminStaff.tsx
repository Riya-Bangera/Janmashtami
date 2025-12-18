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
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminStaff() {
  const navigate = useNavigate();
  const { currentUser, data, addUser, updateUser, deleteUser } = useApp();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: UserRole.Judge,
    assignedCompetitions: [] as string[]
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Admin) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const staff = data.users.filter(u => u.role === UserRole.Judge || u.role === UserRole.Host);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addUser({
      username: formData.username,
      password: formData.password,
      role: formData.role,
      assignedCompetitions: formData.role === UserRole.Judge ? formData.assignedCompetitions : undefined
    });

    toast({
      title: 'Success',
      description: 'Staff member added successfully'
    });

    setFormData({
      username: '',
      password: '',
      role: UserRole.Judge,
      assignedCompetitions: []
    });
    setDialogOpen(false);
  };

  const handleEdit = (userId: string) => {
    const user = data.users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(userId);
      setFormData({
        username: user.username,
        password: user.password,
        role: user.role,
        assignedCompetitions: user.assignedCompetitions || []
      });
      setEditDialogOpen(true);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    updateUser(selectedUser, {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      assignedCompetitions: formData.role === UserRole.Judge ? formData.assignedCompetitions : undefined
    });

    toast({
      title: 'Success',
      description: 'Staff member updated successfully'
    });

    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteUser(userId);
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully'
      });
    }
  };

  const handleCompetitionToggle = (competitionId: string) => {
    setFormData(prev => {
      const assigned = prev.assignedCompetitions.includes(competitionId)
        ? prev.assignedCompetitions.filter(id => id !== competitionId)
        : [...prev.assignedCompetitions, competitionId];
      return { ...prev, assignedCompetitions: assigned };
    });
  };

  const getCompetitionNames = (competitionIds?: string[]) => {
    if (!competitionIds || competitionIds.length === 0) return 'N/A';
    return competitionIds
      .map(id => data.competitions.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left mr-2" />
            </Button>
            <h1 className="text-3xl font-bold uppercase tracking-wide">Staff Management</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-[3rem] bg-[#ffa500] hover:bg-[#ff8c00] text-white px-6 py-6 text-base font-bold uppercase">
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="rounded-[3rem]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="rounded-[3rem]"
                    required
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                  >
                    <SelectTrigger className="rounded-[3rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.Judge}>Judge</SelectItem>
                      <SelectItem value={UserRole.Host}>Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === UserRole.Judge && (
                  <div>
                    <Label>Assign Competitions</Label>
                    <div className="space-y-2 mt-2">
                      {data.competitions.map((comp) => (
                        <div key={comp.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`comp-${comp.id}`}
                            checked={formData.assignedCompetitions.includes(comp.id)}
                            onCheckedChange={() => handleCompetitionToggle(comp.id)}
                          />
                          <Label htmlFor={`comp-${comp.id}`} className="cursor-pointer">
                            {comp.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full rounded-[3rem]">
                  Add Staff Member
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {staff.map((user) => (
            <Card key={user.id} className="rounded-[3rem] border-2 bg-muted/30 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold uppercase mb-2">{user.username}</h2>
                    <div className="inline-block bg-[#ffa500] text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                      {user.role}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(user.id)}
                      className="rounded-full w-10 h-10 p-0 text-blue-600 hover:bg-blue-50"
                    >
                      <i className="fas fa-edit text-lg" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(user.id)}
                      className="rounded-full w-10 h-10 p-0 text-red-600 hover:bg-red-50"
                    >
                      <i className="fas fa-trash text-lg" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  <span className="font-semibold">PWD:</span> {user.password}
                </div>

                {user.role === UserRole.Judge && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                      Assign Competitions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        value={user.assignedCompetitions?.[0] || ''}
                        onValueChange={(value) => {
                          const currentAssignments = user.assignedCompetitions || [];
                          if (value && !currentAssignments.includes(value)) {
                            updateUser(user.id, {
                              assignedCompetitions: [...currentAssignments, value]
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-[3rem] border-2 border-black">
                          <SelectValue placeholder="-- CATEGORY --" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...new Set(data.competitions.flatMap(c => c.ageGroups))].map((ageGroup) => (
                            <SelectItem key={ageGroup} value={ageGroup}>
                              {ageGroup}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select
                        value=""
                        onValueChange={(value) => {
                          const currentAssignments = user.assignedCompetitions || [];
                          if (value && !currentAssignments.includes(value)) {
                            updateUser(user.id, {
                              assignedCompetitions: [...currentAssignments, value]
                            });
                            toast({
                              title: 'Success',
                              description: 'Competition assigned successfully'
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="rounded-[3rem] border-2">
                          <SelectValue placeholder="-- EVENT --" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.competitions.map((comp) => (
                            <SelectItem key={comp.id} value={comp.id}>
                              {comp.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {user.assignedCompetitions && user.assignedCompetitions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Assigned Events:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.assignedCompetitions.map((compId) => {
                            const comp = data.competitions.find(c => c.id === compId);
                            return comp ? (
                              <div key={compId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                {comp.name}
                                <button
                                  onClick={() => {
                                    updateUser(user.id, {
                                      assignedCompetitions: user.assignedCompetitions?.filter(id => id !== compId)
                                    });
                                  }}
                                  className="hover:text-destructive"
                                >
                                  <i className="fas fa-times" />
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="rounded-[3rem]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="rounded-[3rem]"
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger className="rounded-[3rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.Judge}>Judge</SelectItem>
                    <SelectItem value={UserRole.Host}>Host</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === UserRole.Judge && (
                <div>
                  <Label>Assign Competitions</Label>
                  <div className="space-y-2 mt-2">
                    {data.competitions.map((comp) => (
                      <div key={comp.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-comp-${comp.id}`}
                          checked={formData.assignedCompetitions.includes(comp.id)}
                          onCheckedChange={() => handleCompetitionToggle(comp.id)}
                        />
                        <Label htmlFor={`edit-comp-${comp.id}`} className="cursor-pointer">
                          {comp.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full rounded-[3rem]">
                Update Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

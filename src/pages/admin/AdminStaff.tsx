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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <i className="fas fa-arrow-left mr-2" />
            </Button>
            <h1 className="text-2xl font-bold">Staff Management</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-end mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-[3rem]">
                <i className="fas fa-plus mr-2" />
                Add Staff Member
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

        <Card className="rounded-[3rem]">
          <CardHeader>
            <CardTitle>Staff Members ({staff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned Competitions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold">{user.username}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="max-w-xs truncate">{getCompetitionNames(user.assignedCompetitions)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user.id)}
                            className="rounded-[3rem]"
                          >
                            <i className="fas fa-edit" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user.id)}
                            className="rounded-[3rem]"
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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

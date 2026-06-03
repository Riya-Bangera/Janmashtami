import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/types';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(username, password);

      if (user && user.role === UserRole.Admin) {
        toast({
          title: 'Success',
          description: 'Logged in successfully'
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: 'Error',
          description: 'Invalid credentials or insufficient permissions',
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-[3rem]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <i className="fas fa-user-shield text-5xl text-primary" />
          </div>
          <CardTitle className="text-3xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <Label htmlFor="admin-login-username">Username</Label>
              <Input
                id="admin-login-username"
                name="admin-login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-[3rem]"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-login-password">Password</Label>
              <Input
                id="admin-login-password"
                name="admin-login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-[3rem]"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-password" 
                checked={showPassword}
                onCheckedChange={(checked) => setShowPassword(checked as boolean)}
              />
              <Label 
                htmlFor="show-password" 
                className="text-sm font-normal cursor-pointer"
              >
                Show Password
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full rounded-[3rem]"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full rounded-[3rem]"
            >
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  onSuccess: () => void;
  title: string;
  storageKey: string;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onSuccess, title, storageKey }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 检查是否已经验证过密码
    const isAuthenticated = sessionStorage.getItem(storageKey);
    if (isAuthenticated === 'true') {
      onSuccess();
    }
  }, [onSuccess, storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      // 保存验证状态到sessionStorage
      sessionStorage.setItem(storageKey, 'true');
      onSuccess();
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
          <p className="text-gray-600 mt-2">请输入访问密码</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              确认
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordProtection;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PasswordProtection from '@/components/lottery/PasswordProtection';
import { api } from '@/db/supabase';
import type { User } from '@/types/types';
import { Users, Calendar, RefreshCw } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const userList = await api.getAllUsers();
      setUsers(userList);
      toast({
        title: "数据加载成功",
        description: `已加载${userList.length}位用户信息`,
        variant: "default"
      });
    } catch (error) {
      console.error('加载用户列表失败:', error);
      toast({
        title: "加载失败",
        description: "用户数据加载失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length !== 11) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
  };

  if (!isAuthenticated) {
    return (
      <PasswordProtection
        onSuccess={() => setIsAuthenticated(true)}
        title="用户管理"
        storageKey="user-management-auth"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                用户管理
              </h1>
              <p className="text-gray-600 text-lg">
                查看所有报名参与抽奖的用户信息
              </p>
            </div>
            <Button
              onClick={loadUsers}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">总报名人数</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">今日报名</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => {
                    const today = new Date().toDateString();
                    const userDate = new Date(user.created_at).toDateString();
                    return today === userDate;
                  }).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">最近更新</p>
                <p className="text-sm font-bold text-gray-900">
                  {users.length > 0 ? formatDate(users[0].created_at).split(' ')[1] : '--:--:--'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 用户列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              用户列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">加载中...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg">暂无用户报名</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">序号</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">手机号码</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">报名时间</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-gray-900">
                            {maskPhoneNumber(user.phone)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            已报名
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
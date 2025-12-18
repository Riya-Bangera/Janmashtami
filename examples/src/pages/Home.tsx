import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Gift, Users, Settings, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { api as dbApi } from '@/db/supabase';

const Home: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 监听倒计时结束，自动重置验证码状态
  useEffect(() => {
    if (countdown === 0 && isCodeSent) {
      // 倒计时结束，清除验证码相关状态
      setCode('');
      setSessionId('');
      setIsCodeSent(false);
    }
  }, [countdown, isCodeSent]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const sendCode = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: "错误",
        description: "请输入正确的手机号码",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // 检查手机号是否已注册
      const existingUser = await dbApi.getUserByPhone(phone);
      if (existingUser) {
        setIsLoading(false);
        toast({
          title: "⚠️ 已注册用户",
          description: "该手机号已注册，无需重复注册。您已可以参与抽奖活动！",
          variant: "default"
        });
        return;
      }

      const newSessionId = crypto.randomUUID();
      const response = await api.sendSmsCode({
        phone,
        sessionId: newSessionId
      });

      if (response.status === 0) {
        setSessionId(newSessionId);
        setIsCodeSent(true);
        setCountdown(60);
        setCode(''); // 重置验证码输入
        
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "验证码已发送",
          description: "请查收短信验证码",
        });
      } else {
        toast({
          title: "发送失败",
          description: response.msg || "验证码发送失败，请重试",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      toast({
        title: "发送失败",
        description: error.response?.data?.msg || "网络错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      toast({
        title: "❌ 验证失败",
        description: "请输入6位验证码",
        variant: "destructive"
      });
      return;
    }

    // 检查验证码是否超时
    if (countdown === 0) {
      toast({
        title: "❌ 验证失败",
        description: "验证码已超时，请重新获取验证码",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.verifySmsCode({
        sessionId,
        phoneCode: code,
        phone
      });

      if (response.status === 0) {
        // 验证成功，保存用户信息
        const existingUser = await dbApi.getUserByPhone(phone);
        if (!existingUser) {
          await dbApi.createUser(phone);
        }

        toast({
          title: "🎉 报名成功！",
          description: "恭喜您成功报名百度云智大会抽奖活动！请等待抽奖开始。",
          variant: "default"
        });

        // 重置表单
        setPhone('');
        setCode('');
        setSessionId('');
        setIsCodeSent(false);
        setCountdown(0);

      } else {
        toast({
          title: "❌ 验证失败",
          description: "验证码错误，请填写正确验证码",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('验证失败:', error);
      toast({
        title: "❌ 验证失败",
        description: "验证码错误，请填写正确验证码",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Registration */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧标题和介绍 */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                百度云智大会
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                精彩抽奖活动等您参与
              </p>
              <div className="flex justify-start space-x-8 text-center">
                <div className="flex flex-col items-center">

                </div>
                <div className="flex flex-col items-center">

                </div>
                <div className="flex flex-col items-center">

                </div>
              </div>
            </div>

            {/* 右侧报名表单 */}
            <div>
              <Card className="shadow-2xl border-0">
                <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="text-3xl font-bold">抽奖报名</CardTitle>
                  <p className="text-white/90 mt-2">输入手机号码参与抽奖活动</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        手机号码
                      </label>
                      <Input
                        type="tel"
                        placeholder="请输入11位手机号码"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="text-lg h-12"
                        disabled={isLoading}
                      />
                    </div>

                    {isCodeSent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          验证码
                          {countdown > 0 && (
                            <span className="text-blue-600 ml-2">({countdown}s后过期)</span>
                          )}
                          {countdown === 0 && (
                            <span className="text-red-600 ml-2">(已过期，请重新获取)</span>
                          )}
                        </label>
                        <div className="flex space-x-3">
                          <Input
                            type="text"
                            placeholder="请输入6位验证码"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="text-lg h-12"
                            disabled={isLoading}
                          />
                          <Button
                            onClick={sendCode}
                            disabled={countdown > 0 || isLoading}
                            variant="outline"
                            className="h-12 px-6 whitespace-nowrap"
                          >
                            {countdown > 0 ? `${countdown}s` : '重新发送'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {!isCodeSent ? (
                      <Button
                        onClick={sendCode}
                        disabled={!phone || isLoading}
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isLoading ? '发送中...' : '获取验证码'}
                      </Button>
                    ) : (
                      <Button
                        onClick={verifyCode}
                        disabled={!code || isLoading || countdown === 0}
                        className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {isLoading ? '验证中...' : countdown === 0 ? '验证码已过期' : '确认报名'}
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-gray-500 space-y-1">
                    <p>• 每个手机号只能报名一次</p>
                    <p>• 报名成功后即可参与抽奖</p>
                    <p>• 抽奖结果将实时公布</p>
                    <p>• 验证码有效期60秒</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* 管理入口 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">管理入口</h2>
          <p className="text-gray-600 text-lg">抽奖管理和用户管理功能</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/lottery">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300 h-full">
              <CardContent className="flex items-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">抽奖管理</h3>
                  <p className="text-gray-600 text-lg">进入抽奖页面，开始精彩抽奖</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300 h-full">
              <CardContent className="flex items-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-6">
                  <Settings className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">用户管理</h3>
                  <p className="text-gray-600 text-lg">查看和管理报名用户信息</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
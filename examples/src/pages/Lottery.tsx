import React, { useState } from 'react';
import PasswordProtection from '@/components/lottery/PasswordProtection';
import LotteryWheel from '@/components/lottery/LotteryWheel';

const Lottery: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <PasswordProtection
        onSuccess={() => setIsAuthenticated(true)}
        title="抽奖管理"
        storageKey="lottery-auth"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            百度云智大会抽奖系统
          </h1>
          <p className="text-gray-600 text-lg">
            公平、透明、精彩的抽奖体验
          </p>
        </div>
        <LotteryWheel />
      </div>
    </div>
  );
};

export default Lottery;
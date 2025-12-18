import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/supabase';
import type { User, LotteryResult } from '@/types/types';

const LotteryWheel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [lotteryCount, setLotteryCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentNumbers, setCurrentNumbers] = useState<string[]>([]);
  const [winners, setWinners] = useState<LotteryResult[]>([]);
  const [allWinners, setAllWinners] = useState<LotteryResult[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    loadAllWinners();
    loadCurrentRound();
  }, []);

  useEffect(() => {
    // 根据抽奖人数初始化显示栏数
    setCurrentNumbers(Array(lotteryCount).fill('0000'));
  }, [lotteryCount]);

  const loadUsers = async () => {
    const userList = await api.getAllUsers();
    setUsers(userList);
  };

  const loadAllWinners = async () => {
    const records = await api.getAllLotteryRecords();
    const winnerResults: LotteryResult[] = [];
    
    for (const record of records) {
      // 根据user_id查找完整的用户信息
      const user = users.find(u => u.id === record.user_id) || 
                   await getUserById(record.user_id);
      
      if (user) {
        winnerResults.push({
          user,
          phone_tail: record.phone_tail,
          round_number: record.round_number,
          position: record.position
        });
      }
    }
    
    setAllWinners(winnerResults);
  };

  const getUserById = async (userId: string): Promise<User | null> => {
    // 如果在当前users中找不到，可能需要重新加载用户数据
    const userList = await api.getAllUsers();
    return userList.find(u => u.id === userId) || null;
  };

  const loadCurrentRound = async () => {
    const maxRound = await api.getMaxRoundNumber();
    setCurrentRound(maxRound + 1);
  };

  const generateRandomTail = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length !== 11) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
  };

  const maskPhoneNumberForHistory = (phone: string) => {
    // 历史记录中显示前3位数字 + **** + 后4位
    if (phone.length !== 11) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
  };

  const startLottery = async () => {
    if (users.length === 0) {
      toast({
        title: "错误",
        description: "暂无用户参与抽奖",
        variant: "destructive"
      });
      return;
    }

    if (lotteryCount <= 0 || lotteryCount > users.length) {
      toast({
        title: "错误",
        description: `抽奖人数应在1-${users.length}之间`,
        variant: "destructive"
      });
      return;
    }

    setIsDrawing(true);
    setWinners([]);

    // 随机选择中奖用户
    const shuffled = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffled.slice(0, lotteryCount);

    // 开始所有抽奖栏同时滚动
    await drawAllWinners(selectedUsers);
  };

  const drawAllWinners = async (selectedUsers: User[]) => {
    // 开始所有抽奖栏同时滚动
    const scrollIntervals: NodeJS.Timeout[] = [];
    
    // 为每个抽奖栏创建滚动效果
    for (let i = 0; i < lotteryCount; i++) {
      const interval = setInterval(() => {
        setCurrentNumbers(prev => {
          const newNumbers = [...prev];
          newNumbers[i] = generateRandomTail();
          return newNumbers;
        });
      }, 100); // 每100ms更新一次数字
      
      scrollIntervals.push(interval);
    }

    // 5秒后停止所有滚动
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 清除所有滚动定时器
    scrollIntervals.forEach(interval => clearInterval(interval));

    // 显示最终中奖结果
    const finalNumbers: string[] = [];
    const winnerResults: LotteryResult[] = [];

    for (let i = 0; i < selectedUsers.length; i++) {
      const user = selectedUsers[i];
      const phoneTail = user.phone.slice(-4);
      finalNumbers.push(phoneTail);

      // 保存中奖记录
      await api.createLotteryRecord({
        user_id: user.id,
        phone_tail: phoneTail,
        round_number: currentRound,
        position: i + 1
      });

      const winnerResult: LotteryResult = {
        user,
        phone_tail: phoneTail,
        round_number: currentRound,
        position: i + 1
      };

      winnerResults.push(winnerResult);
    }

    // 设置最终显示的号码和中奖者
    setCurrentNumbers(finalNumbers);
    setWinners(winnerResults);

    // 抽奖完成
    setIsDrawing(false);
    setCurrentRound(prev => prev + 1);
    loadAllWinners();
    
    toast({
      title: "🎉 抽奖完成！",
      description: `第${currentRound}轮抽奖已完成，恭喜所有中奖用户！`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-8">
      {/* 抽奖控制区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            第 {currentRound} 轮抽奖
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <label className="text-lg font-medium">抽奖人数：</label>
            <Input
              type="number"
              min="1"
              max={users.length}
              value={lotteryCount}
              onChange={(e) => setLotteryCount(parseInt(e.target.value) || 1)}
              className="w-20 text-center"
              disabled={isDrawing}
            />
            <span className="text-gray-600">（共{users.length}人参与）</span>
          </div>
          
          <div className="text-center">
            <Button
              onClick={startLottery}
              disabled={isDrawing}
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isDrawing ? '抽奖中...' : '开始抽奖'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 多栏抽奖显示区 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {isDrawing ? '抽奖进行中...' : '中奖号码'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${
            lotteryCount === 1 ? 'grid-cols-1' :
            lotteryCount === 2 ? 'grid-cols-1 md:grid-cols-2' :
            lotteryCount === 3 ? 'grid-cols-1 md:grid-cols-3' :
            lotteryCount === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {Array.from({ length: lotteryCount }, (_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 mb-4 w-full">
                  <div className="text-center">
                    <div className="text-sm text-white/80 mb-2">第{index + 1}名</div>
                    <div className="text-4xl font-bold text-white font-mono tracking-wider">
                      {currentNumbers[index] || '0000'}
                    </div>
                  </div>
                </div>
                {isDrawing && (
                  <div className="text-center text-gray-600">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {isDrawing && (
            <div className="text-center text-gray-600 mt-6">
              <p className="text-lg">抽奖进行中，请稍候...</p>
              <p className="text-sm mt-2">所有抽奖栏同时滚动中，5秒后公布结果</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 当前轮次中奖结果 */}
      {winners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>第 {currentRound - 1} 轮中奖结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg border-2 border-green-200"
                >
                  <div className="text-lg font-bold text-green-700 mb-2">
                    第{winner.position}名
                  </div>
                  <div className="text-2xl font-bold text-green-600 font-mono">
                    {maskPhoneNumber(winner.user.phone)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 历史中奖记录 */}
      {allWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>历史中奖记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(allWinners.map(w => w.round_number)))
                .sort((a, b) => b - a)
                .map(roundNum => (
                  <div key={roundNum} className="border rounded-lg p-4">
                    <h4 className="font-bold mb-3 text-lg">第 {roundNum} 轮</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {allWinners
                        .filter(w => w.round_number === roundNum)
                        .sort((a, b) => a.position - b.position)
                        .map((winner, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                          >
                            <span className="font-medium">第{winner.position}名</span>
                            <span className="font-mono text-lg">{maskPhoneNumberForHistory(winner.user.phone)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LotteryWheel;
import { createClient } from "@supabase/supabase-js";
import type { User, LotteryRecord } from "../types/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const customFetch = async (
  input: string | Request | URL,
  init?: RequestInit // eslint-disable-line no-undef
): Promise<Response> => {
  const urlParts = new URL(String(input));
  let url = urlParts.pathname + urlParts.search;
  if (!/((bce|console).*.baidu.*\.com)$|(\.)?miaoda\.(cn|ai)$/.test(document.location.hostname)) {
    url = url.replace(/(\/miaoda([-_\w]+)?)(\/backend)/, '$1/runtime$3');
  }
  return fetch(url, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: import.meta.env.VITE_SUPABASE_PROXY !== "false" ? customFetch : undefined
  },

  auth: {
    storageKey: (import.meta.env.VITE_APP_ID || "sb") + "-auth-token"
  }
});

export const api = {
  // 用户相关
  async createUser(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ phone }])
        .select()
        .single();
      
      if (error) {
        console.error('创建用户失败:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('创建用户异常:', error);
      return null;
    }
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();
      
      if (error) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('查询用户异常:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('获取用户列表失败:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('获取用户列表异常:', error);
      return [];
    }
  },

  // 抽奖记录相关
  async createLotteryRecord(record: Omit<LotteryRecord, 'id' | 'created_at'>): Promise<LotteryRecord | null> {
    try {
      const { data, error } = await supabase
        .from('lottery_records')
        .insert([record])
        .select()
        .single();
      
      if (error) {
        console.error('创建抽奖记录失败:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('创建抽奖记录异常:', error);
      return null;
    }
  },

  async getAllLotteryRecords(): Promise<LotteryRecord[]> {
    try {
      const { data, error } = await supabase
        .from('lottery_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('获取抽奖记录失败:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('获取抽奖记录异常:', error);
      return [];
    }
  },

  async getLotteryRecordsByRound(roundNumber: number): Promise<LotteryRecord[]> {
    try {
      const { data, error } = await supabase
        .from('lottery_records')
        .select('*')
        .eq('round_number', roundNumber)
        .order('position', { ascending: true });
      
      if (error) {
        console.error('获取轮次抽奖记录失败:', error);
        return [];
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('获取轮次抽奖记录异常:', error);
      return [];
    }
  },

  async getMaxRoundNumber(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('lottery_records')
        .select('round_number')
        .order('round_number', { ascending: false })
        .limit(1);
      
      if (error || !data || data.length === 0) {
        return 0;
      }
      
      return data[0].round_number || 0;
    } catch (error) {
      console.error('获取最大轮次异常:', error);
      return 0;
    }
  }
};
export interface User {
  id: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface LotteryRecord {
  id: string;
  user_id: string;
  phone_tail: string;
  round_number: number;
  position: number;
  created_at: string;
}

export interface LotteryResult {
  user: User;
  phone_tail: string;
  round_number: number;
  position: number;
}
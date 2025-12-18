/*
# 百度云智大会抽奖系统数据库设计

## 1. 新建表
- `users` - 用户信息表
  - `id` (uuid, 主键)
  - `phone` (text, 手机号)
  - `created_at` (timestamp, 创建时间)
  - `updated_at` (timestamp, 更新时间)

- `lottery_records` - 抽奖记录表
  - `id` (uuid, 主键)
  - `user_id` (uuid, 用户ID，外键)
  - `phone_tail` (text, 手机尾号四位)
  - `round_number` (integer, 抽奖轮次)
  - `position` (integer, 在该轮中的位置)
  - `created_at` (timestamp, 中奖时间)

## 2. 安全设置
- 启用所有表的行级安全(RLS)
- 添加公开访问策略，允许所有操作
*/

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建抽奖记录表
CREATE TABLE IF NOT EXISTS lottery_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  phone_tail text NOT NULL,
  round_number integer NOT NULL DEFAULT 1,
  position integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_records ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略
CREATE POLICY "Allow all operations on users"
  ON users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on lottery_records"
  ON lottery_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
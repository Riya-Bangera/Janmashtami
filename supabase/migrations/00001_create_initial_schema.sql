/*
# Sri Krishna Janmashtami Competitions Management System - Initial Schema

## 1. Overview
This migration creates the complete database schema for the competition management system,
enabling multi-device synchronization and real-time data access.

## 2. Tables Created

### 2.1 users
Staff accounts for system access (Admin, Judge, Host)
- `id` (uuid, primary key)
- `username` (text, unique, not null)
- `password` (text, not null) - hashed password
- `role` (user_role enum, not null)
- `assigned_competitions` (text array) - competition IDs assigned to judges
- `created_at` (timestamptz, default: now())

### 2.2 competitions
Event definitions with scoring rubrics
- `id` (text, primary key)
- `name` (text, not null)
- `age_groups` (text array, not null) - Kids, Juniors, Teens
- `time` (text) - scheduled time
- `rubrics` (jsonb, not null) - array of {id, name, maxScore}
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 2.3 registrations
Participant registrations with payment info
- `id` (uuid, primary key)
- `registration_id` (text, unique, not null) - display ID
- `name` (text, not null)
- `date_of_birth` (date, not null)
- `age` (integer, not null)
- `age_group` (text, not null)
- `competitions` (text array, not null) - competition IDs
- `total_fee` (integer, not null)
- `payment_method` (payment_method enum, not null)
- `payment_screenshot` (text) - base64 image
- `payment_amount` (integer)
- `payment_timestamp` (text)
- `status` (registration_status enum, not null)
- `called_to_stage` (boolean, default: false)
- `parent_name` (text, not null)
- `parent_phone` (text, not null)
- `verification_result` (jsonb) - {verified, confidence, reason, transactionId, verifiedAt}
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 2.4 scores
Judge scoring for participants
- `id` (uuid, primary key)
- `registration_id` (text, not null, references registrations)
- `competition_id` (text, not null)
- `judge_id` (uuid, not null, references users)
- `scores` (jsonb, not null) - {rubricId: score}
- `total_score` (numeric, not null)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 2.5 results
Published competition results
- `id` (uuid, primary key)
- `competition_id` (text, unique, not null)
- `rank1` (text, not null) - registration_id
- `rank2` (text, not null) - registration_id
- `rank3` (text, not null) - registration_id
- `published` (boolean, default: false)
- `published_at` (timestamptz)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### 2.6 settings
System configuration
- `id` (integer, primary key, default: 1)
- `upi_id` (text, not null)
- `registration_open` (boolean, default: true)
- `updated_at` (timestamptz, default: now())

## 3. Security

### 3.1 RLS Policies
- All tables have RLS disabled for simplicity (admin panel accessible to all)
- In production, implement proper authentication and role-based policies

### 3.2 Indexes
- Created indexes on frequently queried columns for performance
- Foreign key indexes for join optimization

## 4. Notes
- All timestamps use timestamptz for timezone awareness
- JSONB used for flexible nested data (rubrics, scores, verification)
- Text arrays for multi-value fields (age_groups, competitions, assigned_competitions)
- Enums for type safety on status fields
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'judge', 'host', 'public');
CREATE TYPE payment_method AS ENUM ('cash', 'online');
CREATE TYPE registration_status AS ENUM ('Pending', 'Confirmed', 'Rejected', 'Cancelled');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role NOT NULL,
  assigned_competitions text[],
  created_at timestamptz DEFAULT now()
);

-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id text PRIMARY KEY,
  name text NOT NULL,
  age_groups text[] NOT NULL,
  time text,
  rubrics jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text UNIQUE NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  age integer NOT NULL,
  age_group text NOT NULL,
  competitions text[] NOT NULL,
  total_fee integer NOT NULL,
  payment_method payment_method NOT NULL,
  payment_screenshot text,
  payment_amount integer,
  payment_timestamp text,
  status registration_status NOT NULL DEFAULT 'Pending'::registration_status,
  called_to_stage boolean DEFAULT false,
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  verification_result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text NOT NULL,
  competition_id text NOT NULL,
  judge_id uuid NOT NULL REFERENCES users(id),
  scores jsonb NOT NULL,
  total_score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(registration_id, competition_id, judge_id)
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id text UNIQUE NOT NULL,
  rank1 text NOT NULL,
  rank2 text NOT NULL,
  rank3 text NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  upi_id text NOT NULL DEFAULT 'iskcon@upi',
  registration_open boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO settings (id, upi_id, registration_open)
VALUES (1, 'iskcon@upi', true)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_age_group ON registrations(age_group);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_registration_id ON scores(registration_id);
CREATE INDEX IF NOT EXISTS idx_scores_competition_id ON scores(competition_id);
CREATE INDEX IF NOT EXISTS idx_scores_judge_id ON scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_results_competition_id ON results(competition_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON competitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at
  BEFORE UPDATE ON results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
import { supabase } from './supabase';
import type { User, Competition, Registration, Score, Result, Settings } from '@/types/types';

// ============================================================================
// USERS
// ============================================================================

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    username: row.username,
    password: row.password,
    role: row.role,
    assignedCompetitions: row.assigned_competitions || []
  }));
}

export async function createUser(user: Omit<User, 'id'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: user.username,
      password: user.password,
      role: user.role,
      assigned_competitions: user.assignedCompetitions || []
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  
  return {
    id: data.id,
    username: data.username,
    password: data.password,
    role: data.role,
    assignedCompetitions: data.assigned_competitions || []
  };
}

export async function updateUser(id: string, updates: Partial<User>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.username !== undefined) updateData.username = updates.username;
  if (updates.password !== undefined) updateData.password = updates.password;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.assignedCompetitions !== undefined) updateData.assigned_competitions = updates.assignedCompetitions;
  
  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating user:', error);
    return false;
  }
  
  return true;
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  
  return true;
}

// ============================================================================
// COMPETITIONS
// ============================================================================

export async function getAllCompetitions(): Promise<Competition[]> {
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching competitions:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    ageGroups: row.age_groups,
    time: row.time,
    rubrics: row.rubrics
  }));
}

export async function createCompetition(competition: Competition): Promise<Competition | null> {
  const { data, error } = await supabase
    .from('competitions')
    .insert({
      id: competition.id,
      name: competition.name,
      age_groups: competition.ageGroups,
      time: competition.time,
      rubrics: competition.rubrics
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating competition:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    ageGroups: data.age_groups,
    time: data.time,
    rubrics: data.rubrics
  };
}

export async function updateCompetition(id: string, updates: Partial<Competition>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.ageGroups !== undefined) updateData.age_groups = updates.ageGroups;
  if (updates.time !== undefined) updateData.time = updates.time;
  if (updates.rubrics !== undefined) updateData.rubrics = updates.rubrics;
  
  const { error } = await supabase
    .from('competitions')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating competition:', error);
    return false;
  }
  
  return true;
}

export async function deleteCompetition(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('competitions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting competition:', error);
    return false;
  }
  
  return true;
}

// ============================================================================
// REGISTRATIONS
// ============================================================================

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    registrationId: row.registration_id,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    age: row.age,
    ageGroup: row.age_group,
    competitions: row.competitions,
    totalFee: row.total_fee,
    paymentMethod: row.payment_method,
    paymentScreenshot: row.payment_screenshot,
    paymentAmount: row.payment_amount,
    paymentTimestamp: row.payment_timestamp,
    status: row.status,
    calledToStage: row.called_to_stage,
    parentName: row.parent_name,
    parentPhone: row.parent_phone,
    verificationResult: row.verification_result,
    createdAt: row.created_at
  }));
}

export async function createRegistration(registration: Omit<Registration, 'id'>): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      registration_id: registration.registrationId,
      name: registration.name,
      date_of_birth: registration.dateOfBirth,
      age: registration.age,
      age_group: registration.ageGroup,
      competitions: registration.competitions,
      total_fee: registration.totalFee,
      payment_method: registration.paymentMethod,
      payment_screenshot: registration.paymentScreenshot,
      payment_amount: registration.paymentAmount,
      payment_timestamp: registration.paymentTimestamp,
      status: registration.status,
      called_to_stage: registration.calledToStage || false,
      parent_name: registration.parentName,
      parent_phone: registration.parentPhone,
      verification_result: registration.verificationResult
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating registration:', error);
    return null;
  }
  
  return {
    id: data.id,
    registrationId: data.registration_id,
    name: data.name,
    dateOfBirth: data.date_of_birth,
    age: data.age,
    ageGroup: data.age_group,
    competitions: data.competitions,
    totalFee: data.total_fee,
    paymentMethod: data.payment_method,
    paymentScreenshot: data.payment_screenshot,
    paymentAmount: data.payment_amount,
    paymentTimestamp: data.payment_timestamp,
    status: data.status,
    calledToStage: data.called_to_stage,
    parentName: data.parent_name,
    parentPhone: data.parent_phone,
    verificationResult: data.verification_result,
    createdAt: data.created_at
  };
}

export async function updateRegistration(id: string, updates: Partial<Registration>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.registrationId !== undefined) updateData.registration_id = updates.registrationId;
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.dateOfBirth !== undefined) updateData.date_of_birth = updates.dateOfBirth;
  if (updates.age !== undefined) updateData.age = updates.age;
  if (updates.ageGroup !== undefined) updateData.age_group = updates.ageGroup;
  if (updates.competitions !== undefined) updateData.competitions = updates.competitions;
  if (updates.totalFee !== undefined) updateData.total_fee = updates.totalFee;
  if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
  if (updates.paymentScreenshot !== undefined) updateData.payment_screenshot = updates.paymentScreenshot;
  if (updates.paymentAmount !== undefined) updateData.payment_amount = updates.paymentAmount;
  if (updates.paymentTimestamp !== undefined) updateData.payment_timestamp = updates.paymentTimestamp;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.calledToStage !== undefined) updateData.called_to_stage = updates.calledToStage;
  if (updates.parentName !== undefined) updateData.parent_name = updates.parentName;
  if (updates.parentPhone !== undefined) updateData.parent_phone = updates.parentPhone;
  if (updates.verificationResult !== undefined) updateData.verification_result = updates.verificationResult;
  
  const { error } = await supabase
    .from('registrations')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating registration:', error);
    return false;
  }
  
  return true;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting registration:', error);
    return false;
  }
  
  return true;
}

// ============================================================================
// SCORES
// ============================================================================

export async function getAllScores(): Promise<Score[]> {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    registrationId: row.registration_id,
    competitionId: row.competition_id,
    judgeId: row.judge_id,
    scores: row.scores,
    totalScore: row.total_score,
    createdAt: row.created_at
  }));
}

export async function createScore(score: Omit<Score, 'id'>): Promise<Score | null> {
  const { data, error } = await supabase
    .from('scores')
    .insert({
      registration_id: score.registrationId,
      competition_id: score.competitionId,
      judge_id: score.judgeId,
      scores: score.scores,
      total_score: score.totalScore
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating score:', error);
    return null;
  }
  
  return {
    id: data.id,
    registrationId: data.registration_id,
    competitionId: data.competition_id,
    judgeId: data.judge_id,
    scores: data.scores,
    totalScore: data.total_score,
    createdAt: data.created_at
  };
}

export async function updateScore(id: string, updates: Partial<Score>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.registrationId !== undefined) updateData.registration_id = updates.registrationId;
  if (updates.competitionId !== undefined) updateData.competition_id = updates.competitionId;
  if (updates.judgeId !== undefined) updateData.judge_id = updates.judgeId;
  if (updates.scores !== undefined) updateData.scores = updates.scores;
  if (updates.totalScore !== undefined) updateData.total_score = updates.totalScore;
  
  const { error } = await supabase
    .from('scores')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating score:', error);
    return false;
  }
  
  return true;
}

export async function deleteScore(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting score:', error);
    return false;
  }
  
  return true;
}

// ============================================================================
// RESULTS
// ============================================================================

export async function getAllResults(): Promise<Result[]> {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    competitionId: row.competition_id,
    rank1: row.rank1,
    rank2: row.rank2,
    rank3: row.rank3,
    published: row.published,
    publishedAt: row.published_at
  }));
}

export async function createResult(result: Omit<Result, 'id'>): Promise<Result | null> {
  const { data, error } = await supabase
    .from('results')
    .insert({
      competition_id: result.competitionId,
      rank1: result.rank1,
      rank2: result.rank2,
      rank3: result.rank3,
      published: result.published,
      published_at: result.publishedAt
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating result:', error);
    return null;
  }
  
  return {
    id: data.id,
    competitionId: data.competition_id,
    rank1: data.rank1,
    rank2: data.rank2,
    rank3: data.rank3,
    published: data.published,
    publishedAt: data.published_at
  };
}

export async function updateResult(id: string, updates: Partial<Result>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.competitionId !== undefined) updateData.competition_id = updates.competitionId;
  if (updates.rank1 !== undefined) updateData.rank1 = updates.rank1;
  if (updates.rank2 !== undefined) updateData.rank2 = updates.rank2;
  if (updates.rank3 !== undefined) updateData.rank3 = updates.rank3;
  if (updates.published !== undefined) updateData.published = updates.published;
  if (updates.publishedAt !== undefined) updateData.published_at = updates.publishedAt;
  
  const { error } = await supabase
    .from('results')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating result:', error);
    return false;
  }
  
  return true;
}

export async function deleteResult(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('results')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting result:', error);
    return false;
  }
  
  return true;
}

// ============================================================================
// SETTINGS
// ============================================================================

export async function getSettings(): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  
  if (!data) {
    return {
      upiId: 'iskcon@upi',
      registrationOpen: true
    };
  }
  
  return {
    upiId: data.upi_id,
    registrationOpen: data.registration_open
  };
}

export async function updateSettings(updates: Partial<Settings>): Promise<boolean> {
  const updateData: any = {};
  
  if (updates.upiId !== undefined) updateData.upi_id = updates.upiId;
  if (updates.registrationOpen !== undefined) updateData.registration_open = updates.registrationOpen;
  
  const { error } = await supabase
    .from('settings')
    .update(updateData)
    .eq('id', 1);
  
  if (error) {
    console.error('Error updating settings:', error);
    return false;
  }
  
  return true;
}

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppData, User, Competition, Registration, Score, Result, Settings } from '@/types/types';
import { UserRole, AgeGroup, PaymentMethod, RegistrationStatus } from '@/types/types';
import * as api from '@/db/api';

// ── Google Sheets simultaneous sync ──────────────────────────────────────────
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxdi0DlKVJEDFPxGcb3yIp1T3eFY1ZWatmBiRtMKRYiV9wkpzCh6ON9RZ-5RSHueDKf/exec';

function syncToSheets(table: string, type: 'INSERT' | 'UPDATE' | 'DELETE', record: object) {
  // Fire-and-forget — never blocks the app
  // mode: 'no-cors' is required for Google Apps Script Web App calls from browser
  fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ table, type, record })
  }).catch(() => { /* silently ignore — sheets sync is best-effort backup */ });
}

// Converters: camelCase app types → snake_case for Apps Script (matches Supabase column names)
function regToRow(r: any) {
  return {
    id: r.id, registration_id: r.registrationId, name: r.name,
    date_of_birth: r.dateOfBirth, age: r.age, age_group: r.ageGroup,
    competitions: r.competitions, total_fee: r.totalFee,
    payment_method: r.paymentMethod, status: r.status,
    parent_name: r.parentName, parent_phone: r.parentPhone,
    called_to_stage: r.calledToStage, verification_result: r.verificationResult,
    created_at: r.createdAt
  };
}
function compToRow(c: any) {
  return {
    id: c.id, name: c.name, age_groups: c.ageGroups,
    time: c.time, date: c.date, rubrics: c.rubrics, created_at: c.createdAt
  };
}
function scoreToRow(s: any) {
  return {
    id: s.id, registration_id: s.registrationId, competition_id: s.competitionId,
    judge_id: s.judgeId, scores: s.scores, total_score: s.totalScore, created_at: s.createdAt
  };
}
// ─────────────────────────────────────────────────────────────────────────────

const defaultSettings: Settings = {
  upiId: '9876543210@upi',
  registrationOpen: true
};

const defaultCompetitions: Competition[] = [
  // Krishna Kids (upto 5 years)
  {
    id: 'comp-kids-1',
    name: 'Colouring',
    ageGroups: [AgeGroup.Kids],
    time: '09:30 AM to 10:30 AM',
    rubrics: [
      { id: 'r1', name: 'Creativity', maxScore: 10 },
      { id: 'r2', name: 'Neatness', maxScore: 10 },
      { id: 'r3', name: 'Color Selection', maxScore: 10 }
    ]
  },
  {
    id: 'comp-kids-2',
    name: 'Bhagavad Gita Shloka Recitation',
    ageGroups: [AgeGroup.Kids],
    time: '10:30 AM to 11:30 AM',
    rubrics: [
      { id: 'r1', name: 'Pronunciation', maxScore: 10 },
      { id: 'r2', name: 'Memory', maxScore: 10 },
      { id: 'r3', name: 'Confidence', maxScore: 10 }
    ]
  },
  {
    id: 'comp-kids-3',
    name: 'Fancy Dress (Theme: Krishna Leela)',
    ageGroups: [AgeGroup.Kids],
    time: '11:30 AM to 12:30 PM',
    rubrics: [
      { id: 'r1', name: 'Costume', maxScore: 10 },
      { id: 'r2', name: 'Presentation', maxScore: 10 },
      { id: 'r3', name: 'Theme Relevance', maxScore: 10 }
    ]
  },
  // Krishna Juniors (6 to 9 years)
  {
    id: 'comp-juniors-1',
    name: 'Birthday Card Making for Sri Krishna',
    ageGroups: [AgeGroup.Juniors],
    time: '09:30 AM to 10:30 AM',
    rubrics: [
      { id: 'r1', name: 'Creativity', maxScore: 10 },
      { id: 'r2', name: 'Design', maxScore: 10 },
      { id: 'r3', name: 'Message', maxScore: 10 }
    ]
  },
  {
    id: 'comp-juniors-2',
    name: 'Solo Dance Performance',
    ageGroups: [AgeGroup.Juniors],
    time: '09:30 AM to 10:30 AM',
    rubrics: [
      { id: 'r1', name: 'Choreography', maxScore: 10 },
      { id: 'r2', name: 'Rhythm', maxScore: 10 },
      { id: 'r3', name: 'Expression', maxScore: 10 }
    ]
  },
  {
    id: 'comp-juniors-3',
    name: 'Bhagavad Gita Sloka Recitations',
    ageGroups: [AgeGroup.Juniors],
    time: '10:30 AM to 11:30 AM',
    rubrics: [
      { id: 'r1', name: 'Pronunciation', maxScore: 10 },
      { id: 'r2', name: 'Memory', maxScore: 10 },
      { id: 'r3', name: 'Confidence', maxScore: 10 }
    ]
  },
  {
    id: 'comp-juniors-4',
    name: 'Fancy Dress (Theme: Krishna Leela)',
    ageGroups: [AgeGroup.Juniors],
    time: '11:30 AM to 12:30 PM',
    rubrics: [
      { id: 'r1', name: 'Costume', maxScore: 10 },
      { id: 'r2', name: 'Presentation', maxScore: 10 },
      { id: 'r3', name: 'Theme Relevance', maxScore: 10 }
    ]
  },
  // Krishna Teens (10 to 15 years)
  {
    id: 'comp-teens-1',
    name: 'Pot Painting',
    ageGroups: [AgeGroup.Teens],
    time: '09:30 AM to 10:30 AM',
    rubrics: [
      { id: 'r1', name: 'Creativity', maxScore: 10 },
      { id: 'r2', name: 'Technique', maxScore: 10 },
      { id: 'r3', name: 'Design', maxScore: 10 }
    ]
  },
  {
    id: 'comp-teens-2',
    name: 'Solo Dance Performance',
    ageGroups: [AgeGroup.Teens],
    time: '09:30 AM to 10:30 AM',
    rubrics: [
      { id: 'r1', name: 'Choreography', maxScore: 10 },
      { id: 'r2', name: 'Rhythm', maxScore: 10 },
      { id: 'r3', name: 'Expression', maxScore: 10 }
    ]
  },
  {
    id: 'comp-teens-3',
    name: 'Sloka Recitation - Bhagavad-Gita',
    ageGroups: [AgeGroup.Teens],
    time: '10:30 AM to 11:30 AM',
    rubrics: [
      { id: 'r1', name: 'Pronunciation', maxScore: 10 },
      { id: 'r2', name: 'Memory', maxScore: 10 },
      { id: 'r3', name: 'Confidence', maxScore: 10 }
    ]
  },
  {
    id: 'comp-teens-4',
    name: 'Fancy Dress (Theme: Krishna Leela)',
    ageGroups: [AgeGroup.Teens],
    time: '11:30 AM to 12:30 PM',
    rubrics: [
      { id: 'r1', name: 'Costume', maxScore: 10 },
      { id: 'r2', name: 'Presentation', maxScore: 10 },
      { id: 'r3', name: 'Theme Relevance', maxScore: 10 }
    ]
  }
];

const defaultUsers: User[] = [
  {
    id: 'admin-1',
    username: 'Riya A',
    password: 'Radha@108',
    role: UserRole.Admin,
    assignedCompetitions: []
  }
];

const initialData: AppData = {
  users: defaultUsers,
  competitions: defaultCompetitions,
  registrations: [],
  scores: [],
  results: [],
  settings: defaultSettings
};

interface AppContextType {
  data: AppData;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addCompetition: (competition: Omit<Competition, 'id'>) => Promise<boolean>;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deleteCompetition: (id: string) => void;
  addRegistration: (registration: Omit<Registration, 'id' | 'createdAt'>) => void;
  updateRegistration: (id: string, updates: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
  addScore: (score: Omit<Score, 'id' | 'createdAt'>) => void;
  updateScore: (id: string, updates: Partial<Score>) => void;
  getScoresByCompetition: (competitionId: string) => Score[];
  addResult: (result: Omit<Result, 'id'>) => void;
  updateResult: (id: string, updates: Partial<Result>) => void;
  getResultByCompetition: (competitionId: string) => Result | undefined;
  updateSettings: (updates: Partial<Settings>) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        const [users, competitions, registrations, scores, results, settings] = await Promise.all([
          api.getAllUsers(),
          api.getAllCompetitions(),
          api.getAllRegistrations(),
          api.getAllScores(),
          api.getAllResults(),
          api.getSettings()
        ]);

        // If no competitions exist, create default ones
        let finalCompetitions = competitions;
        if (competitions.length === 0) {
          console.log('No competitions found, creating defaults...');
          for (const comp of defaultCompetitions) {
            const created = await api.createCompetition(comp);
            if (created) {
              finalCompetitions.push(created);
            }
          }
        }

        // If no admin user exists, create default admin
        let finalUsers = users;
        if (users.length === 0) {
          console.log('No users found, creating default admin...');
          const defaultAdmin: Omit<User, 'id'> = {
            username: 'Riya A',
            password: 'Radha@108',
            role: UserRole.Admin,
            assignedCompetitions: []
          };
          const created = await api.createUser(defaultAdmin);
          if (created) {
            finalUsers = [created];
          } else {
            finalUsers = defaultUsers;
          }
        }

        setData({
          users: finalUsers,
          competitions: finalCompetitions,
          registrations,
          scores,
          results,
          settings: settings || defaultSettings
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
        setData(initialData);
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    const dbUser = await api.authenticateUser(username, password);
    if (dbUser) {
      setCurrentUser(dbUser);
      setData(prev => ({
        ...prev,
        users: prev.users.some(u => u.id === dbUser.id)
          ? prev.users
          : [...prev.users, dbUser]
      }));
      return dbUser;
    }

    const localUser = data.users.find(
      u => u.username === username && u.password === password
    );
    if (localUser) {
      setCurrentUser(localUser);
      return localUser;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    const created = await api.createUser(user);
    if (created) {
      setData(prev => ({
        ...prev,
        users: [...prev.users, created]
      }));
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const success = await api.updateUser(id, updates);
    if (success) {
      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u)
      }));
    }
  };

  const deleteUser = async (id: string) => {
    const success = await api.deleteUser(id);
    if (success) {
      setData(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== id)
      }));
    }
  };

  const addCompetition = async (competition: Omit<Competition, 'id'>): Promise<boolean> => {
    const newCompetition: Competition = {
      ...competition,
      id: `comp-${Date.now()}`
    };
    const created = await api.createCompetition(newCompetition);
    const toAdd = created || newCompetition;
    setData(prev => ({ ...prev, competitions: [...prev.competitions, toAdd] }));
    syncToSheets('competitions', 'INSERT', compToRow(toAdd));
    return !!created;
  };

  const updateCompetition = async (id: string, updates: Partial<Competition>) => {
    const success = await api.updateCompetition(id, updates);
    if (success) {
      setData(prev => ({
        ...prev,
        competitions: prev.competitions.map(c => c.id === id ? { ...c, ...updates } : c)
      }));
      syncToSheets('competitions', 'UPDATE', compToRow({ id, ...updates }));
    }
  };

  const deleteCompetition = async (id: string) => {
    const success = await api.deleteCompetition(id);
    if (success) {
      setData(prev => ({ ...prev, competitions: prev.competitions.filter(c => c.id !== id) }));
      syncToSheets('competitions', 'DELETE', { id });
    }
  };

  const addRegistration = async (registration: Omit<Registration, 'id' | 'createdAt'>) => {
    const newRegistration: Omit<Registration, 'id'> = {
      ...registration,
      createdAt: new Date().toISOString()
    };
    const created = await api.createRegistration(newRegistration);
    const toAdd = created || { ...newRegistration, id: `reg-${Date.now()}` };
    setData(prev => ({ ...prev, registrations: [...prev.registrations, toAdd] }));

    // Resolve competition IDs → names for Google Sheets
    const competitionNames = (toAdd.competitions || []).map(cid => {
      const found = data.competitions.find(c => c.id === cid);
      return found ? found.name : cid;
    });
    syncToSheets('registrations', 'INSERT', {
      ...regToRow(toAdd),
      competition_names: competitionNames,
      payment_screenshot: toAdd.paymentScreenshot // base64 — Apps Script uploads to Drive
    });
  };

  const updateRegistration = async (id: string, updates: Partial<Registration>) => {
    const success = await api.updateRegistration(id, updates);
    if (success) {
      setData(prev => ({
        ...prev,
        registrations: prev.registrations.map(r => r.id === id ? { ...r, ...updates } : r)
      }));
      syncToSheets('registrations', 'UPDATE', regToRow({ id, ...updates }));
    }
  };

  const deleteRegistration = async (id: string) => {
    const success = await api.deleteRegistration(id);
    if (success) {
      setData(prev => ({ ...prev, registrations: prev.registrations.filter(r => r.id !== id) }));
      syncToSheets('registrations', 'DELETE', { id });
    }
  };

  const addScore = async (score: Omit<Score, 'id' | 'createdAt'>) => {
    const newScore: Omit<Score, 'id'> = {
      ...score,
      createdAt: new Date().toISOString()
    };
    const created = await api.createScore(newScore);
    if (created) {
      setData(prev => ({ ...prev, scores: [...prev.scores, created] }));
      syncToSheets('scores', 'INSERT', scoreToRow(created));
    }
  };

  const updateScore = async (id: string, updates: Partial<Score>) => {
    const success = await api.updateScore(id, updates);
    if (success) {
      setData(prev => ({
        ...prev,
        scores: prev.scores.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
      syncToSheets('scores', 'UPDATE', scoreToRow({ id, ...updates }));
    }
  };

  const getScoresByCompetition = (competitionId: string): Score[] => {
    return data.scores.filter(s => s.competitionId === competitionId);
  };

  const addResult = async (result: Omit<Result, 'id'>) => {
    const created = await api.createResult(result);
    if (created) {
      setData(prev => ({
        ...prev,
        results: [...prev.results, created]
      }));
    }
  };

  const updateResult = async (id: string, updates: Partial<Result>) => {
    const success = await api.updateResult(id, updates);
    if (success) {
      setData(prev => ({
        ...prev,
        results: prev.results.map(r => r.id === id ? { ...r, ...updates } : r)
      }));
    }
  };

  const getResultByCompetition = (competitionId: string): Result | undefined => {
    return data.results.find(r => r.competitionId === competitionId);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const success = await api.updateSettings(updates);
    if (success) {
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, ...updates }
      }));
    }
  };

  const resetData = async () => {
    // This will reload all data from Supabase
    setIsLoading(true);
    try {
      const [users, competitions, registrations, scores, results, settings] = await Promise.all([
        api.getAllUsers(),
        api.getAllCompetitions(),
        api.getAllRegistrations(),
        api.getAllScores(),
        api.getAllResults(),
        api.getSettings()
      ]);

      setData({
        users,
        competitions,
        registrations,
        scores,
        results,
        settings: settings || defaultSettings
      });
    } catch (error) {
      console.error('Failed to reset data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        data,
        currentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        addCompetition,
        updateCompetition,
        deleteCompetition,
        addRegistration,
        updateRegistration,
        deleteRegistration,
        addScore,
        updateScore,
        getScoresByCompetition,
        addResult,
        updateResult,
        getResultByCompetition,
        updateSettings,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

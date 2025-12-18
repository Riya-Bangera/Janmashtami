import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppData, User, Competition, Registration, Score, Result, Settings } from '@/types/types';
import { UserRole, AgeGroup, PaymentMethod, RegistrationStatus } from '@/types/types';

const STORAGE_KEY = 'iskcon_v23_db';

const defaultSettings: Settings = {
  upiId: '9876543210@upi',
  registrationOpen: true
};

const defaultCompetitions: Competition[] = [
  {
    id: 'comp-1',
    name: 'Krishna Bhajan',
    ageGroups: [AgeGroup.Kids, AgeGroup.Juniors, AgeGroup.Teens],
    time: '10:00 AM',
    fee: 100,
    additionalFee: 50,
    rubrics: [
      { id: 'r1', name: 'Voice Quality', maxScore: 10 },
      { id: 'r2', name: 'Devotion', maxScore: 10 },
      { id: 'r3', name: 'Presentation', maxScore: 10 }
    ]
  },
  {
    id: 'comp-2',
    name: 'Flute Performance',
    ageGroups: [AgeGroup.Juniors, AgeGroup.Teens],
    time: '11:00 AM',
    fee: 100,
    additionalFee: 50,
    rubrics: [
      { id: 'r1', name: 'Technique', maxScore: 10 },
      { id: 'r2', name: 'Melody', maxScore: 10 },
      { id: 'r3', name: 'Expression', maxScore: 10 }
    ]
  },
  {
    id: 'comp-3',
    name: 'Krishna Story Telling',
    ageGroups: [AgeGroup.Kids],
    time: '12:00 PM',
    fee: 100,
    additionalFee: 50,
    rubrics: [
      { id: 'r1', name: 'Content', maxScore: 10 },
      { id: 'r2', name: 'Delivery', maxScore: 10 },
      { id: 'r3', name: 'Confidence', maxScore: 10 }
    ]
  },
  {
    id: 'comp-4',
    name: 'Dance Performance',
    ageGroups: [AgeGroup.Kids, AgeGroup.Juniors, AgeGroup.Teens],
    time: '2:00 PM',
    fee: 100,
    additionalFee: 50,
    rubrics: [
      { id: 'r1', name: 'Choreography', maxScore: 10 },
      { id: 'r2', name: 'Rhythm', maxScore: 10 },
      { id: 'r3', name: 'Expression', maxScore: 10 }
    ]
  }
];

const defaultUsers: User[] = [
  {
    id: 'admin-1',
    username: 'Riya A',
    password: 'Radha@108',
    role: UserRole.Admin
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
  login: (username: string, password: string) => User | null;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addCompetition: (competition: Omit<Competition, 'id'>) => void;
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

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData({ ...initialData, ...parsedData });
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const login = (username: string, password: string): User | null => {
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u)
    }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  };

  const addCompetition = (competition: Omit<Competition, 'id'>) => {
    const newCompetition: Competition = {
      ...competition,
      id: `comp-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      competitions: [...prev.competitions, newCompetition]
    }));
  };

  const updateCompetition = (id: string, updates: Partial<Competition>) => {
    setData(prev => ({
      ...prev,
      competitions: prev.competitions.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteCompetition = (id: string) => {
    setData(prev => ({
      ...prev,
      competitions: prev.competitions.filter(c => c.id !== id)
    }));
  };

  const addRegistration = (registration: Omit<Registration, 'id' | 'createdAt'>) => {
    const newRegistration: Registration = {
      ...registration,
      id: `reg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      registrations: [...prev.registrations, newRegistration]
    }));
  };

  const updateRegistration = (id: string, updates: Partial<Registration>) => {
    setData(prev => ({
      ...prev,
      registrations: prev.registrations.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const deleteRegistration = (id: string) => {
    setData(prev => ({
      ...prev,
      registrations: prev.registrations.filter(r => r.id !== id)
    }));
  };

  const addScore = (score: Omit<Score, 'id' | 'createdAt'>) => {
    const newScore: Score = {
      ...score,
      id: `score-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      scores: [...prev.scores, newScore]
    }));
  };

  const updateScore = (id: string, updates: Partial<Score>) => {
    setData(prev => ({
      ...prev,
      scores: prev.scores.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const getScoresByCompetition = (competitionId: string): Score[] => {
    return data.scores.filter(s => s.competitionId === competitionId);
  };

  const addResult = (result: Omit<Result, 'id'>) => {
    const newResult: Result = {
      ...result,
      id: `result-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      results: [...prev.results, newResult]
    }));
  };

  const updateResult = (id: string, updates: Partial<Result>) => {
    setData(prev => ({
      ...prev,
      results: prev.results.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const getResultByCompetition = (competitionId: string): Result | undefined => {
    return data.results.find(r => r.competitionId === competitionId);
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const resetData = () => {
    setData(initialData);
    setCurrentUser(null);
  };

  if (!isInitialized) {
    return null;
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

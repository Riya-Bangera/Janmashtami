export enum AgeGroup {
  Kids = 'Kids',
  Juniors = 'Juniors',
  Teens = 'Teens'
}

export enum UserRole {
  Admin = 'admin',
  Judge = 'judge',
  Host = 'host',
  Public = 'public'
}

export enum PaymentMethod {
  Cash = 'cash',
  Online = 'online'
}

export enum RegistrationStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled'
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  assignedCompetitions?: string[];
}

export interface Competition {
  id: string;
  name: string;
  ageGroups: AgeGroup[];
  time?: string;
  rubrics: Rubric[];
}

export interface Rubric {
  id: string;
  name: string;
  maxScore: number;
}

export interface Registration {
  id: string;
  registrationId: string;
  name: string;
  dateOfBirth: string;
  age: number;
  ageGroup: AgeGroup;
  competitions: string[];
  totalFee: number;
  paymentMethod: PaymentMethod;
  paymentScreenshot?: string;
  status: RegistrationStatus;
  createdAt: string;
  calledToStage?: boolean;
  parentName?: string;
  whatsappNumber?: string;
}

export interface Score {
  id: string;
  registrationId: string;
  competitionId: string;
  judgeId: string;
  scores: { [rubricId: string]: number };
  totalScore: number;
  createdAt: string;
}

export interface Result {
  id: string;
  competitionId: string;
  rank1: string;
  rank2: string;
  rank3: string;
  published: boolean;
  publishedAt?: string;
}

export interface Settings {
  upiId: string;
  registrationOpen: boolean;
}

export interface AppData {
  users: User[];
  competitions: Competition[];
  registrations: Registration[];
  scores: Score[];
  results: Result[];
  settings: Settings;
}

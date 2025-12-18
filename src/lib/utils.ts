import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AgeGroup, type Competition } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 8) return AgeGroup.Kids;
  if (age <= 12) return AgeGroup.Juniors;
  return AgeGroup.Teens;
}

export function calculateFee(competitions: Competition[], selectedIds: string[]): number {
  if (selectedIds.length === 0) return 0;
  
  // Fixed fee structure: 100 for first competition, 50 for each additional
  const baseFee = 100;
  const additionalFee = 50;
  
  return baseFee + (selectedIds.length - 1) * additionalFee;
}

export function generateRegistrationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `REG-${timestamp}-${random}`.toUpperCase();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

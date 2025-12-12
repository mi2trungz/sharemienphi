export enum AccountType {
  CHATGPT = 'ChatGPT',
  CAPCUT = 'CapCut',
  STUDOCU = 'Studocu',
  OTHER = 'Other'
}

export enum AccountStatus {
  WORKING = 'Working',
  BUSY = 'Busy',
  DEAD = 'Dead'
}

export interface Account {
  id: string;
  type: AccountType;
  email: string;
  password?: string; // Optional if cookie based, but usually password
  description?: string;
  lastUpdated: string;
  status: AccountStatus;
  otpSecret?: string; // Only for accounts requiring 2FA (ChatGPT)
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
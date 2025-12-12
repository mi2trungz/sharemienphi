import { Account, AccountType, AccountStatus } from './types';

export const ACCOUNTS: Account[] = [
  {
    id: '1',
    type: AccountType.CHATGPT,
    email: 'free-gpt-01@sharekey.demo',
    password: 'Password123!',
    description: 'Tài khoản ChatGPT Plus dùng chung. Vui lòng không đổi mật khẩu.',
    lastUpdated: '10 phút trước',
    status: AccountStatus.WORKING,
    otpSecret: 'JBSWY3DPEHPK3PXP', // Mock secret
    tags: ['Plus', 'GPT-4']
  },
  {
    id: '2',
    type: AccountType.CHATGPT,
    email: 'team-gpt-std@sharekey.demo',
    password: 'ShareKey2024@',
    description: 'Tài khoản Standard, ổn định cho tác vụ cơ bản.',
    lastUpdated: '1 giờ trước',
    status: AccountStatus.BUSY,
    otpSecret: 'KRSXG5CTMVRXEZLU', // Mock secret
    tags: ['Standard', 'No-History']
  },
  {
    id: '3',
    type: AccountType.CAPCUT,
    email: 'editor-pro-01@sharekey.demo',
    password: 'EditVideo#1',
    description: 'CapCut Pro bản quyền 1 năm. Đầy đủ tính năng.',
    lastUpdated: '2 giờ trước',
    status: AccountStatus.WORKING,
    tags: ['Pro', 'PC/Mobile']
  },
  {
    id: '4',
    type: AccountType.STUDOCU,
    email: 'student-help@sharekey.demo',
    password: 'StudyHard!',
    description: 'Tài khoản Premium xem tài liệu không giới hạn.',
    lastUpdated: '1 ngày trước',
    status: AccountStatus.WORKING,
    tags: ['Premium', 'Docs']
  },
  {
    id: '5',
    type: AccountType.CHATGPT,
    email: 'gpt-backup-99@sharekey.demo',
    password: 'BackupPass99',
    description: 'Tài khoản dự phòng.',
    lastUpdated: '3 ngày trước',
    status: AccountStatus.DEAD,
    otpSecret: 'MZXW6YTBOI======',
    tags: ['Free']
  },
  {
    id: '6',
    type: AccountType.CAPCUT,
    email: 'tiktok-creator@sharekey.demo',
    password: 'ViralVideo2025',
    description: 'Dành cho anh em làm TikTok.',
    lastUpdated: '5 phút trước',
    status: AccountStatus.WORKING,
    tags: ['Pro', 'Assets']
  }
];
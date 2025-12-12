import React, { useState } from 'react';
import { Account, AccountType, AccountStatus } from '../types';
import { CopyIcon, CheckIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon, LockIcon, UnlockIcon } from './Icons';

interface AccountCardProps {
  account: Account;
  onOpen2FA: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onOpen2FA }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.WORKING: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case AccountStatus.BUSY: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case AccountStatus.DEAD: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getTypeStyle = (type: AccountType) => {
    switch (type) {
      case AccountType.CHATGPT: return 'from-emerald-600 to-teal-600';
      case AccountType.CAPCUT: return 'from-gray-100 to-white text-black'; // Capcut usually black/white branding, lets invert for visibility
      case AccountType.STUDOCU: return 'from-blue-500 to-cyan-500';
      default: return 'from-indigo-500 to-purple-500';
    }
  };

  const isDead = account.status === AccountStatus.DEAD;

  return (
    <div className={`relative group bg-dark-card border border-dark-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] ${isDead ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      
      {/* Header Banner */}
      <div className={`h-2 w-full bg-gradient-to-r ${getTypeStyle(account.type)}`} />

      <div className="p-5 space-y-4">
        {/* Top Row: Type & Status */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    account.type === AccountType.CHATGPT ? 'bg-teal-900/50 text-teal-300' :
                    account.type === AccountType.CAPCUT ? 'bg-gray-700 text-gray-200' :
                    'bg-blue-900/50 text-blue-300'
                }`}>
                  {account.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(account.status)}`}>
                  {account.status}
                </span>
             </div>
             <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
               {account.email.split('@')[0]}
             </h3>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1 justify-end max-w-[40%]">
             {account.tags.map(tag => (
               <span key={tag} className="text-[10px] bg-dark-bg border border-dark-border text-gray-400 px-1.5 py-0.5 rounded">
                 {tag}
               </span>
             ))}
          </div>
        </div>

        {/* Credentials Box */}
        <div className="bg-dark-bg rounded-lg p-3 space-y-3 border border-dark-border">
          {/* Email */}
          <div className="flex items-center justify-between group/field">
             <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-gray-500 text-xs uppercase w-16 flex-shrink-0">Email</span>
                <span className="text-sm text-gray-200 font-mono truncate select-all">{account.email}</span>
             </div>
             <button 
                onClick={() => copyToClipboard(account.email, 'email')}
                className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"
                title="Sao chép Email"
             >
                {copiedField === 'email' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
             </button>
          </div>

          <div className="h-px bg-dark-border" />

          {/* Password */}
          <div className="flex items-center justify-between group/field">
             <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-gray-500 text-xs uppercase w-16 flex-shrink-0">Password</span>
                <span className="text-sm text-gray-200 font-mono truncate">
                  {showPassword ? account.password : '••••••••••••'}
                </span>
             </div>
             <div className="flex items-center gap-1">
               <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"
               >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
               </button>
               <button 
                  onClick={() => copyToClipboard(account.password || '', 'pass')}
                  className="p-1.5 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"
                  title="Sao chép Password"
               >
                  {copiedField === 'pass' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
               </button>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
           <span className="text-xs text-gray-500">
             Cập nhật: {account.lastUpdated}
           </span>
           
           {/* Special 2FA Button for ChatGPT */}
           {account.type === AccountType.CHATGPT && account.otpSecret && !isDead && (
             <button
               onClick={() => onOpen2FA(account)}
               className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all shadow-lg shadow-brand-500/20 active:scale-95"
             >
               <ShieldCheckIcon className="w-4 h-4" />
               Lấy mã 2FA
             </button>
           )}

           {/* Generic dead state action */}
           {isDead && (
              <span className="text-xs text-rose-500 flex items-center gap-1">
                <LockIcon className="w-3 h-3" /> Đã bị khóa
              </span>
           )}
           
           {!isDead && !account.otpSecret && (
              <span className="text-xs text-emerald-500 flex items-center gap-1">
                 <UnlockIcon className="w-3 h-3" /> Sử dụng ngay
              </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
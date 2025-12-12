import React, { useState, useEffect } from 'react';
import { XIcon, CopyIcon, CheckIcon, RefreshCwIcon } from './Icons';

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  secret: string;
  email: string;
}

const TwoFAModal: React.FC<TwoFAModalProps> = ({ isOpen, onClose, secret, email }) => {
  const [code, setCode] = useState<string>('000000');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [copied, setCopied] = useState(false);

  // Mock TOTP Generation Logic (client-side simulation for demo)
  // In a real app, use a library like `otpauth` or `totp-generator`
  const generateMockCode = (secretKey: string) => {
    // Determine a pseudo-random code based on current time (30s window) and secret length
    const epoch = Math.floor(Date.now() / 30000);
    const seed = secretKey.length + epoch;
    const mockCode = Math.abs(Math.sin(seed) * 1000000).toFixed(0).slice(0, 6).padEnd(6, '0');
    return mockCode;
  };

  useEffect(() => {
    if (!isOpen) return;

    const updateCode = () => {
      const seconds = new Date().getSeconds();
      const remaining = 30 - (seconds % 30);
      setTimeLeft(remaining);
      setCode(generateMockCode(secret));
    };

    updateCode(); // Initial call
    const interval = setInterval(updateCode, 1000);

    return () => clearInterval(interval);
  }, [isOpen, secret]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <RefreshCwIcon className="w-5 h-5 animate-spin-slow" />
            Lấy mã xác thực 2FA
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-sm">Đang lấy mã cho tài khoản:</p>
            <p className="text-brand-100 font-medium break-all">{email}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div 
              className="bg-dark-bg border border-brand-500/30 rounded-lg py-4 px-8 text-4xl font-mono font-bold tracking-widest text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] cursor-pointer hover:bg-dark-bg/80 transition-colors flex items-center gap-3"
              onClick={handleCopy}
              title="Nhấn để sao chép"
            >
              <span>{code.slice(0, 3)}</span>
              <span className="text-brand-500">-</span>
              <span>{code.slice(3)}</span>
            </div>
            
            <button
              onClick={handleCopy}
              className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                copied 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20'
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4" /> Đã sao chép
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" /> Sao chép mã
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
             <div className="flex justify-between text-xs text-gray-400">
               <span>Tự động làm mới sau</span>
               <span>{timeLeft}s</span>
             </div>
             <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    timeLeft < 10 ? 'bg-red-500' : 'bg-brand-500'
                 }`}
                 style={{ width: `${(timeLeft / 30) * 100}%` }}
               />
             </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
             <p className="text-yellow-200/80 text-xs text-center">
               Mã này chỉ có hiệu lực trong 30 giây. Nếu đăng nhập thất bại, vui lòng đợi mã mới.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAModal;
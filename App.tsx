import React, { useState, useMemo } from 'react';
import { ACCOUNTS } from './constants';
import { Account, AccountType, User } from './types';
import AccountCard from './components/AccountCard';
import TwoFAModal from './components/TwoFAModal';
import AuthModal from './components/AuthModal';
import { 
  SearchIcon, 
  KeyIcon, 
  HomeIcon, 
  MessageCircleIcon, 
  VideoIcon, 
  FileTextIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  UserIcon,
  LogOutIcon
} from './components/Icons';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AccountType | null>(null);
  const [selectedAccountFor2FA, setSelectedAccountFor2FA] = useState<Account | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Filter Logic
  const filteredAccounts = useMemo(() => {
    return ACCOUNTS.filter(account => {
      if (selectedCategory && account.type !== selectedCategory) {
        return false;
      }
      
      const matchesSearch = 
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        account.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryCount = (type: AccountType) => ACCOUNTS.filter(a => a.type === type).length;

  const handleCategoryClick = (type: AccountType) => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setSelectedCategory(type);
    setSearchTerm('');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCategory(null);
  };

  const renderCategoryCard = (type: AccountType, label: string, Icon: React.ElementType, gradient: string, description: string) => (
    <button
      onClick={() => handleCategoryClick(type)}
      className={`group relative overflow-hidden rounded-2xl bg-dark-card border border-dark-border p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:border-opacity-50 hover:border-white/20`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} p-0.5 mb-4 shadow-lg`}>
           <div className="w-full h-full bg-dark-bg rounded-[6px] flex items-center justify-center">
             <Icon className={`w-6 h-6 text-white`} />
           </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{label}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-dark-bg border border-dark-border text-gray-400">
             {getCategoryCount(type)} tài khoản
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
             {user ? <ArrowRightIcon className="w-4 h-4" /> : <div className="text-[10px] font-bold">LOGIN</div>}
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-sans pb-20 selection:bg-brand-500/30 selection:text-brand-200 flex flex-col">
      
      {/* Navigation / Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-dark-bg/80 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            
            <div className="flex items-center justify-between w-full md:w-auto">
                {/* Logo */}
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedCategory(null)}
                >
                  <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
                    <KeyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      ShareKey
                    </h1>
                    <p className="text-xs text-gray-500">Cộng đồng chia sẻ tài khoản</p>
                  </div>
                </div>

                {/* Mobile Auth Button (Visible only on mobile) */}
                <div className="md:hidden">
                    {user ? (
                        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white">
                            <LogOutIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                            className="text-sm font-medium text-brand-400"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs (Desktop) */}
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
               {user && (
                 <>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === null
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <HomeIcon className="w-4 h-4" />
                        Trang chủ
                    </button>
                    <div className="hidden md:block w-px h-5 bg-dark-border mx-1" />
                 </>
               )}

               {/* Auth Controls (Desktop) */}
               <div className="hidden md:flex items-center gap-3">
                  {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-card border border-dark-border rounded-full">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300 font-medium truncate max-w-[100px]">{user.name}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            title="Đăng xuất"
                        >
                            <LogOutIcon className="w-5 h-5" />
                        </button>
                    </div>
                  ) : (
                    <>
                        <button 
                            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
                        >
                            Đăng nhập
                        </button>
                        <button 
                            onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                            className="text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 px-5 py-2 rounded-full shadow-lg shadow-brand-500/20 transition-all active:scale-95"
                        >
                            Đăng ký ngay
                        </button>
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {selectedCategory === null ? (
          /* HOME DASHBOARD VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Hero Text */}
             <div className="text-center space-y-4 py-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  {user ? (
                      <>Chào <span className="text-brand-500">{user.name}</span>, bạn cần gì hôm nay?</>
                  ) : (
                      <>Chọn dịch vụ bạn muốn <span className="text-brand-500">sử dụng</span></>
                  )}
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  {!user && "Đăng nhập để "} Truy cập miễn phí hàng trăm tài khoản Premium được cập nhật liên tục. 
                  Chọn một danh mục bên dưới để bắt đầu.
                </p>
             </div>

             {/* Categories Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderCategoryCard(
                  AccountType.CHATGPT, 
                  "ChatGPT & Plus", 
                  MessageCircleIcon, 
                  "from-emerald-500 to-teal-500", 
                  "Tài khoản OpenAI ChatGPT Plus, hỗ trợ GPT-4, DALL-E 3 và tính năng tạo ảnh."
                )}
                {renderCategoryCard(
                  AccountType.CAPCUT, 
                  "CapCut Pro", 
                  VideoIcon, 
                  "from-gray-200 to-gray-400", 
                  "Tài khoản chỉnh sửa video chuyên nghiệp, mở khóa toàn bộ hiệu ứng và mẫu Pro."
                )}
                {renderCategoryCard(
                  AccountType.STUDOCU, 
                  "Studocu Premium", 
                  FileTextIcon, 
                  "from-blue-500 to-cyan-500", 
                  "Kho tài liệu học tập khổng lồ, xem và tải xuống không giới hạn cho sinh viên."
                )}
             </div>

             {/* Recent/Featured Section */}
             <div className="border-t border-dark-border pt-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thống kê nhanh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-dark-card/50 rounded-lg p-4 border border-dark-border">
                      <div className="text-2xl font-bold text-white">{ACCOUNTS.length}</div>
                      <div className="text-xs text-gray-500">Tổng tài khoản</div>
                   </div>
                   <div className="bg-dark-card/50 rounded-lg p-4 border border-dark-border">
                      <div className="text-2xl font-bold text-emerald-400">
                        {ACCOUNTS.filter(a => a.status === 'Working').length}
                      </div>
                      <div className="text-xs text-gray-500">Đang hoạt động</div>
                   </div>
                   <div className="bg-dark-card/50 rounded-lg p-4 border border-dark-border">
                      <div className="text-2xl font-bold text-brand-400">
                        24/7
                      </div>
                      <div className="text-xs text-gray-500">Cập nhật liên tục</div>
                   </div>
                   <div className="bg-dark-card/50 rounded-lg p-4 border border-dark-border">
                      <div className="text-2xl font-bold text-purple-400">Free</div>
                      <div className="text-xs text-gray-500">Hoàn toàn miễn phí</div>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          /* LIST VIEW (Filtered) */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             
             {/* List Header */}
             <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-dark-card/30 p-4 rounded-2xl border border-dark-border/50">
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setSelectedCategory(null)}
                     className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                     title="Quay lại"
                   >
                     <ChevronLeftIcon className="w-6 h-6" />
                   </button>
                   <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {selectedCategory}
                        <span className="text-sm font-normal text-gray-500 bg-dark-bg border border-dark-border px-2 py-0.5 rounded-md">
                          {filteredAccounts.length}
                        </span>
                      </h2>
                      <p className="text-sm text-gray-400">Danh sách tài khoản miễn phí</p>
                   </div>
                </div>

                {/* Search in List */}
                <div className="relative w-full md:w-80 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-dark-border rounded-xl leading-5 bg-dark-bg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-all"
                    placeholder={`Tìm trong ${selectedCategory}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
             </div>

             {/* Account Grid */}
             {filteredAccounts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredAccounts.map((account) => (
                   <AccountCard 
                     key={account.id} 
                     account={account} 
                     onOpen2FA={(acc) => setSelectedAccountFor2FA(acc)}
                   />
                 ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-dark-card/30 rounded-2xl border border-dashed border-dark-border">
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-border mb-4">
                   <SearchIcon className="w-8 h-8 text-gray-500" />
                 </div>
                 <h3 className="text-lg font-medium text-white">Không tìm thấy tài khoản nào</h3>
                 <p className="text-gray-500 mt-1">Thử thay đổi từ khóa tìm kiếm.</p>
                 <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-brand-400 hover:text-brand-300 text-sm font-medium"
                 >
                    Xóa bộ lọc
                 </button>
               </div>
             )}

             {/* Usage Warning specific to category */}
             <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">💡 Mẹo sử dụng {selectedCategory}</h3>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {selectedCategory === AccountType.CHATGPT && (
                     <>
                        <li>Sử dụng nút "Lấy mã 2FA" nếu bị yêu cầu mã xác thực.</li>
                        <li>Tránh tạo các đoạn chat chứa thông tin nhạy cảm.</li>
                     </>
                  )}
                  {selectedCategory === AccountType.CAPCUT && (
                     <>
                        <li>Tải xuống template trước khi chỉnh sửa để tránh mất dữ liệu.</li>
                        <li>Không xóa các project của người khác trong Cloud.</li>
                     </>
                  )}
                  {selectedCategory === AccountType.STUDOCU && (
                     <li>Chỉ xem và tải tài liệu, không upload tài liệu cá nhân lên tài khoản chung.</li>
                  )}
                  <li>Vui lòng không đổi mật khẩu để cộng đồng cùng sử dụng.</li>
                </ul>
             </div>
          </div>
        )}
      </main>

      <footer className="border-t border-dark-border mt-auto bg-dark-card py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-gray-500 text-sm">© 2024 ShareKey. For educational purposes only.</p>
        </div>
      </footer>

      {/* Modals */}
      <TwoFAModal 
        isOpen={!!selectedAccountFor2FA}
        onClose={() => setSelectedAccountFor2FA(null)}
        secret={selectedAccountFor2FA?.otpSecret || ''}
        email={selectedAccountFor2FA?.email || ''}
      />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(user) => {
          setUser(user);
          setShowAuthModal(false);
        }}
        defaultMode={authMode}
      />
    </div>
  );
};

export default App;
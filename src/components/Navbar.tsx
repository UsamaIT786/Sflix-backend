import React, { useState } from 'react';
import { ActivePage, User } from '../types';
import { BRAND_NAME } from '../data';
import { Film, Tv, Crown, Menu, X, Bell, Search, Sparkles, LogOut, UserCircle, Settings, CreditCard, Trash2, Check, AlertCircle } from 'lucide-react';
import { auth, googleProvider, appleProvider } from '../firebase';
import { updateProfile, deleteUser, signInWithPopup } from 'firebase/auth';

interface NavbarProps {
  currentPage: ActivePage;
  onPageChange: (page: ActivePage, options?: { initialVipPlanId?: string }) => void;
  onSearchToggle: () => void;
  isVIPUser: boolean;
  isAuthenticated: boolean;
  authUser: User | null;
  onLogout: () => void;
  onCancelSubscription: () => void;
}

export default function Navbar({ currentPage, onPageChange, onSearchToggle, isVIPUser, isAuthenticated, authUser, onLogout, onCancelSubscription }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Account Settings state
  const [newDisplayName, setNewDisplayName] = useState(authUser?.username || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdateMessage, setProfileUpdateMessage] = useState('');
  
  // Cancel Subscription state
  const [isCanceling, setIsCanceling] = useState(false);
  
  // Delete Account state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv-shows', label: 'Series', icon: Tv },
    { id: 'vip', label: 'My List', icon: Crown },
  ];

  const handleNavClick = (page: ActivePage, options?: { initialVipPlanId?: string }) => {
    onPageChange(page, options);
    setMobileMenuOpen(false);
  };

  // Account Settings functions
  const handleProfileUpdate = async () => {
    if (!auth.currentUser || !newDisplayName.trim()) return;
    setIsUpdatingProfile(true);
    setProfileUpdateMessage('');
    
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setProfileUpdateMessage('Profile updated successfully!');
      // Refresh auth state would happen in App.tsx, but for now show success
    } catch (error) {
      setProfileUpdateMessage('Error updating profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Cancel Subscription functions
  const handleCancelSubscription = async () => {
    if (!auth.currentUser) return;
    setIsCanceling(true);
    
    try {
      // Simulate API call
      await fetch('https://sflix-backend.vercel.app/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: auth.currentUser.uid })
      });
      
      setIsCancelOpen(false);
      onCancelSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  // Delete Account functions
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    
    const confirmationText = auth.currentUser.email || 'DELETE';
    if (deleteConfirmText !== confirmationText) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      await deleteUser(auth.currentUser);
      setIsDeleteOpen(false);
      onLogout();
    } catch (error: any) {
      console.error('Delete account error:', error);
      setDeleteError('Error deleting account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Brand */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-3 cursor-pointer group"
              id="nav-logo-brand"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:shadow-cyan-400/35 transition-all">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Film className="w-5 h-5 text-cyan-400 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wider text-white">
                {BRAND_NAME.toUpperCase()}<span className="text-cyan-400 font-sans font-bold text-xs ml-1 tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded uppercase border border-purple-500/30">STREAM</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Streaming Hub v3.5</span>
            </div>
            </div>

            {/* Nav Items Desktop */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id as ActivePage)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                      isActive 
                        ? 'text-cyan-400 font-semibold bg-white/5' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full active-neon shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Extra utility items Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {/* Quick search button removed */}

              {/* Notifications */}
              <button className="relative p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50" />
              </button>

              {/* Subscribe Upgrade CTA / VIP status pill */}
              {isVIPUser ? (
                <div 
                  onClick={() => handleNavClick('vip')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/10 to-cyan-500/5 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cyan-400 cursor-pointer shadow-sm hover:border-cyan-400/50 transition-all duration-300 neon-glow-gold bg-indigo-950"
                  id="vip-status-pill"
                >
                  <Crown className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>GOLD PASS ACTIVE</span>
                </div>
              ) : (
                <button 
                    onClick={() => handleNavClick('vip', { initialVipPlanId: 'free-trial' })}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-md shadow-purple-500/20 cursor-pointer font-sans"
                    id="get-vip-btn"
                  >
                    <Crown className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
                    START FREE TRIAL
                  </button>
              )}

              {/* Auth Buttons or User Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                      {authUser?.photoUrl ? (
                        <img
                          src={authUser.photoUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                          {authUser?.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{authUser?.username}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm text-slate-300 font-medium">{authUser?.username}</p>
                        <p className="text-xs text-slate-500">{authUser?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </button>
                      {isVIPUser && (
                        <button
                          onClick={() => {
                            setIsCancelOpen(true);
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          Cancel Subscription
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                      <div className="h-px bg-white/5" />
                      <button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:from-purple-500 hover:to-cyan-400 transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile responsive buttons */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile search button removed */}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                id="mobile-nav-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/5 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActivePage)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                      isActive 
                        ? 'bg-purple-500/10 text-cyan-400 border-l-4 border-cyan-400' 
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-900 flex flex-col gap-3">
              {isVIPUser ? (
                <div 
                  onClick={() => handleNavClick('vip')}
                  className="flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/30 py-2.5 rounded-lg text-xs font-semibold text-cyan-400"
                >
                  <Crown className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>GOLD PASS ACTIVE</span>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavClick('vip')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500"
                >
                  <Crown className="w-4 h-4 fill-white" />
                  START 3-DAY FREE TRIAL
                </button>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300 font-medium">{authUser?.username}</p>
                    <p className="text-xs text-slate-500">{authUser?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Account Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Account Settings</h2>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setProfileUpdateMessage('');
                  setNewDisplayName(authUser?.username || '');
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-500">
                  {authUser?.photoUrl ? (
                    <img src={authUser.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{authUser?.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{authUser?.username}</p>
                  <p className="text-sm text-slate-400">{authUser?.email}</p>
                </div>
              </div>

              {/* Display Name Update */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Display Name</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter new display name"
                  />
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isUpdatingProfile || !newDisplayName.trim() || newDisplayName === authUser?.username}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:from-purple-500 hover:to-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? 'Updating...' : 'Update Display Name'}
                  </button>
                  {profileUpdateMessage && (
                    <p className={`text-sm text-center ${
                      profileUpdateMessage.includes('successfully') ? 'text-cyan-400' : 'text-red-400'
                    }`}>
                      {profileUpdateMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Cancel Subscription</h2>
              <button
                onClick={() => setIsCancelOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <div>
                  <h3 className="text-sm font-bold text-red-300">Warning</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Canceling your subscription will revoke your "GOLD PASS ACTIVE" premium access immediately. You will lose all VIP benefits including ad-free streaming, 4K content, and our high-speed CDN.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCanceling ? 'Canceling...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={() => setIsCancelOpen(false)}
                  className="w-full bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Delete Account</h2>
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <div>
                  <h3 className="text-sm font-bold text-red-300">Warning</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    This is a destructive action and cannot be undone. All your data, watch history, and preferences will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Please type "{auth.currentUser?.email || 'DELETE'}" to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Type confirmation text"
                />
                {deleteError && (
                  <p className="text-sm text-red-400">{deleteError}</p>
                )}
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== (auth.currentUser?.email || 'DELETE')}
                  className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
                <button
                  onClick={() => {
                    setIsDeleteOpen(false);
                    setDeleteConfirmText('');
                    setDeleteError('');
                  }}
                  className="w-full bg-white/5 text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

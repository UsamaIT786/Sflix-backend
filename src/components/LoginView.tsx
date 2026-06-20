import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { auth, googleProvider, appleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const convertFirebaseUser = (user: any): User => {
  return {
    id: user.uid,
    email: user.email || '',
    username: user.displayName || user.email?.split('@')[0] || 'User',
    createdAt: new Date(user.metadata.creationTime || Date.now()),
    photoUrl: user.photoURL || undefined,
    isVip: false,
  };
};

interface LoginViewProps {
  onBackToHome: () => void;
  onLoginSuccess: (user: User, token: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginView({ onBackToHome, onLoginSuccess, onSwitchToRegister }: LoginViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const user = convertFirebaseUser(result.user);
      onLoginSuccess(user, token);
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = () => {
    window.open('https://appleid.apple.com/auth/authorize', '_blank');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={onBackToHome}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Novaplay Stream</h2>
            <p className="text-slate-400 text-sm">Sign in to continue</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                <path d="M43 24.5C43 23.1739 42.8648 21.8826 42.6124 20.64H24V28.5H35.4366C34.8461 31.792 33.0244 34.5042 30.3891 36.2635L37.8891 41.7174C41.5207 38.3261 43 31.8174 43 24.5Z" fill="#4285F4"/>
                <path d="M24 43C29.2686 43 33.8049 41.2635 37.8891 38.3113L30.3891 32.857C28.2317 34.3109 25.4855 35.163 24 35.163C18.7563 35.163 14.1554 31.6522 12.1714 26.8043L4.47318 32.357C8.55161 40.1783 15.7092 43 24 43Z" fill="#34A853"/>
                <path d="M12.1716 26.8043C11.6348 25.3478 11.3301 23.7413 11.3301 22C11.3301 20.2587 11.6348 18.6522 12.1716 17.1957L4.47336 11.643C2.69545 15.1717 1.66992 18.963 1.66992 23C1.66992 27.037 2.69545 30.8283 4.47336 34.357L12.1716 26.8043Z" fill="#FBBC05"/>
                <path d="M24 10.837C26.9225 10.837 29.5822 11.8413 31.6611 13.5848L38.5036 7C34.3836 3.17391 29.4361 1 24 1C15.7092 1 8.55159 3.82174 4.47318 9.64304L12.1714 17.1957C14.1554 12.3478 18.7563 8.837 24 8.837V10.837Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Continue with Apple */}
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-all duration-300 border border-slate-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 17 21" fill="currentColor">
                <path d="M15.5 13.4C15.4 14.3 15 15.2 14.2 16.2C13.1 17.5 11.7 18.1 10.7 18.2C10.2 18.2 9.6 18.1 8.9 17.9C8.2 17.7 7.5 17.6 6.8 17.6C6.1 17.6 5.4 17.7 4.7 17.9C3.8 18.2 3.2 18.4 2.7 18.5C1.5 18.9 0.5 18.5 0 18.3C1.1 16.7 1.9 15 2.3 13.2C2.4 12.7 2.5 12.2 2.6 11.8C2.5 11.2 2.4 10.6 2.4 10C2.4 9.1 2.6 8.3 3.1 7.6C3.6 6.9 4.3 6.4 5.3 6.1C6.3 5.7 7.5 5.7 8.6 6.1C9.3 6.3 9.9 6.5 10.5 6.7C11.3 6.4 12.2 6.2 13.2 6.4C13.9 6.6 14.5 6.9 15 7.4C14.3 7.8 13.7 8.3 13.2 9C12.6 9.8 12.3 10.8 12.3 11.8C12.3 12.3 12.4 12.8 12.6 13.3C13.5 13.3 14.4 13.4 15.5 13.4ZM13.2 3.1C12.8 3.8 12.2 4.4 11.4 4.8C10.6 5.3 9.8 5.4 9 5.3C9.1 4.6 9.3 3.9 9.7 3.3C10 2.8 10.5 2.3 11 2C11.8 1.5 12.6 1.3 13.2 1.4V3.1Z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

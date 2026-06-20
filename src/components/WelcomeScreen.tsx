import React from 'react';
import { motion } from 'motion/react';
import { Film, Sparkles, Lock, Star } from 'lucide-react';
import { BRAND_NAME } from '../data';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.15),_transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-4xl w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-500/30">
              <div className="w-full h-full rounded-[18px] bg-slate-950 flex items-center justify-center">
                <Film className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-amber-100 mb-6 tracking-tight">
            {BRAND_NAME.toUpperCase()}
            <span className="text-cyan-400 font-sans font-bold text-2xl md:text-3xl ml-2 tracking-widest bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/30">STREAM</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-4">
            Premium Streaming, Zero Limits
          </p>
          
          {/* Description */}
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12">
            Unlock thousands of movies, TV shows, and exclusive originals. 
            Your premium entertainment experience starts now.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              Log In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegister}
              className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              Create Account
            </motion.button>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Sparkles, title: "Premium Quality", desc: "4K Ultra HD + Dolby Vision" },
              { icon: Lock, title: "Secure Access", desc: "Bank-level encryption" },
              { icon: Star, title: "No Ads", desc: "Uninterrupted streaming" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all"
              >
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

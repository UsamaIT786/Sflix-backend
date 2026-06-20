import React from 'react';
import { BRAND_NAME } from '../data';
import { Film, Globe, Terminal, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-16 pb-12 border-t border-white/5 bg-slate-950/80 backdrop-blur-md overflow-hidden" id="app-footer">
      
      {/* Decorative cyber ambient grids */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-md shadow-purple-500/20">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Film className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wider text-white">
                  {BRAND_NAME.toUpperCase()}<span className="text-cyan-400 font-sans font-bold text-xs ml-1 tracking-widest bg-purple-500/10 px-1.5 py-0.5 rounded uppercase border border-purple-500/30">STREAM</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Streaming Hub v3.5</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
              The next generation streaming aggregator platform for all movies and TV shows in existence with high-speed multi-mirror content serving with zero interruptions.
            </p>

            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>Streaming from &gt;42 Edge Nodes Worldwide</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>Protocol: Decentralized HLS Core 3.5</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="font-display text-xs font-black tracking-widest text-slate-300 uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Press Inquiries</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-display text-xs font-black tracking-widest text-slate-300 uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Cookie Preferences</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">DMCA Notice</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-display text-xs font-black tracking-widest text-slate-300 uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Account Management</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Devices Config</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-amber-400 transition-colors">Accessibility</a></li>
            </ul>
          </div>

        </div>

        {/* Divider & Bottom area */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {currentYear} {BRAND_NAME} / Veporian Media, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All servers operational
            </span>
            <span>v3.5 Build stable</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

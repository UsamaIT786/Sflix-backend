import React, { useState } from 'react';
import { MediaItem, Mirror } from '../types';
import { GENRES } from '../data';
import { motion } from 'motion/react';
import { LayoutDashboard, Radio, Users, Wallet, AlertTriangle, ShieldCheck, Plus, Trash2, Edit2, Check, RefreshCw, Sparkles, Server, Filter } from 'lucide-react';

interface AdminViewProps {
  mediaItems: MediaItem[];
  onUpdateMediaItems: (updatedItems: MediaItem[]) => void;
}

type AdminTab = 'overview' | 'mirrors' | 'users' | 'subscriptions';

export default function AdminView({ mediaItems, onUpdateMediaItems }: AdminViewProps) {
  
  // Tab control
  const [activeTab, setActiveTab] = useState<AdminTab>('mirrors');
  
  // Search & Edit state for Mirror Manager
  const [editingMirror, setEditingMirror] = useState<{ mediaId: string; mirrorId: string; path: string; name: string } | null>(null);
  
  // Create state for new mirror addition
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTargetMediaId, setSelectedTargetMediaId] = useState(mediaItems[0]?.id || '');
  const [newMirrorName, setNewMirrorName] = useState('');
  const [newMirrorUrl, setNewMirrorUrl] = useState('');
  
  // Genre filter state
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'movie' | 'show'>('all');

  // Extract statistics dynamically
  const totalSubscribers = 4321;
  const activeStreams = 1204;
  const deadMirrors = 3; // "Pale Signal" (Server 2), "Silhouette Chronicles" (S1E1 - Server 3)
  const monthlyProceeds = 43105.50;

  // Sync / Edit action helpers
  const handleEditMirrorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMirror) return;

    // Mutate and map through mediaItems array to replace mirror details
    const updated = mediaItems.map((media) => {
      // If matching directly
      if (media.id === editingMirror.mediaId) {
        const updatedMirrors = media.mirrors.map((m) => {
          if (m.id === editingMirror.mirrorId) {
            return { ...m, url: editingMirror.path, name: editingMirror.name, status: 'active' as const, delay: '32ms' };
          }
          return m;
        });

        // Search in seasons/episodes as well
        const updatedSeasons = media.seasons?.map((season) => {
          const updatedEpisodes = season.episodes.map((episode) => {
            const updatedEpMirrors = episode.mirrors.map((m) => {
              if (m.id === editingMirror.mirrorId) {
                return { ...m, url: editingMirror.path, name: editingMirror.name, status: 'active' as const, delay: '28ms' };
              }
              return m;
            });
            return { ...episode, mirrors: updatedEpMirrors };
          });
          return { ...season, episodes: updatedEpisodes };
        });

        return { ...media, mirrors: updatedMirrors, seasons: updatedSeasons };
      }
      return media;
    });

    onUpdateMediaItems(updated);
    setEditingMirror(null);
    alert('Mirror updated successfully! Channel status check is now GREEN.');
  };

  // Add new mirror to existing item
  const handleAddNewMirror = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMirrorName || !newMirrorUrl) {
      alert('Please fill out all fields.');
      return;
    }

    const uniqueId = 'mir-' + Math.floor(Math.random() * 8999 + 1000);
    const newMirrorDef: Mirror = {
      id: uniqueId,
      name: newMirrorName,
      url: newMirrorUrl,
      status: 'active',
      delay: '44ms'
    };

    const updated = mediaItems.map((media) => {
      if (media.id === selectedTargetMediaId) {
        return {
          ...media,
          mirrors: [...media.mirrors, newMirrorDef]
        };
      }
      return media;
    });

    onUpdateMediaItems(updated);
    setNewMirrorName('');
    setNewMirrorUrl('');
    setShowAddForm(false);
    alert(`Success: Integrated high speed gateway node [${uniqueId}] stream!`);
  };

  // Delete a mirror
  const handleDeleteMirror = (mediaId: string, mirrorId: string) => {
    if (!confirm('Are you sure you want to shut down this decentralized content stream?')) return;

    const updated = mediaItems.map((media) => {
      if (media.id === mediaId) {
        const updatedMirrors = media.mirrors.filter(m => m.id !== mirrorId);
        const updatedSeasons = media.seasons?.map((season) => {
          const updatedEpisodes = season.episodes.map((episode) => {
            const updatedEpMirrors = episode.mirrors.filter(m => m.id !== mirrorId);
            return { ...episode, mirrors: updatedEpMirrors };
          });
          return { ...season, episodes: updatedEpisodes };
        });
        return { ...media, mirrors: updatedMirrors, seasons: updatedSeasons };
      }
      return media;
    });

    onUpdateMediaItems(updated);
    alert('Mirror removed from routing map.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24" id="admin-hub-dashboard">
      
      {/* 1. TOP HEADER BRAND */}
      <div className="mb-8 pb-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 text-[10px] text-cyan-400 px-2 py-0.5 rounded uppercase font-mono tracking-wider mb-2 self-start">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Root Admin access granted</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">
            SFlix-Next Admin Central
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Real-time control cluster for active streaming mirrors, subscribers, and node metrics files
          </p>
        </div>

        <div className="bg-slate-900 px-4 py-2 border border-white/5 rounded-xl font-mono text-xs text-slate-400 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Server status: <span className="text-emerald-400 font-bold">STABLE</span></span>
        </div>
      </div>

      {/* 2. CHUNKY CORE DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="admin-stats-widgets">
        
        {/* Stat 1 */}
        <div className="p-5 border border-white/5 bg-slate-900/30 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Active Channels</span>
            <LayoutDashboard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white leading-none">
              {activeStreams}
            </h3>
            <p className="text-[9px] text-emerald-400 font-bold font-mono uppercase">● 100% optimized</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 border border-white/5 bg-slate-900/30 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">VIP Pass Subscribers</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white leading-none">
              {totalSubscribers}
            </h3>
            <p className="text-[9px] text-slate-500 font-mono">+18% growth this month</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 border-2 border-rose-500/30 bg-rose-500/5 rounded-2xl space-y-2 neon-glow-purple">
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Mirror alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-rose-400 leading-none">
              {deadMirrors}
            </h3>
            <p className="text-[9px] text-rose-500 font-bold font-mono uppercase animate-pulse">!! Manual Intervention Required</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 border border-white/5 bg-slate-900/30 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-mono uppercase tracking-widest">Proceeds Volume</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-400 leading-none">
              ${monthlyProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[9px] text-slate-500 font-mono">Net recurrent volume</p>
          </div>
        </div>

      </div>

      {/* 3. LAYOUT WITH SIDEBAR AND MAIN DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-650 to-blue-500 text-white shadow-lg neon-glow-purple'
                : 'bg-slate-900/30 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('mirrors')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 ${
              activeTab === 'mirrors'
                ? 'bg-gradient-to-r from-purple-650 to-blue-500 text-white shadow-lg neon-glow-purple'
                : 'bg-slate-900/30 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Mirror Link Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-650 to-blue-500 text-white shadow-lg neon-glow-purple'
                : 'bg-slate-900/30 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`w-full p-3 rounded-xl text-left text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-3 ${
              activeTab === 'subscriptions'
                ? 'bg-gradient-to-r from-purple-650 to-blue-500 text-white shadow-lg neon-glow-purple'
                : 'bg-slate-900/30 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Billing &amp; Subs Metrics</span>
          </button>

        </div>

        {/* Main interactive panel based on active tabs */}
        <div className="lg:col-span-9 bg-slate-900/20 rounded-2xl border border-white/5 p-6 min-h-[400px]">
          
          {editingMirror && (
            /* Pop-up quick overlay wrapper to edit active path */
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 p-6 space-y-4"
              >
                <div>
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wider">
                    Edit Mirror Stream Path
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">ID Target: {editingMirror.mirrorId}</p>
                </div>

                <form onSubmit={handleEditMirrorSubmit} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400">Stream Mirror Name</label>
                    <input 
                      required
                      type="text"
                      value={editingMirror.name}
                      onChange={(e) => setEditingMirror({ ...editingMirror, name: e.target.value })}
                      className="bg-slate-950 text-white rounded-lg p-3 text-xs border border-white/10 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400">Stream Source URL (.mp4 / HLS)</label>
                    <input 
                      required
                      type="text"
                      value={editingMirror.path}
                      onChange={(e) => setEditingMirror({ ...editingMirror, path: e.target.value })}
                      className="bg-slate-950 text-white font-mono rounded-lg p-3 text-xs border border-white/10 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      type="submit"
                      className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase transition"
                    >
                      Authorize Update Link
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingMirror(null)}
                      className="p-2 px-4 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {activeTab === 'mirrors' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/5 gap-4">
                <div>
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wider">
                    HLS Mirror Index Map
                  </h3>
                  <p className="text-xs text-slate-500">Route paths list dynamically assigned to the player catalog</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Media Type Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={selectedMediaType}
                      onChange={(e) => setSelectedMediaType(e.target.value as 'all' | 'movie' | 'show')}
                      className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg p-2 outline-none"
                    >
                      <option value="all">All Media</option>
                      <option value="movie">Movies</option>
                      <option value="show">TV Shows</option>
                    </select>
                  </div>
                  
                  {/* Genre Filter */}
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg p-2 outline-none"
                  >
                    {GENRES.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2 px-3 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Mirror</span>
                  </button>
                </div>
              </div>

              {/* Add mirror form toggle */}
              {showAddForm && (
                <motion.form 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddNewMirror}
                  className="p-4 rounded-xl border border-white/15 bg-slate-950/80 space-y-4 font-sans"
                >
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Create New Mirror Node Link</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500">Select Media target</label>
                      <select
                        value={selectedTargetMediaId}
                        onChange={(e) => setSelectedTargetMediaId(e.target.value)}
                        className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg p-2.5 outline-none"
                      >
                        {mediaItems
                          .filter(m => selectedMediaType === 'all' || m.type === selectedMediaType)
                          .filter(m => selectedGenre === 'All' || m.genre.includes(selectedGenre))
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.title} ({m.type})</option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500">Mirror Title/Carrier</label>
                      <input 
                        type="text" 
                        placeholder="Server 4 - AirLink CDN"
                        value={newMirrorName}
                        onChange={(e) => setNewMirrorName(e.target.value)}
                        className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg p-2.5 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-500">Direct MP4/Stream Link</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={newMirrorUrl}
                        onChange={(e) => setNewMirrorUrl(e.target.value)}
                        className="bg-slate-900 border border-white/10 text-slate-300 text-xs rounded-lg p-2.5 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase">Connect Node</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
                  </div>
                </motion.form>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full text-left font-sans text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 uppercase tracking-widest font-mono text-[10px]">
                      <th className="py-3 px-2">Target Content</th>
                      <th className="py-3 px-2">Mirror ID</th>
                      <th className="py-3 px-2">Mirror Carrier</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Stream Source Path</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      const allList: { mediaTitle: string; mediaId: string; mirror: Mirror }[] = [];
                      mediaItems
                        .filter(m => selectedMediaType === 'all' || m.type === selectedMediaType)
                        .filter(m => selectedGenre === 'All' || m.genre.includes(selectedGenre))
                        .forEach((media) => {
                          // Standard mirrors
                          media.mirrors.forEach((m) => {
                            allList.push({ mediaTitle: media.title, mediaId: media.id, mirror: m });
                          });

                          // Double lookup seasons & episodes
                          media.seasons?.forEach((season) => {
                            season.episodes.forEach((episode) => {
                              episode.mirrors.forEach((m) => {
                                allList.push({ 
                                  mediaTitle: `${media.title} (S${season.seasonNumber}E${episode.episodeNumber})`, 
                                  mediaId: media.id, 
                                  mirror: m 
                                });
                              });
                            });
                          });
                        });

                      return allList.map(({ mediaTitle, mediaId, mirror }) => {
                        const isDead = mirror.status === 'dead' || !mirror.url;
                        const isWarning = mirror.status === 'warning';
                        
                        return (
                          <tr key={mirror.id} className={`hover:bg-slate-900/10 transition-colors ${isDead ? 'bg-rose-500/5' : ''}`}>
                            <td className="py-3 px-2 font-semibold text-white truncate max-w-[120px]">{mediaTitle}</td>
                            <td className="py-3 px-2 font-mono text-[10px] text-slate-500">{mirror.id.toUpperCase()}</td>
                            <td className="py-3 px-2 text-slate-300 font-medium">{mirror.name}</td>
                            <td className="py-3 px-2">
                              {isDead ? (
                                <span className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 text-[9px] font-mono font-bold text-rose-400 px-2 py-0.5 rounded animate-pulse">
                                  TIMEOUT DEAD LINK
                                </span>
                              ) : isWarning ? (
                                <span className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-300 px-2 py-0.5 rounded">
                                  LAG WARNING
                                </span>
                              ) : (
                                <span className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded">
                                  OK SEEDING
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 font-mono text-[10px] text-slate-500 truncate max-w-[150px]" title={mirror.url}>
                              {mirror.url || '--- empty payload ---'}
                            </td>
                            <td className="py-3 px-2 text-right space-x-2">
                              <button
                                onClick={() => setEditingMirror({ mediaId, mirrorId: mirror.id, path: mirror.url, name: mirror.name })}
                                className="p-1.5 rounded bg-purple-500/10 text-cyan-400 hover:bg-purple-600 hover:text-white transition"
                                title="Edit Path Details"
                                id={`edit-mirror-link-${mirror.id}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMirror(mediaId, mirror.id)}
                                className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                                title="Delete Stream"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-base font-display font-medium text-white uppercase tracking-wider pb-3 border-b border-white/5">
                System Infrastructure Overview
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500">CDN ROUTING PROTOCOL</span>
                  <p className="text-xs font-semibold text-white">Anycast Decentral Cluster HLS Proxy</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500">ACTIVE BANDWIDTH PEAK</span>
                  <p className="text-xs font-semibold text-emerald-400 font-mono">1.25 Gbps (Realtime serving)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-950/20 text-center py-10 space-y-2">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold uppercase tracking-wide">Automatic Link Checker Daemon is Active</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Every 5 minutes, our secure cloud backend runs lightweight header requests against all registered mirror nodes to trace dead servers.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-base font-display font-medium text-white uppercase tracking-wider pb-3 border-b border-white/5">
                Connected Seeders &amp; Subscribers
              </h3>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold">john_doe_91</span>
                  </div>
                  <span className="bg-purple-500/10 border border-purple-500/30 text-cyan-400 px-2.5 py-0.5 rounded text-[10px] font-bold">ALL-ACCESS</span>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold">decentral_miner_0x</span>
                  </div>
                  <span className="bg-purple-500/10 border border-purple-500/30 text-cyan-400 px-2.5 py-0.5 rounded text-[10px] font-bold">ALL-ACCESS</span>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 flex justify-between items-center text-xs opacity-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="font-semibold">guest_39401</span>
                  </div>
                  <span className="bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-0.5 rounded text-[10px]">ALL-ACCESS</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h3 className="text-base font-display font-medium text-white uppercase tracking-wider pb-3 border-b border-white/5">
                Subscription Volume Ledger
              </h3>

              <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Authorized Volume (This week)</p>
                <p className="text-3xl font-display font-black text-emerald-400">$ 12,410.24</p>
                <p className="text-[10px] text-slate-500 font-mono">Real-time payment settle frequency: 99.98% OK</p>
              </div>

              <div className="space-y-2 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between pb-1.5 border-b border-white/5"><span>Latest pay ref: tx_1940a</span><span className="text-white font-bold">$9.99 Recurrent</span></div>
                <div className="flex justify-between pb-1.5 border-b border-white/5"><span>Latest pay ref: tx_29de1</span><span className="text-white font-bold">$9.99 Recurrent</span></div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

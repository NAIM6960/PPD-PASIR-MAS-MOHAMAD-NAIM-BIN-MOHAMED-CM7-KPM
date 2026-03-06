/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  Trophy,
  Info,
  ChevronRight,
  Settings,
  Save,
  X,
  Lock,
  Search
} from 'lucide-react';

interface ScoreEntry {
  id: number;
  rank: string;
  team: string;
  school: string;
  status: string;
  score: string;
  category: string;
}

export default function App() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [category, setCategory] = useState('rendah');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ score: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchScores();
  }, [category]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scores?category=${category}`);
      const data = await res.json();
      setScores(data);
    } catch (err) {
      console.error("Failed to fetch scores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasswordModal(true);
    }
  };

  const verifyPassword = () => {
    // Hardcoded password for simplicity as requested
    if (password === 'kdec2026') {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Kata laluan salah!');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await fetch('/api/scores/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editData })
      });
      setEditingId(null);
      fetchScores();
    } catch (err) {
      alert("Gagal mengemas kini markah");
    }
  };

  const filteredScores = scores.filter(s => 
    s.team.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans selection:bg-neon-cyan/30">
      {/* Background Effects */}
      <div className="lightning-bg" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none z-[-1]" />
      
      {/* Header / Nav */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/1200px-Coat_of_arms_of_Malaysia.svg.png" 
                alt="Jata Negara" 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-glow">K-DEC 2026</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#info" className="hover:text-neon-cyan transition-colors">Maklumat</a>
            <a href="#syarat" className="hover:text-neon-cyan transition-colors">Syarat</a>
            <a href="#tarikh" className="hover:text-neon-cyan transition-colors">Tarikh Penting</a>
            <a href="#scoreboard" className="hover:text-neon-cyan transition-colors">Live Score</a>
            <button 
              onClick={handleAdminToggle}
              className={`p-2 rounded-lg transition-colors ${isAdmin ? 'text-neon-cyan bg-neon-cyan/10' : 'text-gray-500 hover:text-white'}`}
              title="Admin Mode"
            >
              {isAdmin ? <Settings className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
            <a 
              href="https://forms.gle/sZb58h1RhKXSTaqw9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-neon-purple/20 border border-neon-purple/50 rounded-full text-neon-purple hover:bg-neon-purple hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        
        {/* Hero Section */}
        <section id="info" className="relative flex flex-col items-center text-center space-y-8 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-neon-cyan font-display text-sm tracking-[0.3em] uppercase font-semibold">
              Jabatan Pendidikan Negeri Kelantan
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight">
              PERTANDINGAN CABARAN <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple text-glow">
                MIKROBOTIK
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Kit Pembelajaran Robotik Alaf Baru. Mencungkil bakat inovasi dan kreativiti murid sekolah rendah dan menengah negeri Kelantan.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-neon-purple/20"
          >
            <img 
              src="https://iili.io/qCLzMmv.png" 
              alt="Mikrobotik Kit" 
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4 justify-between items-end">
              <div className="glass-card p-4 rounded-xl border-neon-cyan/30">
                <p className="text-xs text-neon-cyan font-display uppercase tracking-widest mb-1">Kod Pertandingan</p>
                <p className="text-2xl font-display font-bold">K-DEC 2026</p>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center border-white/10">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/1200px-Coat_of_arms_of_Malaysia.svg.png" alt="KPM" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Live Scoreboard Section */}
        <section id="scoreboard" className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <span className="text-red-500 font-display text-xs tracking-widest uppercase font-bold">Live Updates</span>
              </div>
              <h2 className="text-4xl font-display font-bold uppercase tracking-widest">Papan Skor Langsung</h2>
              <p className="text-gray-400">Keputusan terkini bagi saringan video dan penilaian juri.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari pasukan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 pl-10 glass-card rounded-lg text-sm border-white/10 focus:border-neon-cyan outline-none transition-all w-full md:w-64"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCategory('rendah')}
                  className={`px-4 py-2 glass-card rounded-lg text-sm border-neon-cyan/30 font-bold transition-all ${category === 'rendah' ? 'text-neon-cyan bg-neon-cyan/10' : 'text-gray-400'}`}
                >
                  Sekolah Rendah
                </button>
                <button 
                  onClick={() => setCategory('menengah')}
                  className={`px-4 py-2 glass-card rounded-lg text-sm border-white/10 font-bold transition-all ${category === 'menengah' ? 'text-white bg-white/10' : 'text-gray-400'}`}
                >
                  Sekolah Menengah
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card rounded-[2rem] overflow-hidden border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-8 py-6 font-display text-xs uppercase tracking-widest text-gray-400">Rank</th>
                      <th className="px-8 py-6 font-display text-xs uppercase tracking-widest text-gray-400">Pasukan</th>
                      <th className="px-8 py-6 font-display text-xs uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 font-display text-xs uppercase tracking-widest text-gray-400 text-right">Markah</th>
                      {isAdmin && <th className="px-8 py-6 font-display text-xs uppercase tracking-widest text-gray-400 text-center">Tindakan</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={isAdmin ? 5 : 4} className="px-8 py-12 text-center text-gray-500">Memuatkan data...</td>
                      </tr>
                    ) : filteredScores.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 5 : 4} className="px-8 py-12 text-center text-gray-500">Tiada pasukan dijumpai.</td>
                      </tr>
                    ) : filteredScores.map((row, i) => (
                      <motion.tr 
                        key={row.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-8 py-6 font-display font-bold text-neon-purple">{row.rank}</td>
                        <td className="px-8 py-6 font-bold group-hover:text-neon-cyan transition-colors">
                          <div>{row.team}</div>
                          <div className="text-[10px] text-gray-500 font-normal">{row.school}</div>
                        </td>
                        <td className="px-8 py-6">
                          {editingId === row.id ? (
                            <select 
                              value={editData.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                              className="bg-gray-900 border border-white/20 rounded px-2 py-1 text-xs outline-none focus:border-neon-cyan"
                            >
                              <option value="Selesai">Selesai</option>
                              <option value="Penilaian">Penilaian</option>
                              <option value="Menunggu">Menunggu</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              row.status === "Selesai" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" : 
                              row.status === "Penilaian" ? "border-amber-500/50 text-amber-400 bg-amber-500/10" : 
                              "border-gray-500/50 text-gray-400 bg-gray-500/10"
                            }`}>
                              {row.status}
                            </span>
                          )}
                        </td>
                        <td className={`px-8 py-6 text-right font-display font-bold text-xl ${row.score !== '--' ? 'text-neon-cyan' : 'text-gray-500'}`}>
                          {editingId === row.id ? (
                            <input 
                              type="text"
                              value={editData.score}
                              onChange={(e) => setEditData({ ...editData, score: e.target.value })}
                              className="w-20 bg-gray-900 border border-white/20 rounded px-2 py-1 text-right outline-none focus:border-neon-cyan"
                            />
                          ) : row.score}
                        </td>
                        {isAdmin && (
                          <td className="px-8 py-6 text-center">
                            {editingId === row.id ? (
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleUpdate(row.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500 hover:text-white transition-all">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingId(row.id);
                                  setEditData({ score: row.score, status: row.status });
                                }}
                                className="p-2 bg-white/5 text-gray-400 rounded hover:bg-white/10 hover:text-white transition-all"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-white/5 text-center">
                <button className="text-sm font-bold text-neon-cyan hover:underline flex items-center justify-center gap-2 mx-auto">
                  Lihat Semua Keputusan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-8 rounded-[2rem] border-neon-cyan/20 bg-gradient-to-br from-neon-cyan/5 to-transparent">
                <h3 className="text-xl font-display font-bold mb-4">Semak Status Saya</h3>
                <p className="text-sm text-gray-400 mb-6">Masukkan ID Penyertaan atau Nama Pasukan untuk melihat markah anda.</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Contoh: KDEC-2026-001" 
                    className="w-full px-4 py-3 glass-card rounded-xl border-white/10 focus:border-neon-cyan outline-none transition-all"
                  />
                  <button className="w-full py-4 bg-neon-cyan text-gray-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-neon-cyan/20">
                    Semak Keputusan
                  </button>
                </div>
              </div>
              
              <div className="glass-card p-8 rounded-[2rem] border-white/5">
                <h4 className="text-sm font-display font-bold text-gray-400 uppercase tracking-widest mb-4">Statistik Semasa</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-500 uppercase">Penyertaan Diterima</span>
                    <span className="text-2xl font-display font-bold">124</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-500 uppercase">Dalam Penilaian</span>
                    <span className="text-2xl font-display font-bold">42</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="tarikh" className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold uppercase tracking-widest">Tarikh Penting</h2>
            <p className="text-gray-400">Pastikan anda tidak terlepas tarikh-tarikh utama pertandingan.</p>
            <div className="h-1 w-24 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent opacity-30" />

            <div className="space-y-12">
              {[
                { 
                  date: "15 MAC 2026", 
                  title: "Taklimat Pertandingan", 
                  desc: "Sesi taklimat teknikal dan syarat-syarat pertandingan secara dalam talian.", 
                  icon: Info, 
                  color: "text-neon-cyan", 
                  bg: "bg-neon-cyan/10",
                  link: "https://meet.google.com/xyo-pjdp-ixv",
                  linkText: "Sertai Google Meet"
                },
                { 
                  date: "10 – 14 APRIL 2026", 
                  title: "Penghantaran Video", 
                  desc: "Sila hantar video rakaman robot anda melalui borang rasmi.", 
                  icon: Video, 
                  color: "text-neon-purple", 
                  bg: "bg-neon-purple/10",
                  link: "https://forms.gle/sZb58h1RhKXSTaqw9",
                  linkText: "Hantar Video"
                },
                { 
                  date: "15 – 16 APRIL 2026", 
                  title: "Penjurian Saringan", 
                  desc: "Penilaian video oleh panel juri profesional untuk memilih finalis.", 
                  icon: Search, 
                  color: "text-neon-blue", 
                  bg: "bg-neon-blue/10"
                },
                { 
                  date: "29 & 30 JULAI 2026", 
                  title: "Peringkat Akhir (Final)", 
                  desc: "Pertandingan kemuncak secara bersemuka untuk menentukan juara K-DEC 2026.", 
                  icon: Trophy, 
                  color: "text-amber-400", 
                  bg: "bg-amber-400/10"
                },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-center gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Card */}
                  <div className="flex-1 md:w-1/2">
                    <div className={`glass-card p-6 rounded-2xl border-white/5 hover:border-white/20 transition-all group relative ${i % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                      <div className="space-y-2">
                        <span className={`text-xs font-display font-bold tracking-widest uppercase ${item.color}`}>{item.date}</span>
                        <h3 className="text-xl font-display font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                        {item.link && (
                          <div className="pt-4">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 text-xs font-bold ${item.color} hover:underline`}
                            >
                              {item.linkText} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      {/* Arrow for Desktop */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 glass-card rotate-45 border-white/5 ${i % 2 === 0 ? '-right-2 border-l-0 border-b-0' : '-left-2 border-r-0 border-t-0'}`} />
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full glass-card border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-gray-950">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    {/* Pulse Effect */}
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${item.bg}`} />
                  </div>

                  {/* Spacer for Desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section id="syarat" className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-display font-bold uppercase tracking-widest">Terma & Syarat</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, text: "Terbuka kepada semua murid sekolah rendah dan menengah negeri Kelantan", color: "text-neon-cyan" },
              { icon: Users, text: "Satu Pasukan : 1 guru + 2 murid / pelajar", color: "text-neon-blue" },
              { icon: Globe, text: "Mode Penyertaan : Online (saringan)", color: "text-neon-purple" },
              { icon: Trophy, text: "Penyertaan PERCUMA!", color: "text-emerald-400" },
              { icon: CheckCircle2, text: "Pengiktirafan PAJSK Peringkat Negeri!", color: "text-amber-400" },
              { icon: Cpu, text: "Menggunakan Kit Mikrobotik Alaf Baru", color: "text-neon-cyan" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl flex items-center gap-4 border-white/5 hover:border-white/20 transition-colors"
              >
                <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="font-medium text-gray-200">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center space-y-8 bg-gradient-to-br from-neon-purple/20 via-gray-950 to-neon-blue/20 border border-white/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-4xl md:text-5xl font-display font-bold relative z-10">
            Sedia Untuk Cabaran <br />
            <span className="text-neon-cyan">Masa Hadapan?</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto relative z-10">
            Jangan lepaskan peluang untuk memenangi hadiah menarik dan sijil pengiktirafan peringkat negeri.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <a 
              href="https://forms.gle/sZb58h1RhKXSTaqw9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white text-gray-950 rounded-full font-bold text-lg hover:bg-neon-cyan hover:text-white transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Daftar Sekarang
            </a>
            <button className="px-10 py-4 glass-card border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Muat Turun Syarat
            </button>
          </div>
        </section>

      </main>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 rounded-3xl border-neon-cyan/30 max-w-sm w-full space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold">Admin Login</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Sila masukkan kata laluan untuk mengakses fungsi kemas kini markah.</p>
                <input 
                  type="password" 
                  placeholder="Kata Laluan" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
                  className="w-full px-4 py-3 glass-card rounded-xl border-white/10 focus:border-neon-cyan outline-none transition-all"
                  autoFocus
                />
                <button 
                  onClick={verifyPassword}
                  className="w-full py-4 bg-neon-cyan text-gray-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-neon-cyan/20"
                >
                  Masuk
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="glass-card border-t border-white/5 mt-24 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                <img 
                  src="https://iili.io/qnZTJ4e.png" 
                  alt="K-DEC Logo" 
                  className="w-8 h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-wider">K-DEC 2026</span>
            </div>
            <p className="text-gray-400 text-sm">
              Inisiatif Jabatan Pendidikan Negeri Kelantan untuk memperkasakan pendidikan STEM dan robotik di kalangan generasi muda.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-neon-cyan">Anjuran</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Kementerian Pendidikan Malaysia</li>
              <li>Jabatan Pendidikan Negeri Kelantan</li>
              <li>PPD Pasir Mas</li>
              <li>USTP Pasir Mas Digital</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-neon-purple">Hubungi Kami</h4>
            <p className="text-sm text-gray-400">
              Untuk sebarang pertanyaan lanjut, sila hubungi penyelaras pertandingan di PPD masing-masing.
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:border-neon-cyan transition-colors cursor-pointer">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <button 
                onClick={() => window.location.href = 'mailto:ppd-d020-cm7@moe-dl.edu.my'}
                className="w-10 h-10 glass-card rounded-lg flex items-center justify-center hover:border-neon-cyan transition-colors cursor-pointer"
                title="Hubungi Penyelaras"
              >
                <Users className="w-5 h-5 text-gray-400" />
              </button>
              <div className="ml-auto">
                <img 
                  src="https://iili.io/qCLyA12.png" 
                  alt="K-DEC Logo" 
                  className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
          &copy; 2026 Pertandingan Cabaran Mikrobotik (K-DEC) Kelantan. USTP Pasir Mas. Hak Cipta Terpelihara.
        </div>
      </footer>
    </div>
  );
}

// Helper component for Globe icon since it's used
function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

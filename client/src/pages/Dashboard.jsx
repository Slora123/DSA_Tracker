import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { getStats, fetchProblems } from '../utils/api';
import { format, isSameDay, isWeekend, startOfDay } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSolved: 0, revisionPending: 0, streak: 0 });
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, problemsRes] = await Promise.all([getStats(), fetchProblems()]);
        setStats(statsRes.data);
        setProblems(problemsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const today = startOfDay(new Date());
  const isWeekendDay = isWeekend(today);
  const todayTasks = problems.filter(p => {
    const pDate = startOfDay(new Date(p.nextRevisionDate));
    if (isWeekendDay) {
      return pDate <= today;
    }
    return pDate < today;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold mb-2">Welcome back, Solver!</h2>
        <p className="text-gray-400">Here's your DSA progress at a glance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon={CheckCircle} 
          label="Total Solved" 
          value={stats.totalSolved} 
          color="text-blue-500" 
          bgColor="bg-blue-500/10"
        />
        <StatCard 
          icon={AlertCircle} 
          label="Revision Pending" 
          value={stats.revisionPending} 
          color="text-amber-500" 
          bgColor="bg-amber-500/10"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Streak" 
          value={`${stats.streak} Days`} 
          color="text-emerald-500" 
          bgColor="bg-emerald-500/10"
        />
        <StatCard 
          icon={BookOpen} 
          label="Concepts Mastered" 
          value={new Set(problems.map(p => p.concept)).size} 
          color="text-purple-500" 
          bgColor="bg-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass rounded-3xl p-6 border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's Revision Tasks
            </h3>
            
            <div className="space-y-4">
              {todayTasks.length > 0 ? todayTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-12 rounded-full",
                      task.difficulty === 'Hard' ? 'bg-red-500' : task.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    )} />
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{task.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{task.concept}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{task.platform}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all">
                    Complete Revision
                  </button>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No revisions scheduled for today. Great job!</p>
                </div>
              )}
            </div>
          </section>

          {/* Activity Log */}
          <section className="glass rounded-3xl p-6 border border-white/5">
            <h3 className="text-xl font-bold mb-6">Activity Log</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(
                problems.reduce((acc, p) => {
                  const date = format(new Date(p.dateSolved), 'MMM d, yyyy');
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(p);
                  return acc;
                }, {})
              ).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, dayProblems]) => (
                <div key={date} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-bold text-primary">{date}</span>
                  <div className="flex flex-wrap gap-2">
                    {dayProblems.map(p => (
                      <span key={p.id} className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {problems.length === 0 && (
                <p className="text-center py-8 text-gray-500">No activity yet. Start solving!</p>
              )}
            </div>
          </section>
        </div>

        {/* Quick Log */}
        <div className="space-y-6">
           {/* Placeholder for Quick Log component or recent problems */}
           <section className="glass rounded-3xl p-6 border border-white/5 h-full">
              <h3 className="text-xl font-bold mb-6">Recent Solves</h3>
              <div className="space-y-4">
                {problems.slice(0, 5).map(p => (
                   <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium flex-1 truncate">{p.name}</span>
                      <span className="text-xs text-gray-500">{format(new Date(p.dateSolved), 'MMM d')}</span>
                   </div>
                ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 card-hover">
      <div className={`${bgColor} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1 text-white">{value}</p>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

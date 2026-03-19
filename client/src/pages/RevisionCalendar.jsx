import React, { useEffect, useState } from 'react';
import { fetchProblems, markRevised, undoMarkRevised } from '../utils/api';
import { format, startOfWeek, addDays, isWeekend, isSameDay, startOfDay, isPast } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function RevisionCalendar() {
  const [problems, setProblems] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProblems = async () => {
    const res = await fetchProblems();
    setProblems(res.data);
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const monthStart = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const days = Array.from({ length: 42 }).map((_, i) => addDays(monthStart, i));

  const getDayTasks = (day) => {
    const dayStart = startOfDay(day);
    const now = startOfDay(new Date());
    const isToday = isSameDay(dayStart, now);

    const pending = problems.filter(p => {
      const pDate = startOfDay(new Date(p.nextRevisionDate));
      
      // If it's a weekend, show due tasks
      if (isWeekend(dayStart)) {
        if (isToday) return pDate <= dayStart;
        return isSameDay(pDate, dayStart);
      }
      
      // If it's a weekday, show only if overdue on "Today"
      if (isToday) {
        return pDate < dayStart;
      }
      
      return false;
    });

    const completed = problems.filter(p => 
      (p.lastRevisionDate && isSameDay(startOfDay(new Date(p.lastRevisionDate)), dayStart)) ||
      (p.solveHistory && p.solveHistory.some(d => isSameDay(startOfDay(new Date(d)), dayStart))) ||
      (p.previousNextRevisionDate && isSameDay(startOfDay(new Date(p.previousNextRevisionDate)), dayStart) && p.lastRevisionDate && isPast(new Date(p.lastRevisionDate)))
    );

    return { pending, completed };
  };

  const handleMarkDone = async (id) => {
    setLoading(true);
    try {
      await markRevised(id);
      await loadProblems();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async (id) => {
    setLoading(true);
    try {
      await undoMarkRevised(id);
      await loadProblems();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Revision Schedule</h2>
          <p className="text-gray-400">View your upcoming weekend revision load. Overdue tasks persist until completed.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
          <button onClick={() => setCurrentDate(addDays(currentDate, -30))} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold min-w-[140px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 30))} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="glass rounded-3xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white/[0.01]">
          {days.map((day, idx) => {
            const { pending, completed } = getDayTasks(day);
            const isToday = isSameDay(day, new Date());
            const activeMonth = day.getMonth() === currentDate.getMonth();
            const weekend = isWeekend(day);

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[140px] p-2 border-r border-b border-white/5 transition-all relative cursor-pointer hover:bg-white/[0.02]",
                  !activeMonth ? "opacity-20" : "",
                  weekend ? "bg-primary/5" : ""
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold",
                    isToday ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {(pending.length > 0 || completed.length > 0) && (
                    <div className="flex flex-col items-end gap-1">
                        {pending.length > 0 && (
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                pending.some(p => isPast(new Date(p.nextRevisionDate)) && !isSameDay(new Date(p.nextRevisionDate), new Date()))
                                ? "bg-red-500/20 text-red-400"
                                : "bg-primary/10 text-primary"
                            )}>
                            {pending.length} due
                            </span>
                        )}
                        {completed.length > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                                {completed.length} done
                            </span>
                        )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  {pending.slice(0, 2).map((task, tidx) => {
                    const isOverdue = isPast(new Date(task.nextRevisionDate)) && !isSameDay(new Date(task.nextRevisionDate), new Date());
                    return (
                        <div key={tidx} className={cn(
                            "text-[10px] p-1.5 rounded-lg border truncate flex items-center gap-1",
                            isOverdue ? "bg-red-500/5 border-red-500/20" : "bg-white/5 border-white/5"
                        )}>
                        <div className={cn(
                          "w-1 h-1 rounded-full shrink-0",
                          task.difficulty === 'Hard' ? 'bg-red-500' : task.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        )} />
                        <span className={cn("truncate", isOverdue ? "text-red-400" : "")}>{task.name}</span>
                        </div>
                    );
                  })}
                  {completed.slice(0, 1).map((task, tidx) => (
                    <div key={tidx} className="text-[10px] p-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-emerald-500/60 truncate flex items-center gap-1">
                         <CheckCircle2 className="w-2 h-2 shrink-0" />
                         <span className="truncate">{task.name}</span>
                    </div>
                  ))}
                  {(pending.length + completed.length) > 3 && (
                    <div className="text-[9px] text-gray-500 text-center py-1">
                      + {pending.length + completed.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task List Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="glass w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-6 space-y-6 max-h-[80vh] overflow-hidden flex flex-col">
                <header className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{format(selectedDay, 'MMMM d, yyyy')}</h3>
                        <p className="text-sm text-gray-400">Manage your revision tasks</p>
                    </div>
                    <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {/* Pending Section */}
                    <section className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                             <AlertCircle className="w-3 h-3" />
                             Pending Revisions ({getDayTasks(selectedDay).pending.length})
                        </h4>
                        <div className="space-y-2">
                            {getDayTasks(selectedDay).pending.length > 0 ? (
                                getDayTasks(selectedDay).pending.map((task, idx) => {
                                    const isOverdue = isPast(new Date(task.nextRevisionDate)) && !isSameDay(new Date(task.nextRevisionDate), new Date());
                                    return (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 group hover:border-primary/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    task.difficulty === 'Hard' ? 'bg-red-500' : task.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                                )} />
                                                <div>
                                                    <h4 className="font-bold">
                                                        {task.name}
                                                        {task.daysTaken > 1 && (
                                                            <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md">
                                                                {task.daysTaken} days
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-gray-500 uppercase tracking-tighter">{task.platform}</span>
                                                        <span className="text-gray-600">•</span>
                                                        <span className={isOverdue ? "text-red-500 font-bold" : "text-gray-500"}>
                                                            {isOverdue ? "OVERDUE" : "DUE"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                disabled={loading}
                                                onClick={() => handleMarkDone(task.id)}
                                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20"
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500 italic py-2">No pending revisions.</p>
                            )}
                        </div>
                    </section>

                    {/* Completed Section */}
                    <section className="space-y-3">
                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle2 className="w-3 h-3" />
                             Completed Today ({getDayTasks(selectedDay).completed.length})
                        </h4>
                        <div className="space-y-2">
                            {getDayTasks(selectedDay).completed.map((task, idx) => (
                                <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between gap-4 opacity-80">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                                        <div>
                                            <h4 className="font-bold text-emerald-500/60">
                                                {task.name}
                                                {task.daysTaken > 1 && (
                                                    <span className="ml-2 no-underline not-italic opacity-100 text-[9px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-md">
                                                        {task.daysTaken} days
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-[10px] text-emerald-500/40">
                                                {task.lastRevisionDate && isSameDay(new Date(task.lastRevisionDate), selectedDay) 
                                                    ? `REVISED AT ${format(new Date(task.lastRevisionDate), 'HH:mm')}`
                                                    : `SOLVED TODAY`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {/* Removed Undo Button */}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
      )}

      {/* Revision Load Legend */}
      <div className="flex gap-8 p-6 glass rounded-3xl border border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/20" />
            <span className="text-sm text-gray-400 font-medium tracking-tight">Overdue Task</span>
         </div>
         <div className="flex items-center gap-3 border-l border-white/10 pl-8">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span className="text-sm text-gray-400 font-medium">Easy</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-sm text-gray-400 font-medium">Medium</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-sm text-gray-400 font-medium">Hard</span>
         </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Table,
  Calendar,
  Search,
  Settings,
  Flame,
  LogOut,
  BookOpen
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

import { useAuth } from '../context/AuthContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: PlusCircle, label: 'Log Problem', id: 'log' },
  { icon: Table, label: 'Problems', id: 'table' },
  { icon: Calendar, label: 'Revision', id: 'revision' },
  { icon: BookOpen, label: 'Cheatsheet', id: 'neetcode' },
  { icon: Search, label: 'Explore', id: 'explore' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 glass h-screen sticky top-0 flex flex-col border-r border-white/5 pb-8">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 border border-white/10 bg-[#0F172A]">
          <img
            src="/favicon.svg"
            alt="DSA Tracker Logo"
            className="w-full h-full p-1.5"
          />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
          DSA Tracker
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-primary" : "group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">My Streak</p>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold text-white">12 Days</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.username}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Active Session</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors group"
            title="Logout"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}

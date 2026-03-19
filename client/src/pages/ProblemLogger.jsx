import React, { useState } from 'react';
import { Save, Globe, Code, Layers, BarChart } from 'lucide-react';
import { createProblem } from '../utils/api';

export default function ProblemLogger({ onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'LeetCode',
    concept: '',
    difficulty: 'Medium',
    leetcodeLink: '',
    dateSolved: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProblem(formData);
      setMessage('Problem logged successfully!');
      setFormData({
        name: '',
        platform: 'LeetCode',
        concept: '',
        difficulty: 'Medium',
        leetcodeLink: '',
        dateSolved: new Date().toISOString().split('T')[0],
      });
      if (onComplete) onComplete();
    } catch (err) {
      setMessage('Failed to log problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Log New Problem</h2>
        <p className="text-gray-400">Add a problem to your tracker and schedule its revision.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/5 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Problem Name</label>
            <div className="relative">
              <Code className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Two Sum"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
              <div className="relative">
                <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none appearance-none"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  <option>LeetCode</option>
                  <option>GeeksforGeeks</option>
                  <option>Codeforces</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Concept</label>
              <div className="relative">
                <Layers className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none"
                placeholder="e.g. DP, Graph"
                value={formData.concept}
                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
              <div className="relative">
                <BarChart className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none appearance-none"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date Solved</label>
              <input
                type="date"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
                value={formData.dateSolved}
                onChange={(e) => setFormData({ ...formData, dateSolved: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Problem Link (Optional)</label>
            <input
              type="url"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
              placeholder="https://leetcode.com/problems/..."
              value={formData.leetcodeLink}
              onChange={(e) => setFormData({ ...formData, leetcodeLink: e.target.value })}
            />
          </div>
        </div>

        {message && (
          <p className={cn("text-sm", message.includes('success') ? 'text-emerald-500' : 'text-red-500')}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full premium-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Logging...' : (
            <>
              <Save className="w-5 h-5" />
              Log Problem
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

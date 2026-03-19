import React, { useEffect, useState } from 'react';
import { ExternalLink, Plus, ChevronDown, ChevronRight, BookOpen, Search } from 'lucide-react';
import axios from 'axios';
import { createProblem } from '../utils/api';

const API_BASE = 'http://localhost:5001/api';

export default function NeetCode150() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchNeetCode() {
      try {
        const res = await axios.get(`${API_BASE}/neetcode`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNeetCode();
  }, []);

  const toggleCategory = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const logProblem = async (name, difficulty, url, category) => {
    try {
      await createProblem({
        name,
        difficulty,
        leetcodeLink: url,
        concept: category,
        platform: 'LeetCode',
        dateSolved: new Date().toISOString().split('T')[0]
      });
      setMessage(`"${name}" added to tracker!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to log problem.');
    }
  };

  // Filter categories and problems
  const filteredData = Object.entries(data).reduce((acc, [category, problems]) => {
    const matchingProblems = Object.entries(problems).filter(([name]) => 
      name.toLowerCase().includes(search.toLowerCase()) || 
      category.toLowerCase().includes(search.toLowerCase())
    );
    
    if (matchingProblems.length > 0) {
      acc[category] = Object.fromEntries(matchingProblems);
    }
    return acc;
  }, {});

  if (loading) return <div className="p-8 text-center text-gray-400">Loading NeetCode list...</div>;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Cheatsheet</h2>
          <p className="text-gray-400">Curated list of 150 essential LeetCode problems.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search cheatsheet..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:border-primary outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {message && (
        <div className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 z-50">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(filteredData).map(([category, problems]) => (
          <div key={category} className="glass rounded-3xl border border-white/5 overflow-hidden">
            <button 
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">{category}</h3>
                  <p className="text-xs text-gray-500">{Object.keys(problems).length} Problems</p>
                </div>
              </div>
              {expanded[category] ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
            </button>

            {expanded[category] && (
              <div className="border-t border-white/5 bg-white/[0.01]">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase text-gray-500 tracking-widest bg-white/[0.02]">
                    <tr>
                      <th className="px-8 py-3 font-bold">Problem</th>
                      <th className="px-8 py-3 font-bold">Difficulty</th>
                      <th className="px-8 py-3 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(problems).map(([name, info]) => (
                      <tr key={name} className="hover:bg-white/[0.02] group transition-colors">
                        <td className="px-8 py-4">
                          <a 
                            href={info.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-medium group-hover:text-primary transition-colors"
                          >
                            {name}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </td>
                        <td className="px-8 py-4">
                          <span className={cn(
                            "text-xs font-bold",
                            info.difficulty === 'Hard' ? 'text-red-500' : info.difficulty === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                          )}>
                            {info.difficulty}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex justify-center">
                            <button 
                              onClick={() => logProblem(name, info.difficulty, info.url, category)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                              title="Log to tracker"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

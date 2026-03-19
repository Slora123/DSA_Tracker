import React, { useEffect, useState } from 'react';
import { ExternalLink, Filter, Search, Download, Trash2 } from 'lucide-react';
import { fetchProblems, deleteProblem } from '../utils/api';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  async function loadProblems() {
    try {
      const res = await fetchProblems();
      setProblems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleDelete(id, name) {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProblem(id);
        loadProblems();
      } catch (err) {
        console.error(err);
        alert('Failed to delete problem.');
      }
    }
  }

  const filtered = problems.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.concept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Problem Repository</h2>
          <p className="text-gray-400">Manage your solved problems.</p>
        </div>
      </header>

      <div className="glass rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search problems or concepts..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:border-primary outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Problem</th>
                <th className="px-6 py-4 font-semibold">Concept</th>
                <th className="px-6 py-4 font-semibold">Difficulty</th>
                <th className="px-6 py-4 font-semibold">Solved Date</th>
                <th className="px-6 py-4 font-semibold">Next Revision</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-primary transition-colors">{p.name}</span>
                      <span className="text-xs text-gray-500">{p.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-400">{p.concept}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold",
                      p.difficulty === 'Hard' ? 'text-red-500' : p.difficulty === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    )}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {format(new Date(p.dateSolved), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {format(new Date(p.nextRevisionDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {p.leetcodeLink && (
                      <a 
                        href={p.leetcodeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No problems found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

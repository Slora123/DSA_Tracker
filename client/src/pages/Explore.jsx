import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Plus, Loader2, Tag } from 'lucide-react';
import { createProblem, searchLeetCode, fetchConcepts } from '../utils/api';

export default function Explore() {
  const [concept, setConcept] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [results, setResults] = useState({ neetcodeTop: [], extrasTop: [], relatedMatches: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableConcepts, setAvailableConcepts] = useState([]);

  useEffect(() => {
    const loadConcepts = async () => {
      try {
        const res = await fetchConcepts();
        setAvailableConcepts(res.data);
      } catch (err) {
        console.error('Failed to load concepts:', err);
      }
    };
    loadConcepts();
  }, []);

  const performSearch = async (searchConcept, searchDifficulty) => {
    setLoading(true);
    try {
      const res = await searchLeetCode(searchConcept || concept, searchDifficulty || difficulty);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!concept && !difficulty) return;
    performSearch();
  };

  const handleConceptClick = (c) => {
    setConcept(c);
    performSearch(c);
  };

  const handleLog = async (q) => {
    try {
      await createProblem({
        name: q.name,
        difficulty: q.difficulty,
        leetcodeLink: q.link,
        concept: q.tags[0],
        platform: 'LeetCode',
        dateSolved: new Date().toISOString().split('T')[0]
      });
      setMessage(`"${q.name}" added to tracker!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to log problem.');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">Explore Problems</h2>
        <p className="text-gray-400">Master Data Structures and Algorithms with curated problem sets.</p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">Popular Concepts</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableConcepts.map((c) => (
            <button
              key={c}
              onClick={() => handleConceptClick(c)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                concept === c 
                  ? "premium-gradient text-white border-transparent" 
                  : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={handleSearch} className="glass p-6 rounded-3xl border border-white/5 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search any topic..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:border-primary outline-none"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <select
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary appearance-none min-w-[120px]"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            if (concept) performSearch(concept, e.target.value);
          }}
        >
          <option value="">Any Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 premium-gradient text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {message && (
        <div className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right duration-300 z-50">
          {message}
        </div>
      )}

      <div className="space-y-16">
        {results.neetcodeTop && results.neetcodeTop.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 premium-gradient rounded-full" />
                <h3 className="text-xl font-bold">NeetCode Cheatsheet</h3>
              </div>
              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Core Problems</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.neetcodeTop.map((q, idx) => (
                <ProblemCard key={idx} q={q} onLog={handleLog} />
              ))}
            </div>
          </section>
        )}

        {results.extrasTop && results.extrasTop.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-xl font-bold">Extra LeetCode Problems</h3>
              </div>
              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Community Curated</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.extrasTop.map((q, idx) => (
                <ProblemCard key={idx} q={q} onLog={handleLog} />
              ))}
            </div>
          </section>
        )}

        {results.relatedMatches && results.relatedMatches.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gray-500 rounded-full" />
              <h3 className="text-xl font-bold text-gray-400">Other Problems in these Categories</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
              {results.relatedMatches.map((q, idx) => (
                <ProblemCard key={idx} q={q} onLog={handleLog} />
              ))}
            </div>
          </section>
        )}

        {!loading && (!results.neetcodeTop || results.neetcodeTop.length === 0) && (!results.extrasTop || results.extrasTop.length === 0) && (!results.relatedMatches || results.relatedMatches.length === 0) && (
           <div className="py-20 text-center text-gray-500">
             {concept || difficulty ? 'No problems found matching your criteria.' : 'Select a concept or search to explore problems.'}
           </div>
        )}
      </div>
    </div>
  );
}

function ProblemCard({ q, onLog }) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 card-hover relative group">
      <div className="flex justify-between items-start mb-4">
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-lg",
          q.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' : q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
        )}>
          {q.difficulty}
        </span>
        <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
      <h4 className="text-lg font-bold mb-3 leading-tight group-hover:text-primary transition-colors">{q.name}</h4>
      <div className="flex flex-wrap gap-2 mb-6">
        {q.tags.slice(0, 3).map((tag, tIdx) => (
          <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{tag}</span>
        ))}
      </div>
      <button 
        onClick={() => onLog(q)}
        className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all"
      >
        <Plus className="w-4 h-4" />
        Log This Problem
      </button>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

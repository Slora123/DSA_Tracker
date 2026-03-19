import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4">
      <div className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 mb-4 shadow-lg shadow-purple-500/20">
            <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Start your DSA mastery today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="johndoe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Create Account
                <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

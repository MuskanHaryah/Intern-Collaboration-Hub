import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeStore from '../stores/themeStore';
import ThemeToggle from '../components/UI/ThemeToggle';
import authService from '../services/authService';

export default function ForgotPasswordPage() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await authService.forgotPassword(email);
      setMessage(result.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#0a0a0f]' : 'bg-[#f8f9fc]'
    }`}>
      {/* Background effects */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20' 
          : 'bg-gradient-to-br from-purple-100/60 via-transparent to-pink-100/60'
      }`} />
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-pink-500/10' : 'bg-pink-300/20'
      }`} />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>CollabHub</span>
          </Link>
        </div>

        {/* Card */}
        <div className={`backdrop-blur-xl rounded-2xl p-8 shadow-2xl border transition-colors duration-500 ${
          isDark 
            ? 'bg-[#12121a]/80 border-white/10' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Forgot Password</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter your email and we'll send you a reset link
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{message}</span>
              </div>
            </motion.div>
          )}

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                    isDark 
                      ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="you@example.com"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Check your email inbox for the reset link. The link expires in 10 minutes.
              </p>
              <button
                onClick={() => { setSent(false); setMessage(''); setEmail(''); }}
                className={`text-sm font-medium transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
              >
                Try a different email
              </button>
            </div>
          )}

          <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Remember your password?{' '}
            <Link
              to="/login"
              className={`font-medium transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

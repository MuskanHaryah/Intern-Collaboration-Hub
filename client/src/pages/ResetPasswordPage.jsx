import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeStore from '../stores/themeStore';
import ThemeToggle from '../components/UI/ThemeToggle';
import authService from '../services/authService';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ show }) => show ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

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
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reset Password</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter your new password below
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

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Password Reset Successful!
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Redirecting you to the dashboard...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 pr-12 border rounded-xl transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                      isDark 
                        ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                      isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <EyeIcon show={showPassword} />
                  </button>
                </div>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3 pr-12 border rounded-xl transition-all focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                      isDark 
                        ? 'bg-[#1a1a2e] border-white/10 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                      isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <EyeIcon show={showConfirmPassword} />
                  </button>
                </div>
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
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </motion.button>
            </form>
          )}

          <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Back to{' '}
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

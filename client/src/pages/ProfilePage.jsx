import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout'; 
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';
import api from '../services/api';

export default function ProfilePage() {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const user = useAuthStore((s) => s.user);
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [userStats, setUserStats] = useState({
    projectsCount: 0,
    tasksCompleted: 0,
    joinedDate: null
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Get current user profile data
      const response = await api.get('/auth/me');
      const userData = response.data.data || response.data;
      setProfileData(userData);
      
      // Get user stats - projects count
      const projectsResponse = await api.get('/projects');
      const projects = projectsResponse.data.data || [];
      
      setUserStats({
        projectsCount: projects.length,
        tasksCompleted: 0, // You can implement task counting later
        joinedDate: new Date(userData.createdAt)
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (date) => {
    if (!date) return 'Recently';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      intern: 'Intern',
      mentor: 'Mentor', 
      admin: 'Administrator'
    };
    return roleMap[role] || 'Member';
  };

  const getRoleColor = (role) => {
    const colorMap = {
      intern: 'from-blue-500 to-cyan-400',
      mentor: 'from-emerald-500 to-teal-400',
      admin: 'from-purple-500 to-pink-400'
    };
    return colorMap[role] || 'from-gray-500 to-gray-400';
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile" subtitle="View and manage your profile">
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}`} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile" subtitle="View and manage your profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          {/* Cover Background */}
          <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-6 text-white">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-sm font-medium opacity-90">CollabHub Member</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-16 mb-4">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRoleColor(profileData.role || user?.role)} p-1`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl ${isDark ? 'bg-[#12121a]' : 'bg-white text-gray-800'}`}>
                  {(profileData.name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.name || user?.name}
                  </h1>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {profileData.email || user?.email}
                  </p>
                </div>
                <Link 
                  to="/settings"
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5 text-gray-300 hover:text-white' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Edit Profile
                </Link>
              </div>

              {/* Role Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(profileData.role || user?.role)} text-white`}>
                  {getRoleDisplayName(profileData.role || user?.role)}
                </span>
                {profileData.department && (
                  <span className={`px-3 py-1 rounded-full text-sm border ${
                    isDark 
                      ? 'border-white/10 text-gray-400' 
                      : 'border-gray-200 text-gray-600'
                  }`}>
                    {profileData.department}
                  </span>
                )}
              </div>

              {/* Skills */}
              {profileData.skills && profileData.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-lg text-sm ${
                          isDark 
                            ? 'bg-white/5 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Join Date */}
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Joined {formatJoinDate(userStats.joinedDate)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userStats.projectsCount}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Projects</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userStats.tasksCompleted}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.role === 'mentor' ? 'Mentor' : profileData.role === 'admin' ? 'Admin' : 'Active'}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/projects"
              className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isDark 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Projects</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your work</p>
                </div>
              </div>
            </Link>

            <Link
              to="/tasks"
              className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isDark 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Tasks</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track progress</p>
                </div>
              </div>
            </Link>

            <Link
              to="/team"
              className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isDark 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0018.5 8H16c-.8 0-1.5.7-1.5 1.5v5c0 1.1.9 2 2 2h2v6h2zm-3.5-6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM8 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5L12 8.5c-.28-.8-1.04-1.5-1.96-1.5H8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h2v6h2z"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Team</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Collaborate</p>
                </div>
              </div>
            </Link>

            <Link
              to="/settings"
              className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                isDark 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preferences</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
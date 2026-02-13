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
    totalTasks: 0,
    joinedDate: null
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      const userData = response.data.data || response.data;
      setProfileData(userData);
      
      const projectsResponse = await api.get('/projects');
      const projects = projectsResponse.data.data || [];

      let totalTasks = 0;
      let completedTasks = 0;
      try {
        const tasksResponse = await api.get('/tasks');
        const tasks = tasksResponse.data.data || [];
        totalTasks = tasks.length;
        completedTasks = tasks.filter(t => t.column === 'done').length;
      } catch (e) {
        // Tasks endpoint may not exist yet
      }
      
      setUserStats({
        projectsCount: projects.length,
        tasksCompleted: completedTasks,
        totalTasks,
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

  if (loading) {
    return (
      <DashboardLayout title="My Profile" subtitle="View and manage your profile">
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}`} />
        </div>
      </DashboardLayout>
    );
  }

  const displayName = profileData.name || user?.name || 'User';
  const displayEmail = profileData.email || user?.email || '';
  const displayRole = profileData.role || user?.role || 'intern';

  return (
    <DashboardLayout title="My Profile" subtitle="View and manage your profile">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          {/* Cover */}
          <div className="relative h-36 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-14 mb-5 flex items-end justify-between">
              <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-xl ${
                isDark ? 'shadow-purple-500/20' : 'shadow-purple-500/30'
              }`}>
                <div className={`w-full h-full rounded-[14px] flex items-center justify-center text-3xl font-bold ${
                  isDark ? 'bg-[#12121a] text-white' : 'bg-white text-gray-800'
                }`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <Link 
                to="/settings"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm"
              >
                Edit Profile
              </Link>
            </div>

            {/* Name & Email */}
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {displayName}
            </h1>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {displayEmail}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role Badge */}
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {getRoleDisplayName(displayRole)}
              </span>

              {profileData.department && (
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isDark ? 'border-white/10 text-gray-400 bg-white/5' : 'border-gray-200 text-gray-600 bg-gray-50'
                }`}>
                  {profileData.department}
                </span>
              )}

              <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {formatJoinDate(userStats.joinedDate)}
              </span>
            </div>

            {/* Skills */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className={`mt-5 pt-5 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-lg text-sm ${
                        isDark 
                          ? 'bg-white/5 text-gray-300 border border-white/5' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Projects',
              value: userStats.projectsCount,
              icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              ),
              gradient: 'from-blue-500 to-indigo-600',
              delay: 0.1,
            },
            {
              label: 'Tasks Completed',
              value: userStats.tasksCompleted,
              icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              gradient: 'from-emerald-500 to-teal-600',
              delay: 0.2,
            },
            {
              label: 'Status',
              value: displayRole === 'mentor' ? 'Mentor' : displayRole === 'admin' ? 'Admin' : 'Active',
              icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              gradient: 'from-orange-500 to-red-500',
              delay: 0.3,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className={`p-5 rounded-2xl border flex items-center gap-4 ${
                isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { to: '/projects', label: 'Projects', sub: 'Manage your work', gradient: 'from-blue-500 to-indigo-600', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
              { to: '/tasks', label: 'Tasks', sub: 'Track progress', gradient: 'from-emerald-500 to-teal-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
              { to: '/team', label: 'Team', sub: 'Collaborate', gradient: 'from-pink-500 to-rose-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { to: '/settings', label: 'Settings', sub: 'Preferences', gradient: 'from-gray-500 to-gray-700', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className={`group p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  isDark 
                    ? 'border-white/5 hover:bg-white/5 hover:border-white/10' 
                    : 'border-gray-100 hover:bg-gray-50 hover:shadow-md hover:border-gray-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{action.label}</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{action.sub}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
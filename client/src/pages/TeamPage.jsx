import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/Layout/DashboardLayout';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';
import { projectService } from '../services';
import { LoadingStates, ErrorStates, ConfirmationModal } from '../components/UI';
import TeamInviteModal from '../components/UI/TeamInviteModal';

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState({ open: false, member: null });
  const [removing, setRemoving] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectsRes = await projectService.getAll();
      const fetchedProjects = projectsRes.data || [];
      setProjects(fetchedProjects);

      // Check if current user owns any project
      const ownsProject = fetchedProjects.some((p) => {
        const ownerId = p.owner?._id || p.owner;
        return ownerId === currentUser?.id || ownerId === currentUser?._id;
      });
      setIsProjectOwner(ownsProject);

      // Collect unique members across all projects
      const memberMap = new Map();

      fetchedProjects.forEach((project) => {
        // Add owner
        if (project.owner) {
          const ownerId = project.owner._id || project.owner;
          if (!memberMap.has(ownerId)) {
            memberMap.set(ownerId, {
              id: ownerId,
              name: project.owner.name || 'Unknown',
              email: project.owner.email || '',
              avatar: project.owner.avatar || null,
              role: 'Owner',
              projects: [],
            });
          }
          memberMap.get(ownerId).projects.push({
            id: project._id,
            name: project.name,
            color: project.color || '#b026ff',
          });
        }

        // Add members
        (project.members || []).forEach((m) => {
          const userId = m.user?._id || m.user;
          if (userId && !memberMap.has(userId)) {
            memberMap.set(userId, {
              id: userId,
              name: m.user?.name || 'Unknown',
              email: m.user?.email || '',
              avatar: m.user?.avatar || null,
              role: m.role || 'Member',
              projects: [],
            });
          }
          if (userId && memberMap.has(userId)) {
            memberMap.get(userId).projects.push({
              id: project._id,
              name: project.name,
              color: project.color || '#b026ff',
            });
          }
        });
      });

      setMembers(Array.from(memberMap.values()));
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!removeConfirm.member) return;
    setRemoving(true);
    try {
      const member = removeConfirm.member;
      // Remove from all projects where this member exists
      for (const proj of member.projects) {
        // Only remove if current user owns this project
        const project = projects.find((p) => (p._id || p.id) === proj.id);
        if (!project) continue;
        const ownerId = project.owner?._id || project.owner;
        if (ownerId === currentUser?.id || ownerId === currentUser?._id) {
          try {
            await projectService.removeMember(proj.id, member.id);
          } catch (err) {
            console.error(`Failed to remove from project ${proj.name}:`, err);
          }
        }
      }
      setRemoveConfirm({ open: false, member: null });
      fetchTeamMembers(); // refresh
    } catch (err) {
      console.error('Remove member error:', err);
    } finally {
      setRemoving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-violet-500',
  ];

  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Team"
      subtitle={`${members.length} member${members.length !== 1 ? 's' : ''} across your projects`}
      headerActions={
        isProjectOwner ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Member
          </motion.button>
        ) : null
      }
    >
      <TeamInviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} onInviteSent={fetchTeamMembers} />
      {loading && <LoadingStates.LoadingOverlay fullScreen message="Loading team..." />}
      {error && !loading && <ErrorStates.ErrorMessage message={error} onRetry={fetchTeamMembers} />}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`rounded-xl p-5 border transition-all ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} text-purple-500`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{members.length}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Members</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border transition-all ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} text-blue-500`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {members.filter((m) => m.role === 'Owner' || m.role === 'admin').length}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Admins & Owners</p>
                </div>
              </div>
            </div>
            <div className={`rounded-xl p-5 border transition-all ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} text-emerald-500`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {new Set(members.flatMap((m) => m.projects.map((p) => p.id))).size}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Active Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
                isDark ? 'bg-[#12121a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Members Grid */}
          {filteredMembers.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-[#12121a] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {members.length === 0 ? 'No team members yet' : 'No matching members'}
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                {members.length === 0 ? 'Add members to your projects to see them here' : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group rounded-2xl p-5 border transition-all hover:scale-[1.01] ${
                    isDark
                      ? 'bg-[#12121a] border-white/10 hover:border-purple-500/30'
                      : 'bg-white border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                      {getInitials(member.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {member.name}
                        </h3>
                        {member.id === currentUser?._id && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          member.role === 'Owner' || member.role === 'admin'
                            ? isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-600 border border-amber-200'
                            : isDark ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Remove button - only for project owners, not on self or other owners */}
                    {isProjectOwner && member.role !== 'Owner' && member.id !== currentUser?.id && member.id !== currentUser?._id && (
                      <button
                        onClick={() => setRemoveConfirm({ open: true, member })}
                        className={`flex-shrink-0 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                        }`}
                        title="Remove member"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Projects */}
                  <div className="mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}">
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {member.projects.length} project{member.projects.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {member.projects.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className={`text-xs px-2 py-1 rounded-md border ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                      ))}
                      {member.projects.length > 3 && (
                        <span className={`text-xs px-2 py-1 rounded-md ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          +{member.projects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Remove Member Confirmation */}
      <ConfirmationModal
        isOpen={removeConfirm.open}
        onClose={() => setRemoveConfirm({ open: false, member: null })}
        onConfirm={handleRemoveMember}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${removeConfirm.member?.name} from all your projects? This action cannot be undone.`}
        confirmText={removing ? 'Removing...' : 'Remove'}
        variant="danger"
        isLoading={removing}
      />
    </DashboardLayout>
  );
}

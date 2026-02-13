import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useThemeStore from '../../stores/themeStore';
import { notificationService, invitationService } from '../../services';
import { useSocket } from '../../socket';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const panelRef = useRef(null);

  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const { socket } = useSocket();

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;
    const handleNew = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };
    socket.on('notification:new', handleNew);
    return () => socket.off('notification:new', handleNew);
  }, [socket]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
        setDetailView(null);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res.data.data?.count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleAcceptInvitation = async (invitationId, notificationId) => {
    try {
      setActionLoading(invitationId);
      await invitationService.accept(invitationId);
      // Update the notification locally
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, read: true, invitation: { ...n.invitation, status: 'accepted' } }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setDetailView(null);
    } catch (err) {
      console.error('Error accepting invitation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineInvitation = async (invitationId, notificationId) => {
    try {
      setActionLoading(invitationId);
      await invitationService.decline(invitationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, read: true, invitation: { ...n.invitation, status: 'declined' } }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setDetailView(null);
    } catch (err) {
      console.error('Error declining invitation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      const removed = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (removed && !removed.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'project_invitation':
        return (
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'invitation_accepted':
        return (
          <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'invitation_declined':
        return (
          <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const renderDetailView = () => {
    if (!detailView) return null;
    const n = detailView;
    const inv = n.invitation;
    const project = inv?.project || n.project;
    const isPending = inv?.status === 'pending';

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="p-4"
      >
        {/* Back button */}
        <button
          onClick={() => setDetailView(null)}
          className={`flex items-center gap-1.5 text-sm mb-4 transition-colors ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Project details card */}
        <div className={`rounded-xl border p-4 mb-4 ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: project?.color || '#b026ff' }}
            >
              {(project?.name || 'P').charAt(0)}
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {project?.name || 'Unknown Project'}
              </h4>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {project?.status || 'active'} &bull; {project?.priority || 'medium'} priority
              </p>
            </div>
          </div>

          {project?.description && (
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.description}
            </p>
          )}

          {/* Sender info */}
          <div className={`flex items-center gap-2 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
              {(n.sender?.name || 'U').charAt(0)}
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Invited by {n.sender?.name || 'Unknown'}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {n.sender?.email} &bull; {getTimeAgo(n.createdAt)}
              </p>
            </div>
          </div>

          {inv?.role && (
            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Role: <span className={`font-medium capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{inv.role}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {n.type === 'project_invitation' && isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAcceptInvitation(inv._id, n._id)}
              disabled={actionLoading === inv._id}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              {actionLoading === inv._id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accept
                </>
              )}
            </button>
            <button
              onClick={() => handleDeclineInvitation(inv._id, n._id)}
              disabled={actionLoading === inv._id}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all border flex items-center justify-center gap-1.5 ${
                isDark
                  ? 'border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Decline
            </button>
          </div>
        )}

        {inv?.status === 'accepted' && (
          <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
            You accepted this invitation
          </div>
        )}
        {inv?.status === 'declined' && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            You declined this invitation
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setDetailView(null);
        }}
        className={`relative p-2 rounded-xl transition-all ${
          isDark
            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-96 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
              isDark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-gray-100'
            }`}>
              <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[28rem] overflow-y-auto">
              <AnimatePresence mode="wait">
                {detailView ? (
                  renderDetailView()
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                          isDark ? 'bg-white/5' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((n) => {
                          const isInvitation = n.type === 'project_invitation';
                          const isPending = n.invitation?.status === 'pending';

                          return (
                            <div
                              key={n._id}
                              className={`relative px-4 py-3 border-b transition-colors ${
                                !n.read
                                  ? isDark ? 'bg-purple-500/5' : 'bg-purple-50/50'
                                  : ''
                              } ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'}`}
                            >
                              {/* Unread dot */}
                              {!n.read && (
                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                              )}

                              <div className="flex gap-3">
                                {getNotificationIcon(n.type)}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm leading-snug ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {n.message}
                                  </p>
                                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {getTimeAgo(n.createdAt)}
                                  </p>

                                  {/* Invitation actions */}
                                  {isInvitation && isPending && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <button
                                        onClick={() => handleAcceptInvitation(n.invitation._id, n._id)}
                                        disabled={actionLoading === n.invitation._id}
                                        className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-all"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleDeclineInvitation(n.invitation._id, n._id)}
                                        disabled={actionLoading === n.invitation._id}
                                        className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                                          isDark
                                            ? 'border-white/10 text-gray-400 hover:bg-white/5'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                      >
                                        Decline
                                      </button>
                                      <button
                                        onClick={() => setDetailView(n)}
                                        className="px-3 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                      >
                                        Details
                                      </button>
                                    </div>
                                  )}

                                  {/* Show result for responded invitations */}
                                  {isInvitation && n.invitation?.status === 'accepted' && (
                                    <span className="inline-block mt-1.5 text-xs text-green-400">Accepted</span>
                                  )}
                                  {isInvitation && n.invitation?.status === 'declined' && (
                                    <span className="inline-block mt-1.5 text-xs text-red-400">Declined</span>
                                  )}

                                  {/* For accepted/declined notifications sent to the owner */}
                                  {(n.type === 'invitation_accepted' || n.type === 'invitation_declined') && (
                                    <button
                                      onClick={() => setDetailView(n)}
                                      className="mt-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                      View Details
                                    </button>
                                  )}
                                </div>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteNotification(n._id)}
                                  className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all self-start hover:opacity-100 ${
                                    isDark ? 'hover:bg-white/10 text-gray-600 hover:text-gray-400' : 'hover:bg-gray-100 text-gray-300 hover:text-gray-500'
                                  }`}
                                  style={{ opacity: 0.4 }}
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

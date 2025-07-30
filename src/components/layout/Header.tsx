import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu,
  Command,
  Plus,
  LogOut,
  User,
  ChevronDown,
  CheckSquare,
  FolderOpen,
  Shield,
  Palette,
  Users,
  CreditCard,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useRealTime } from '../../hooks/useRealTime';
import toast from "react-hot-toast";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenProjectModal: () => void;
  onOpenTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenProjectModal,
  onOpenTaskModal
}) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useRealTime();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    await logout(user?.id);
    navigate('/login');
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    toast.loading("Coming Soon!")
    // navigate('/notifications');
  };

  const settingsOptions = [
    { id: 'profile', name: 'Profile', icon: User, path: '/settings?tab=profile' },
    { id: 'notifications', name: 'Notifications', icon: BellRing, path: '/settings?tab=notifications' },
    { id: 'security', name: 'Security', icon: Shield, path: '/settings?tab=security' },
    { id: 'appearance', name: 'Appearance', icon: Palette, path: '/settings?tab=appearance' },
    { id: 'team', name: 'Team', icon: Users, path: '/settings?tab=team' },
    { id: 'billing', name: 'Billing', icon: CreditCard, path: '/settings?tab=billing' }
  ];

  const newOptions = [
    { id: 'project', name: 'New Project', icon: FolderOpen, action: onOpenProjectModal },
    { id: 'task', name: 'New Task', icon: CheckSquare, action: onOpenTaskModal }
  ];

  return (
    <>
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 relative z-40">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </button>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCommandPalette}
                className="min-w-[200px] justify-start text-neutral-500 dark:text-neutral-400"
              >
                <Search className="w-4 h-4 mr-2" />
                Search anything...
                <kbd className="ml-auto hidden sm:inline-flex items-center rounded border border-neutral-200 dark:border-neutral-700 px-1 font-mono text-xs">
                  <Command className="w-3 h-3 mr-1" />K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* New Button with Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowNewMenu(!showNewMenu)}
              >
                New
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>

              <AnimatePresence>
                {showNewMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
                  >
                    <div className="py-1">
                      {newOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            option.action();
                            setShowNewMenu(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <option.icon className="w-4 h-4 mr-2" />
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
                  >
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-3 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                            {new Date(notification.createdAt).toLocaleTimeString()}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={handleViewAllNotifications}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
              </button>

              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
                  >
                    <div className="py-1">
                      {settingsOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            navigate(option.path);
                            setShowSettingsMenu(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <option.icon className="w-4 h-4 mr-2" />
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative pl-3 border-l border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg p-1 transition-colors"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  status="online"
                  size="sm"
                />
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
                  >
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {user?.name}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {'@' + user?.username}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu || showNewMenu || showSettingsMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
            setShowNewMenu(false);
            setShowSettingsMenu(false);
          }}
        />
      )}
    </>
  );
};
import React, {/*{useState}*/} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  Clock,
  FileText,
  Settings,
  Zap,
  // Plus,
  // Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed}) => {
  /*const [searchQuery, setSearchQuery] = useState('');*/
  const { user } = useAuth();

  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Time Tracking', href: '/time', icon: Clock },
    { name: 'Files', href: '/files', icon: FileText },
    { name: 'Automations', href: '/automations', icon: Zap },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={clsx(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
        )}
      >
        <item.icon className={clsx('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3')} />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {item.name}
          </motion.span>
        )}
      </NavLink>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                ProjectManager
              </span>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {/*{!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}*/}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            status="online"
            size="sm"
          />
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 min-w-0 flex-1"
            >
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {user.name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {'@' + user.username}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
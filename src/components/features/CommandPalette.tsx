import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Hash, User, Folder, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from "../../hooks/useData.ts";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'projects' | 'tasks' | 'users';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { projects, tasks, users } = useData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const allCommands: Command[] = [
    // Navigation
    { id: 'nav-dashboard', title: 'Go to Dashboard', icon: <Hash className="w-4 h-4" />, action: () => navigate('/dashboard'), category: 'navigation' },
    { id: 'nav-projects', title: 'Go to Projects', icon: <Folder className="w-4 h-4" />, action: () => navigate('/projects'), category: 'navigation' },
    { id: 'nav-tasks', title: 'Go to Tasks', icon: <CheckSquare className="w-4 h-4" />, action: () => navigate('/tasks'), category: 'navigation' },
    
    // Projects
    ...projects.map(project => ({
      id: `project-${project.id}`,
      title: project.name,
      subtitle: `Project • ${project.members.length} members`,
      icon: <Folder className="w-4 h-4" />,
      action: () => navigate(`/projects/${project.id}`),
      category: 'projects' as const
    })),

    // Tasks
    ...tasks.map(task => ({
      id: `task-${task.id}`,
      title: task.title,
      subtitle: `Task • ${task.status}`,
      icon: <CheckSquare className="w-4 h-4" />,
      action: () => navigate(`/tasks/${task.id}`),
      category: 'tasks' as const
    })),

    // Users
    ...users.map(user => ({
      id: `user-${user.id}`,
      title: user.name,
      subtitle: `User • ${user.username}`,
      icon: <User className="w-4 h-4" />,
      action: () => navigate(`/users/${user.id}`),
      category: 'users' as const
    }))
  ];

  const filteredCommands = allCommands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden relative z-50"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <Search className="w-5 h-5 text-neutral-400 mr-3" />
              <input
                type="text"
                placeholder="Search projects, tasks, or navigate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => {
                        command.action();
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                        index === selectedIndex ? 'bg-neutral-100 dark:bg-neutral-700' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-neutral-400 mr-3">{command.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
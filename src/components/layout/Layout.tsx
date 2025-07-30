import React, { useState, useEffect } from 'react';
// import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '../features/CommandPalette';
import { ProjectModal } from '../ui/ProjectModal';
import { TaskModal } from '../ui/TaskModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const openCommandPalette = () => setCommandPaletteOpen(true);
  const closeCommandPalette = () => setCommandPaletteOpen(false);
  const openProjectModal = () => setProjectModalOpen(true);
  const closeProjectModal = () => setProjectModalOpen(false);
  const openTaskModal = () => setTaskModalOpen(true);
  const closeTaskModal = () => setTaskModalOpen(false);

  // Handle keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={toggleSidebar}
          onOpenCommandPalette={openCommandPalette}
          onOpenProjectModal={openProjectModal}
          onOpenTaskModal={openTaskModal}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={closeCommandPalette}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={closeProjectModal}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};
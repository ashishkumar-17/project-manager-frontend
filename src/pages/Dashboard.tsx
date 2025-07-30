import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Edit
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Loader } from '../components/ui/Loader';
import { ProjectModal } from '../components/ui/ProjectModal';
import { TaskModal } from '../components/ui/TaskModal';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import {Project, Task} from "../types";



export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, projects, tasks, users, pendingTasks, refetch} = useData(user?.id);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>(null);
  const [selectedTask, setSelectedTask] = useState<Task>(null);


  const stats = [
    {
      name: 'Active Projects',
      value: projects.filter(p => p.status === 'ACTIVE').length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      name: 'Tasks Completed',
      value: tasks.filter(t => t.status === 'DONE').length,
      change: '+8%',
      changeType: 'positive' as const,
      icon: CheckCircle
    },
    {
      name: 'Hours Tracked',
      value: '124',
      change: '-3%',
      changeType: 'negative' as const,
      icon: Clock
    },
    {
      name: 'Team Members',
      value: users.length,
      change: '+2',
      changeType: 'positive' as const,
      icon: Users
    }
  ];

  const recentTasks = tasks.slice(0, 5);
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').slice(0, 3);

  const getUserDetails = (id: string) => {
    return users.find(user => user.id === id);
  };

  const handleProjectClick = (project: Project) => {
    // Show project details in read-only mode
    setSelectedProject({ ...project, readOnly: true });
    setProjectModalOpen(true);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    // Show task details in read-only mode
    setSelectedTask({ ...task, readOnly: true });
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-task':
        setSelectedTask(null);
        setTaskModalOpen(true);
        break;
      case 'new-project':
        setSelectedProject(null);
        setProjectModalOpen(true);
        break;
      case 'invite-team':
        navigate('/settings?tab=team');
        break;
      case 'time-entry':
        navigate('/time');
        break;
    }
  };

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    // 🎉 Weekend fun messages
    if (day === 0) return 'Happy Sunday';
    if (day === 6) return 'Happy Saturday';

    // ⏰ Weekday time-based greetings
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };


  return (
    <div className="p-6 space-y-6 relative overflow-hidden">
      {/* Loader overlay inside dashboard content only */}
      <Loader isLoading={loading} absolute />
      {/* Welcome, Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            You have {pendingTasks} tasks pending today
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                    {stat.value}
                  </p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.changeType === 'positive' 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-error-600 dark:text-error-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change} from last week
                  </div>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-50/30 dark:to-primary-900/10 pointer-events-none" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Active Projects
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
              >
                View all
              </Button>
            </div>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleProjectClick(project)}
                  className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditProject(project, e)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                      >
                        <Edit className="w-4 h-4 text-neutral-400" />
                      </button>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.priority === 'HIGH' 
                          ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                          : project.priority === 'MEDIUM'
                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                          : 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                      }`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((memberId) => {
                        const member = getUserDetails(memberId);
                        return member ? (
                                // className="border-2 border-white dark:border-neutral-800"
                            <Avatar
                                key={member.id}
                                src={member.avatar}
                                name={member.name}
                                size="xs"
                            />
                        ) : null;
                      })}
                      {project.members.length > 3 && (
                        <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-600 rounded-full flex items-center justify-center text-xs font-medium text-neutral-600 dark:text-neutral-300 border-2 border-white dark:border-neutral-800">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {project.progress}% complete
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Recent Tasks
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tasks')}
              >
                View all
              </Button>
            </div>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleTaskClick(task)}
                  className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 group"
                >
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    task.status === 'DONE' 
                      ? 'bg-success-500'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-primary-500'
                      : task.status === 'REVIEW'
                      ? 'bg-warning-500'
                      : 'bg-neutral-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                  </div>
                  {task.assignee && (() => {
                    const assignee = getUserDetails(task.assignee);
                    return assignee ? (
                        <Avatar
                            src={assignee.avatar}
                            name={assignee.name}
                            size="xs"
                        />
                    ) : null;
                  })()}
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditTask(task, e)}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                    >
                      <Edit className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'New Task', icon: CheckCircle, color: 'primary', action: 'new-task' },
              { name: 'Create Project', icon: TrendingUp, color: 'secondary', action: 'new-project' },
              { name: 'Invite Team', icon: Users, color: 'accent', action: 'invite-team' },
              { name: 'Time Entry', icon: Clock, color: 'success', action: 'time-entry' }
            ].map((action) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action.action)}
                className={`p-4 rounded-xl border-2 border-dashed transition-colors hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 border-${action.color}-200 dark:border-${action.color}-800`}
              >
                <action.icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400 mx-auto mb-2`} />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {action.name}
                </p>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={async () => {
          setProjectModalOpen(false);
          setSelectedProject(null);
          await refetch();
        }}
        project={selectedProject}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={async () => {
          setTaskModalOpen(false);
          setSelectedTask(null);
          await refetch();
        }}
        task={selectedTask}
      />
    </div>
  );
};
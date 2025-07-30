import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Check
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Loader } from '../components/ui/Loader';
import { ConfirmModal} from "../components/ui/ConfirmModal.tsx";
import { TaskModal } from '../components/ui/TaskModal';
import { useData } from '../hooks/useData';
import {deleteTask, markTaskAsComplete} from "../services/api.ts";
import toast from "react-hot-toast";

export const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { projects, tasks, loading, users, refetch } = useData();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'REVIEW': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const handleTaskClick = (task: any) => {
    // Show task details in read-only mode
    setSelectedTask({ ...task, readOnly: true });
    setTaskModalOpen(true);
  };

  const handleTaskAction = async (task: any, action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        setSelectedTask(task);
        setTaskModalOpen(true);
        break;
      case 'delete':
        setSelectedTask(task);
        setConfirmModalOpen(true);
        break;
      case 'complete':
        try {
          await markTaskAsComplete(task.id);
          await refetch();
          toast.success("Marked Successfully!");
        }catch (error){
          console.log(error);
          toast.error("Marking Failed!");
        }
        break;
      case 'start':
        navigate('/time');
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(selectedTask.id);
      await refetch();
      toast.success("Task Deleted Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Task Deletion Failed!");
    }
  };

  const TaskActions = ({ task }: { task: any }) => (
    <div className="flex flex-col py-1">
      <button
        onClick={(e) => handleTaskAction(task, 'edit', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Task
      </button>
      <button
        onClick={(e) => handleTaskAction(task, 'start', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Timer
      </button>
      <button
        onClick={(e) => handleTaskAction(task, 'complete', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Check className="w-4 h-4 mr-2" />
        Mark Complete
      </button>
      <button
        onClick={(e) => handleTaskAction(task, 'delete', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Task
      </button>
    </div>
  );

  const getUserDetails = (id: string) => {
    return users.find(user => user.id === id);
  };


  return (
      <>
    <div className="p-6 space-y-6 relative overflow-hidden">
      {/* Loader overlay inside dashboard content only */}
      <Loader isLoading={loading} absolute />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Tasks
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and track all your tasks
          </p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedTask(null);
            setTaskModalOpen(true);
          }}
        >
          New Task
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <Input
          placeholder="Search tasks..."
          icon={<Search className="w-4 h-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-md"
        />
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Priority</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Tasks List */}
      <Card>
        <div className="space-y-4">
          {filteredTasks.map((task, index) => {
            const project = getProject(task.projectId);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {task.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                        {project && (
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span>{project.name}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {task.estimatedHours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.loggedHours}h / {task.estimatedHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {task.assignee && (() => {
                      const assignee = getUserDetails(task.assignee);
                      return assignee ? (
                          <div className="group/avatar relative">
                            <Avatar
                                src={assignee.avatar}
                                name={assignee.name}
                                size="sm"
                            />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap">
                              {assignee.name}
                            </div>
                          </div>
                      ) : null;
                        })
                    ()}
                    <div className="relative group/menu opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                      </button>
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                        <TaskActions task={task} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 pl-7">
                    <div className="space-y-1">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2 text-sm">
                          {subtask.completed ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={subtask.completed ? 'line-through text-neutral-500 dark:text-neutral-400' : 'text-neutral-600 dark:text-neutral-300'}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No tasks found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Task Modal */}
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
        <ConfirmModal
            isOpen={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setSelectedTask(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Task"
            message="Do you really want to delete"
            itemName={selectedTask?.title || 'this Task'}
        />
      </>
  );
};
import React, { useEffect, useState } from 'react';
import { X, Calendar, User, Flag, Folder, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { getAllUsers, getAllProjects, createTask, updateTask } from '../../services/api';
import { useAuth } from "../../hooks/useAuth.ts";
import { Project, User as AppUser, Task } from '../../types';
import { useData } from '../../hooks/useData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task & { readOnly?: boolean };
  projectId?: string;
}

interface TaskForm {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  dueDate: string;
  estimatedHours: number;
  tags: string;
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REVIEW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  DONE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
};

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const { refetch} = useData();
  const { user } = useAuth();
  const isReadOnly = task?.readOnly ?? false;

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TaskForm>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      projectId: task?.projectId || projectId || '',
      assigneeId: task?.assignee || '',
      priority: task?.priority || 'MEDIUM',
      status: task?.status || 'TODO',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      estimatedHours: task?.estimatedHours || 0,
      tags: task?.tags?.join(', ') || ''
    }
  });

  const priority = watch('priority');
  const status = watch('status');
  const selectedProjectId = watch('projectId');
  const selectedAssigneeId = watch('assigneeId');


  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedAssignee = users.find(u => u.id === selectedAssigneeId);

  useEffect(() => {
    getAllProjects()
        .then((fetchedProjects) => {
          setProjects(fetchedProjects);
        })
        .catch(() => toast.error('Failed to load projects'));

    getAllUsers()
        .then((fetchedUsers) => {
          setUsers(fetchedUsers);
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to load users');
        });
  }, []);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        projectId: task?.projectId|| '',
        assigneeId: typeof task?.assignee === 'object'
            ? (task.assignee as AppUser)?.id
            : task?.assignee || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'TODO',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours || 0,
        tags: task.tags?.join(', ') || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        projectId: projectId || '',
        assigneeId: '',
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: '',
        estimatedHours: 0,
        tags: ''
      });
    }
  }, [task, projectId, reset]);


  const onSubmit = async (data: TaskForm) => {
    setIsLoading(true);
    try {
      const taskData: Partial<Task> = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignee: data.assigneeId,
        reporter: user?.id,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        estimatedHours: Number(data.estimatedHours),
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (task?.id) {
        await updateTask(task.id, taskData);
        await refetch();
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData);
        await refetch();
        toast.success('Task created successfully!');
      }

      onClose();
      reset();

    } catch (error) {
      console.log(error);
      toast.error('Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {isReadOnly
              ? 'Task Details'
              : task
                  ? 'Edit Task'
                  : 'Create New Task'}
        </h2>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            disabled={isReadOnly}
            error={errors.title?.message}
            {...register('title', { required: 'Task title is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              disabled={isReadOnly}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('description')}
            />
          </div>
        </div>

        {/* Project and Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Folder className="w-4 h-4 inline mr-2" />
              Project
            </label>
            <select disabled={isReadOnly}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              {...register('projectId', { required: 'Project is required' })}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {selectedProject && (
              <div className="mt-2 flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedProject.name}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Assignee
            </label>
            <select disabled={isReadOnly}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              {...register('assigneeId')}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {selectedAssignee && (
              <div className="mt-2 flex items-center">
                <Avatar
                  src={selectedAssignee.avatar}
                  name={selectedAssignee.name}
                  size="xs"
                  className="mr-2"
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedAssignee.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <Flag className="w-4 h-4 inline mr-2" />
              Priority
            </label>
            <select disabled={isReadOnly}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              {...register('priority')}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select disabled={isReadOnly}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              {...register('status')}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
                {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date and Estimated Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            disabled={isReadOnly}
            icon={<Calendar className="w-4 h-4" />}
            {...register('dueDate')}
          />

          <Input
            label="Estimated Hours"
            type="number"
            min="0"
            step="0.5"
            disabled={isReadOnly}
            icon={<Clock className="w-4 h-4" />}
            placeholder="0"
            {...register('estimatedHours')}
          />
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          placeholder="Enter tags separated by commas"
          disabled={isReadOnly}
          helperText="e.g., frontend, bug, feature"
          {...register('tags')}
        />

        {/* Actions */}
        { !isReadOnly && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  loading={isLoading}
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
        )}
      </form>
    </Modal>
  );
};
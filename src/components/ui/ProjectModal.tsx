import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Users, Tag, Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { Project, User } from '../../types';
import { getAllUsers, createProject, updateProject } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project & { readOnly?: boolean } | null;
}

interface ProjectForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: Project['priority'];
  tags: string;
  color: string;
  members: string[];
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const projectColors = [
  '#3b82f6', '#14b8a6', '#f97316', '#dc2626', '#7c3aed', '#ec4899', '#10b981', '#f59e0b'
];

const defaultFormValues: ProjectForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'PLANNING',
  priority: 'MEDIUM',
  tags: '',
  color: projectColors[0],
  members: [],
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {

  const { register, handleSubmit, setError,
    clearErrors, formState: { errors }, reset, watch } = useForm<ProjectForm>({
    defaultValues: defaultFormValues,
  });

  const isReadOnly = project?.readOnly ?? false;
  const [members, setMembers] = React.useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>(project?.members ?? []);
  const [selectedColor, setSelectedColor] = React.useState<string>(watch('color'));
  const [isLoading, setIsLoading] = React.useState(false);
  const { refetch } = useData();
  const { user } = useAuth();



  const priority = watch('priority');

  useEffect(() => {
    getAllUsers()
      .then((fetchedUsers) => {
        setMembers(fetchedUsers);
        if (project?.members) {
          setSelectedMembers(project.members);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load members');
      });
    }, [project?.members]
  );

  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Editing/viewing an existing project
        reset({
          name: project.name ?? '',
          description: project.description ?? '',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
          priority: project.priority ?? 'MEDIUM',
          tags: project.tags?.join(', ') || '',
          color: project.color || projectColors[0],
          members: project.members ?? [],
          status: project.status ?? 'PLANNING',
        });
        setSelectedColor(project.color || projectColors[0]);
        setSelectedMembers(project.members ?? []);
      } else {
        // New project: reset to default empty values
        reset(defaultFormValues);
        setSelectedColor(projectColors[0]);
        setSelectedMembers([]);
      }
    }
  }, [isOpen, project, reset]);


  const onSubmit = async (data: ProjectForm) => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }
  setIsLoading(true);
  try {
      const payload: Partial<Project> = {
      name: data.name,
      description: data.description,
      status: data.status as Project["status"],
      priority: data.priority,
      progress: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      members: selectedMembers,
      ownerId: user?.id,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      color: selectedColor
      };

      if (project?.id) {
        await updateProject(project.id, payload);
        await refetch();
        toast.success('Project updated successfully!');
      } else {
        await createProject(payload);
        await refetch();
        toast.success('Project created successfully!');
      }

      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error saving project');
    } finally {
      setIsLoading(false);
    }
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError("endDate", {
        type: "manual",
        message: "End date cannot be before start date"
      });
    } else {
      clearErrors("endDate");
    }
  }, [startDate, endDate, setError, clearErrors]);


  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleClose = () => {
    onClose();
    reset();
    setSelectedMembers([]);
    setSelectedColor(projectColors[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          {isReadOnly
              ? 'Project Details'
              : project
                  ? 'Edit Project'
                  : 'Create New Project'}
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
            label="Project Name"
            placeholder="Enter project name"
            disabled ={isReadOnly}
            error={errors.name?.message}
            {...register('name', { required: 'Project name is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter project description"
              disabled={isReadOnly}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('description')}
            />
          </div>
        </div>

        {/* Dates and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            disabled={isReadOnly}
            type="date"
            icon={<Calendar className="w-4 h-4" />}
            {...register('startDate')}
          />

          <span>
            <Input
                label="End Date"
                disabled={isReadOnly}
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                {...register('endDate')}
            />
            {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </span>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
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
                {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Color and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Color Picker */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              Project Color
            </label>
            <div className="flex gap-2 flex-nowrap">
              {projectColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-neutral-400 scale-110'
                      : 'border-neutral-200 dark:border-neutral-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select disabled={isReadOnly}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              {...register('status')}
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>



        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            <Users className="w-4 h-4 inline mr-2" />
            Team Members
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {members.map((user) => (
              <motion.button
                key={user.id}
                type="button"
                onClick={() => toggleMember(user.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-3 rounded-lg border transition-colors ${
                  selectedMembers.includes(user.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                  className="mr-3"
                />
                <div className="text-left">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {user.role}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          placeholder="Enter tags separated by commas"
          disabled = {isReadOnly}
          icon={<Tag className="w-4 h-4" />}
          helperText="e.g., design, frontend, mobile"
          {...register('tags')}
        />

        {/* Actions */}
        {!isReadOnly && (
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
                {project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
        )}
      </form>
    </Modal>
  );
};
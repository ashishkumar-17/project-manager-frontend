import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Calendar,
  MoreHorizontal,
  Archive,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Loader } from '../components/ui/Loader';
import { ConfirmModal} from "../components/ui/ConfirmModal.tsx";
import { ProjectModal } from '../components/ui/ProjectModal';
import { useData } from '../hooks/useData';
import toast from "react-hot-toast";
import { deleteProject } from "../services/api.ts";
import {Project} from "../types";

export const Projects: React.FC = () => {
  // const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, loading, users, refetch } = useData();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PLANNING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  

  const handleProjectClick = (project: Project) => {
    // Show project details in read-only mode
    setSelectedProject({ ...project, readOnly: true });
    setProjectModalOpen(true);
  };

  const handleProjectAction = async (project: Project, action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        setSelectedProject(project);
        setProjectModalOpen(true);
        break;
      case 'delete':
        setSelectedProject(project);
        setConfirmModalOpen(true);
        break;
      case 'members':
        toast.loading("Coming Soon!");
        /*navigate(`/projects/${project.id}/members`);*/
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(selectedProject?.id);
      await refetch();
      toast.success("Project Deleted Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Project Deletion Failed!");
    }
  };

  const getUserDetails = (id: string) => {
    return users.find(user => user.id === id);
  };

  const ProjectActions = ({ project }: { project: Project }) => (
    <div className="flex flex-col py-1">
      <button
        onClick={(e) => handleProjectAction(project, 'edit', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Project
      </button>
      <button
        onClick={(e) => handleProjectAction(project, 'members', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Manage Members
      </button>
      <button
        onClick={(e) => handleProjectAction(project, 'delete', e)}
        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Project
      </button>
    </div>
  );

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
            Projects
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage and track all your projects
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedProject(null);
            setProjectModalOpen(true);
          }}
        >
          New Project
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex flex-1 gap-4 max-w-2xl">
          <Input
            placeholder="Search projects..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PLANNING">Planning</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            icon={<Grid3X3 className="w-4 h-4" />}
          >
          {' '}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            icon={<List className="w-4 h-4" />}
          >
          {' '}
          </Button>
        </div>
      </motion.div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleProjectClick(project)}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: project.color }}
                    />
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative group/menu">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                      >
                        <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                      </button>
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                        <ProjectActions project={project} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                      {project.priority}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">Progress</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
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
                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.endDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Team</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {project.name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                        <span className="text-sm capitalize text-neutral-600 dark:text-neutral-400">
                          {project.priority}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: project.color,
                              width: `${project.progress}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {project.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative group" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                          <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                        </button>
                        <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <ProjectActions project={project} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Archive className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No projects found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={async () => {
          setProjectModalOpen(false);
          setSelectedProject(null);
          await refetch();
        }}
        project={selectedProject}
      />
    </div>
        <ConfirmModal
            isOpen={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setSelectedProject(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Project"
            message="Do you really want to delete"
            itemName={selectedProject?.name || 'this project'}
        />
      </>
  );
};
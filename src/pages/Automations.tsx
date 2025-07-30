import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { mockWorkflowRules } from '../data/mockData';
import toast from "react-hot-toast";

export const Automations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const filteredRules = mockWorkflowRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && rule.isActive) ||
                         (filterStatus === 'inactive' && !rule.isActive);
    return matchesSearch && matchesStatus;
  });

  const templates = [
    {
      id: '1',
      name: 'Task Assignment',
      description: 'Automatically assign tasks based on project and priority',
      category: 'Task Management',
      icon: '📋',
      popular: true,
      trigger: 'When task is created',
      actions: ['Assign to team member', 'Send notification']
    },
    {
      id: '2',
      name: 'Deadline Reminders',
      description: 'Send notifications when deadlines are approaching',
      category: 'Notifications',
      icon: '⏰',
      popular: true,
      trigger: 'When due date approaches',
      actions: ['Send email reminder', 'Create notification']
    },
    {
      id: '3',
      name: 'Status Updates',
      description: 'Automatically update project status based on task completion',
      category: 'Project Management',
      icon: '📊',
      popular: false,
      trigger: 'When all tasks completed',
      actions: ['Update project status', 'Notify stakeholders']
    },
    {
      id: '4',
      name: 'Team Notifications',
      description: 'Notify team members when they are mentioned or assigned',
      category: 'Communication',
      icon: '💬',
      popular: true,
      trigger: 'When user is mentioned',
      actions: ['Send notification', 'Create activity log']
    }
  ];

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'task_status_changed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'task_assigned': return <ArrowRight className="w-4 h-4 text-green-500" />;
      case 'due_date_approaching': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  const handleRuleAction = (rule: any, action: string) => {
    switch (action) {
      case 'toggle':
        console.log('Toggle rule:', rule.id);
        break;
      case 'edit':
        console.log('Edit rule:', rule.id);
        break;
      case 'duplicate':
        console.log('Duplicate rule:', rule.id);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this automation?')) {
          console.log('Delete rule:', rule.id);
        }
        break;
    }
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCreateModalOpen(true);
  };

  const RuleActions = ({ rule }: { rule: any }) => (
    <div className="flex flex-col py-1">
      <button
        onClick={() => handleRuleAction(rule, 'edit')}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Automation
      </button>
      <button
        onClick={() => handleRuleAction(rule, 'duplicate')}
        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Copy className="w-4 h-4 mr-2" />
        Duplicate
      </button>
      <button
        onClick={() => handleRuleAction(rule, 'delete')}
        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Automations
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Automate your workflow with custom rules and triggers
          </p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Automation
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Active Rules', value: mockWorkflowRules.filter(r => r.isActive).length, icon: Play, color: 'text-green-600' },
          { name: 'Total Rules', value: mockWorkflowRules.length, icon: Zap, color: 'text-blue-600' },
          { name: 'Executions Today', value: '24', icon: CheckCircle, color: 'text-purple-600' },
          { name: 'Failed Runs', value: '2', icon: AlertTriangle, color: 'text-red-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Templates Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Automation Templates
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{template.icon}</span>
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {template.name}
                      </h3>
                      {template.popular && (
                        <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full mt-1">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {template.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-medium mr-2">Trigger:</span>
                    {template.trigger}
                  </div>
                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-medium mr-2">Actions:</span>
                    {template.actions.join(', ')}
                  </div>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 block">
                  {template.category}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <Input
          placeholder="Search automations..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Automation Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Your Automations
            </h2>
          </div>

          <div className="space-y-4">
            {filteredRules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      {getTriggerIcon(rule.trigger.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {rule.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rule.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                        {rule.description}
                      </p>
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="mr-4">
                          Trigger: {rule.trigger.type.replace('_', ' ')}
                        </span>
                        <span className="mr-4">
                          Actions: {rule.actions.length}
                        </span>
                        <span>
                          Created: {new Date(rule.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      onClick={() => handleRuleAction(rule, 'toggle')}
                    >
                      {rule.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={<Settings className="w-4 h-4" />}
                      onClick={() => handleRuleAction(rule, 'edit')}
                    />
                    <div className="relative group/menu">
                      <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />} />
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                        <RuleActions rule={rule} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Create Automation Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedTemplate(null);
        }}
        title={selectedTemplate ? `Create from ${selectedTemplate.name}` : 'Create New Automation'}
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Automation Name"
            placeholder="Enter automation name"
            defaultValue={selectedTemplate?.name || ''}
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe what this automation does"
              rows={3}
              defaultValue={selectedTemplate?.description || ''}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Trigger
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              <option value="task_created">When task is created</option>
              <option value="task_status_changed">When task status changes</option>
              <option value="task_assigned">When task is assigned</option>
              <option value="due_date_approaching">When due date approaches</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Actions
            </label>
            <div className="space-y-2">
              {['Send notification', 'Assign task', 'Update status', 'Send email'].map((action) => (
                <label key={action} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{action}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setCreateModalOpen(false);
                setSelectedTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              setCreateModalOpen(false);
              toast.loading("Coming Soon");
            }}>
              Create Automation
            </Button>
          </div>
        </div>
      </Modal>

      {filteredRules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Zap className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            No automations found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Create your first automation to get started
          </p>
        </motion.div>
      )}
    </div>
  );
};
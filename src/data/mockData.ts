import { Project, Task, User, TimeEntry, FileItem, Integration, WorkflowRule } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Current User',
    role: 'manager',
    isOnline: true,
    lastSeen: new Date(),
    timezone: 'UTC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  },
  {
    id: '2',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    role: 'manager',
    isOnline: true,
    lastSeen: new Date(),
    timezone: 'UTC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: '3',
    email: 'mike@example.com',
    name: 'Mike Chen',
    role: 'member',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    timezone: 'UTC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: '4',
    email: 'emily@example.com',
    name: 'Emily Davis',
    role: 'member',
    isOnline: true,
    lastSeen: new Date(),
    timezone: 'UTC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
  },
  {
    id: '5',
    email: 'alex@example.com',
    name: 'Alex Rodriguez',
    role: 'admin',
    isOnline: true,
    lastSeen: new Date(),
    timezone: 'UTC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of our mobile application with modern UI/UX',
    status: 'active',
    priority: 'high',
    progress: 65,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-30'),
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    owner: mockUsers[0],
    tags: ['design', 'mobile', 'ui/ux'],
    color: '#3b82f6',
    tasksCount: {
      total: 24,
      completed: 15,
      inProgress: 6,
      todo: 3
    }
  },
  {
    id: '2',
    name: 'API Integration',
    description: 'Integration with third-party payment and analytics APIs',
    status: 'active',
    priority: 'medium',
    progress: 40,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-15'),
    members: [mockUsers[2], mockUsers[3], mockUsers[4]],
    owner: mockUsers[4],
    tags: ['backend', 'api', 'integration'],
    color: '#14b8a6',
    tasksCount: {
      total: 18,
      completed: 7,
      inProgress: 4,
      todo: 7
    }
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 marketing campaign for product launch',
    status: 'planning',
    priority: 'medium',
    progress: 20,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-30'),
    members: [mockUsers[1], mockUsers[3]],
    owner: mockUsers[1],
    tags: ['marketing', 'campaign', 'launch'],
    color: '#f97316',
    tasksCount: {
      total: 12,
      completed: 2,
      inProgress: 3,
      todo: 7
    }
  },
  {
    id: '4',
    name: 'Security Audit',
    description: 'Comprehensive security audit and vulnerability assessment',
    status: 'completed',
    priority: 'urgent',
    progress: 100,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-15'),
    members: [mockUsers[4], mockUsers[2]],
    owner: mockUsers[4],
    tags: ['security', 'audit', 'compliance'],
    color: '#dc4126',
    tasksCount: {
      total: 8,
      completed: 8,
      inProgress: 0,
      todo: 0
    }
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new login screen',
    description: 'Create modern login interface with biometric authentication support',
    status: 'in-progress',
    priority: 'high',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    projectId: '1',
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10'),
    tags: ['design', 'ui'],
    estimatedHours: 16,
    loggedHours: 8,
    dependencies: [],
    comments: [],
    attachments: [],
    subtasks: [
      { id: '1', title: 'Create wireframes', completed: true, createdAt: new Date() },
      { id: '2', title: 'Design mockups', completed: false, createdAt: new Date() }
    ]
  },
  {
    id: '2',
    title: 'Implement payment gateway',
    description: 'Integrate Stripe payment processing with error handling',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[2],
    reporter: mockUsers[4],
    projectId: '2',
    dueDate: new Date('2024-03-01'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    tags: ['backend', 'payment'],
    estimatedHours: 24,
    loggedHours: 0,
    dependencies: ['3'],
    comments: [],
    attachments: [],
    subtasks: []
  },
  {
    id: '3',
    title: 'Setup payment database schema',
    description: 'Create database tables for payment transactions and user billing',
    status: 'done',
    priority: 'medium',
    assignee: mockUsers[2],
    reporter: mockUsers[4],
    projectId: '2',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-12'),
    tags: ['database', 'backend'],
    estimatedHours: 8,
    loggedHours: 6,
    dependencies: [],
    comments: [],
    attachments: [],
    subtasks: []
  },
  {
    id: '4',
    title: 'Create social media content',
    description: 'Design and create content for social media marketing campaign',
    status: 'review',
    priority: 'medium',
    assignee: mockUsers[3],
    reporter: mockUsers[1],
    projectId: '3',
    dueDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-08'),
    tags: ['content', 'social-media'],
    estimatedHours: 20,
    loggedHours: 18,
    dependencies: [],
    comments: [],
    attachments: [],
    subtasks: []
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    taskId: '1',
    userId: '2',
    description: 'Working on login screen wireframes',
    startTime: new Date('2024-02-10T09:00:00'),
    endTime: new Date('2024-02-10T12:00:00'),
    duration: 180,
    date: new Date('2024-02-10')
  },
  {
    id: '2',
    taskId: '3',
    userId: '3',
    description: 'Setting up payment database tables',
    startTime: new Date('2024-02-12T14:00:00'),
    endTime: new Date('2024-02-12T18:00:00'),
    duration: 240,
    date: new Date('2024-02-12')
  }
];

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Design Assets',
    type: 'folder',
    projectId: '1',
    uploadedBy: mockUsers[1],
    uploadedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'login-mockup.fig',
    type: 'file',
    size: 2456789,
    parentId: '1',
    projectId: '1',
    uploadedBy: mockUsers[1],
    uploadedAt: new Date('2024-02-10'),
    url: 'https://example.com/files/login-mockup.fig',
    mimeType: 'application/octet-stream',
    versions: [
      {
        id: '1',
        version: 1,
        url: 'https://example.com/files/login-mockup-v1.fig',
        uploadedBy: mockUsers[1],
        uploadedAt: new Date('2024-02-10'),
        size: 2456789
      }
    ]
  },
  {
    id: '3',
    name: 'registration-mockup.fig',
    type: 'file',
    size: 3456789,
    parentId: '1',
    projectId: '1',
    uploadedBy: mockUsers[2],
    uploadedAt: new Date('2024-02-12'),
    url: 'https://example.com/files/registration-mockup.fig',
    mimeType: 'application/octet-stream',
  }
];

export const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'GitHub',
    description: 'Connect your GitHub repositories for code tracking',
    icon: 'github',
    category: 'version_control',
    isConnected: true,
    lastSync: new Date('2024-02-10T10:30:00')
  },
  {
    id: '2',
    name: 'Slack',
    description: 'Get project notifications in your Slack channels',
    icon: 'slack',
    category: 'communication',
    isConnected: false
  },
  {
    id: '3',
    name: 'Google Drive',
    description: 'Sync files with your Google Drive',
    icon: 'drive',
    category: 'storage',
    isConnected: true,
    lastSync: new Date('2024-02-09T15:45:00')
  }
];

export const mockWorkflowRules: WorkflowRule[] = [
  {
    id: '1',
    name: 'Auto-assign code review',
    description: 'Automatically assign code review tasks to senior developers',
    projectId: '1',
    trigger: {
      type: 'task_status_changed',
      conditions: { from: 'in-progress', to: 'review' }
    },
    actions: [
      {
        type: 'assign_task',
        params: { userId: '5' }
      },
      {
        type: 'send_notification',
        params: { message: 'Code review requested' }
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-20')
  }
];
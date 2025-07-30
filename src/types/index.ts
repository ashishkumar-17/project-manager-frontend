export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
  isOnline: boolean;
  lastSeen: Date;
  timezone: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "PLANNING" |  "ACTIVE" | "ON_HOLD" | "COMPLETED";
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  progress: number;
  startDate: string;
  endDate: string;
  members: string[];
  ownerId: string;
  tags: string[];
  color: string;
  readOnly?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignee: string;
  reporter: string;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  estimatedHours?: number;
  loggedHours: number;
  dependencies: string[];
  comments: Comment[];
  attachments: Attachment[];
  subtasks: Subtask[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  mentions: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes/
  date: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  mentions?: string[];
  edited?: boolean;
  reactions?: Reaction[];
}

export interface Reaction {
  emoji: string;
  users: User[];
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'deadline_approaching' | 'project_updated';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  userId: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  parentId?: string;
  uploadedBy: User;
  uploadedAt: Date;
  versions?: FileVersion[];
  url?: string;
  mimeType?: string;
}

export interface FileVersion {
  id: string;
  version: number;
  url: string;
  uploadedBy: User;
  uploadedAt: Date;
  size: number;
  comments?: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  projectId: string;
  trigger: {
    type: 'task_status_changed' | 'task_assigned' | 'due_date_approaching';
    conditions: Record<string, any>;
  };
  actions: {
    type: 'send_notification' | 'assign_task' | 'update_status' | 'send_email';
    params: Record<string, any>;
  }[];
  isActive: boolean;
  createdAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'version_control' | 'communication' | 'time_tracking' | 'storage';
  isConnected: boolean;
  config?: Record<string, any>;
  lastSync?: Date;
}
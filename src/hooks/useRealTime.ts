import { create } from 'zustand';
import { User, ChatMessage, Notification } from '../types';

interface RealTimeState {
  isConnected: boolean;
  onlineUsers: User[];
  messages: ChatMessage[];
  notifications: Notification[];
  typingUsers: string[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (content: string, projectId: string) => void;
  markNotificationRead: (id: string) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
}

export const useRealTime = create<RealTimeState>((set) => ({
  isConnected: false,
  onlineUsers: [],
  messages: [
    {
      id: '1',
      content: 'Welcome to the team chat! 👋',
      author: {
        id: '2',
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        username: '@sarah_johnson',
        role: 'MANAGER',
        isOnline: true,
        lastSeen: new Date(),
        timezone: 'UTC',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text'
    },
    {
      id: '2',
      content: 'Thanks! Excited to be working with everyone.',
      author: {
        id: '3',
        email: 'mike@example.com',
        name: 'Mike Chen',
        username: '@mike_chen',
        role: 'MEMBER',
        isOnline: true,
        lastSeen: new Date(),
        timezone: 'UTC',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text'
    }
  ],
  notifications: [
    {
      id: '1',
      type: 'task_assigned',
      title: 'New task assigned',
      message: 'You have been assigned to "Design new login screen"',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      userId: '1'
    },
    {
      id: '2',
      type: 'comment_added',
      title: 'New comment',
      message: 'Sarah commented on your task',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      userId: '1'
    },
    {
      id: '3',
      type: 'deadline_approaching',
      title: 'Deadline approaching',
      message: 'Task "API Integration" is due tomorrow',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      userId: '1'
    }
  ],
  typingUsers: [],

  connect: () => {
    // Simulate WebSocket connection
    set({ isConnected: true });
    
    // Simulate some online users
    const mockUsers: User[] = [
      {
        id: '2',
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        username: '@saraj_johnson',
        role: 'MANAGER',
        isOnline: true,
        lastSeen: new Date(),
        timezone: 'UTC',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
      },
      {
        id: '3',
        email: 'mike@example.com',
        name: 'Mike Chen',
        username: '@mike_chan',
        role: 'MEMBER',
        isOnline: true,
        lastSeen: new Date(),
        timezone: 'UTC',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
      }
    ];
    
    set({ onlineUsers: mockUsers });
  },

  disconnect: () => {
    set({ isConnected: false, onlineUsers: [] });
  },

  sendMessage: (content: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: {
        id: '1',
        email: 'user@example.com',
        name: 'Current User',
        username: '@current_user',
        role: 'MEMBER',
        isOnline: true,
        lastSeen: new Date(),
        timezone: 'UTC',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
      },
      timestamp: new Date(),
      type: 'text'
    };

    set(state => ({
      messages: [...state.messages, newMessage]
    }));
  },

  markNotificationRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  addTypingUser: (userId: string) => {
    set(state => ({
      typingUsers: [...new Set([...state.typingUsers, userId])]
    }));
  },

  removeTypingUser: (userId: string) => {
    set(state => ({
      typingUsers: state.typingUsers.filter(id => id !== userId)
    }));
  }
}));
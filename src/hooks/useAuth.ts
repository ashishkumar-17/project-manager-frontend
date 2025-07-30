import { create } from 'zustand';
import { User } from '../types';
import { useLoading } from './useLoading';
import axios from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (userId: string | undefined) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  
}
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

export const useAuth = create<AuthState>((set, get) => ({
  user: savedUser ? JSON.parse(savedUser): null,
  isAuthenticated: !!savedToken,

  login: async (email: string, password: string) => {
    const { setLoading } = useLoading.getState();
    setLoading(true, 'Signing you in...');

    try {
      const tokenResponse = await axios.post('/api/auth/login', { email, password });
      const userResponse = await axios.get(`/api/auth/${email}`);


      const data = tokenResponse.data;
      const userData = userResponse.data;

      localStorage.setItem('token', data.token);

      const avatar = userData.avatar && userData.avatar.trim() !== ""
      ? userData.avatar
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`;

      const user: User = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        name: userData.name,
        role: userData.role,
        isOnline: true,
        lastSeen: new Date(),
        timezone: userData.timezone,
        avatar: avatar,
      };

      set({ user, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(user));

      setLoading(false);
      toast.success('Welcome back!');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data || 'Login failed');
    }
  },

   register: async (name, email, username, password) => {
     const { setLoading } = useLoading.getState();
     setLoading(true, 'Registering you with US...');

    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        username,
        password
      });

      setLoading(false);
      toast.success('Account created successfully!');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data || 'Registration failed');
    }
  },

  logout: async (userId : string | undefined) => {
    const { setLoading } = useLoading.getState();
    setLoading(true, 'Signing you out...');
    try {
      await axios.put(`/api/auth/logout/${userId}`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
      setLoading(false);
      toast.success('logout Successfully.');
    }catch (error: any) {
      console.error("logout Error: " , error.message);
      setLoading(false);
      toast.error('Logout Failed');
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const { setLoading } = useLoading.getState();
    setLoading(true, 'Updating...');
    const currentUser = get().user;
    const token = localStorage.getItem('token');
    if (!currentUser || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`/api/users/me`, data);
      set({ user: { ...currentUser, ...response.data } });
      setLoading(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      setLoading(false);
      console.error('Update profile error:', error.response?.data || error.message);
      toast.error('Failed to update profile');
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    const { setLoading } = useLoading.getState();
    setLoading(true, 'Updating...');
    const currentUser = get().user;
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      await axios.put(`/api/users/me/password`, {
        currentPassword,
        newPassword,
      });
      setLoading(false);
      toast.success('Password updated successfully!');
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data || 'Password update failed');
    }
  },

  updateAvatar: async (file: File) => {
    const { setLoading } = useLoading.getState();
    setLoading(true, 'Updating...');
    const currentUser = get().user;
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await axios.post(`/api/users/me/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatarUrl = res.data.avatar;
      set({ user: { ...currentUser, avatar: newAvatarUrl } });
      setLoading(false);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Update profile error:', error);
      toast.error('Avatar upload failed');
    }
  },
}));
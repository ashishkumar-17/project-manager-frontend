import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  CreditCard,
  Users,
  Save,
  Eye,
  EyeOff,
  Edit,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useData } from '../hooks/useData.ts';


export const Settings: React.FC = () => {
  const { user, updateProfile, updatePassword, updateAvatar } = useAuth();
  const { users } = useData();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [showPassword, setShowPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    timezone: user?.timezone || 'UTC',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'team', name: 'Team', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  const handleSave = async () => {
    try {
      if (activeTab === 'profile') {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        timezone: formData.timezone
      });
      toast.success('Profile updated');
      setEditingProfile(false);
    }
    if (activeTab === 'security') {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        toast.error('Fill all password fields');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      await updatePassword(formData.currentPassword, formData.newPassword);
      toast.success('Password updated');
      setEditingSecurity(false);
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
    }
  };

  const handleThemeChange = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // System theme
      // localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Profile Information
              </h3>
              {!editingProfile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => setEditingProfile(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {editingProfile ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size="xl"
                  />
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      >
                      Change Photo
                    </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const maxSizeMB = 1;
                            const maxSizeBytes = maxSizeMB * 1024 * 1024;

                            if (file.size > maxSizeBytes) {
                              toast.error("File size exceeds 1MB limit");
                              return;
                            }

                            updateAvatar(file)
                              .then(() => toast.success("Avatar updated"))
                              .catch(() => toast.error("Avatar update failed"));
                          }}}
                      />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size="xl"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                      {user?.name}
                    </h4>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {user?.username}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Language
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">English</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Task assignments', description: 'Get notified when you are assigned to a task' },
                  { name: 'Project updates', description: 'Receive updates about projects you are part of' },
                  { name: 'Comments and mentions', description: 'Get notified when someone mentions you' },
                  { name: 'Due date reminders', description: 'Receive reminders before task deadlines' }
                ].map((notification) => (
                  <div key={notification.name} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {notification.name}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {notification.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Security Settings
              </h3>
              {!editingSecurity && (
                <Button 
                  variant="outline" 
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => setEditingSecurity(true)}
                >
                  Change Password
                </Button>
              )}
            </div>

            {editingSecurity ? (
              <div className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button onClick={handleSave}>
                    Update Password
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingSecurity(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Password was last changed 30 days ago
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Two-Factor Authentication
              </h3>
              <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                      Authenticator App
                    </h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Use an authenticator app to generate verification codes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Theme
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Light', value: 'light', preview: 'bg-white border-2' },
                  { name: 'Dark', value: 'dark', preview: 'bg-neutral-900 border-2' },
                  { name: 'System', value: 'system', preview: 'bg-gradient-to-r from-white to-neutral-900 border-2' }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className="cursor-pointer group"
                  >
                    <div className={`${theme.preview} border-neutral-200 dark:border-neutral-700 rounded-lg p-4 h-24 mb-2 group-hover:border-primary-500 transition-colors`} />
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-center">
                      {theme.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Team Members
              </h3>
              <Button icon={<Users className="w-4 h-4" />}>
                Invite Member
              </Button>
            </div>
            <div className="space-y-4">
              {users.map((member) => (
                <div key={member.email} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar name={member.name} size="sm" />
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {member.name}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {member.role}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.isOnline
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {member.isOnline ? 'online' : 'offline'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                Current Plan
              </h3>
              <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Pro Plan
                    </h4>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      $29/month • Billed monthly
                    </p>
                  </div>
                  <Button variant="outline">
                    Change Plan
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Projects</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">Unlimited</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Team Members</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">Up to 50</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Storage</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">100 GB</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 dark:text-neutral-400">Support</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">Priority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
              </div>
              {renderTabContent()}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
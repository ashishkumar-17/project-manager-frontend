import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Hash, 
  Users, 
  Phone, 
  Video, 
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  AtSign
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { mockUsers } from '../data/mockData';
import { useRealTime } from '../hooks/useRealTime';

export const Messages: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  const { onlineUsers, messages, sendMessage } = useRealTime();

  const channels = [
    { id: 'general', name: 'general', type: 'channel', unread: 3 },
    { id: 'development', name: 'development', type: 'channel', unread: 0 },
    { id: 'design', name: 'design', type: 'channel', unread: 1 },
    { id: 'marketing', name: 'marketing', type: 'channel', unread: 0 }
  ];

  const directMessages = mockUsers.slice(1, 4);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput, selectedChannel);
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-full bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Messages
            </h2>
            <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />} />
          </div>
          <Input
            placeholder="Search conversations..."
            icon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Channels */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
              Channels
            </h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
              Direct Messages
            </h3>
            <div className="space-y-1">
              {directMessages.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedChannel(`dm-${user.id}`)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedChannel === `dm-${user.id}`
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    status={user.isOnline ? 'online' : 'offline'}
                    size="sm"
                    className="mr-3"
                  />
                  <span className="font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {selectedChannel.startsWith('dm-') ? (
                <>
                  <Avatar
                    src={directMessages.find(u => selectedChannel === `dm-${u.id}`)?.avatar}
                    name={directMessages.find(u => selectedChannel === `dm-${u.id}`)?.name}
                    status="online"
                    size="sm"
                    className="mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {directMessages.find(u => selectedChannel === `dm-${u.id}`)?.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Active now
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Hash className="w-5 h-5 text-neutral-400 mr-2" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      #{selectedChannel}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {mockUsers.length} members
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon={<Phone className="w-4 h-4" />} />
              <Button variant="ghost" size="sm" icon={<Video className="w-4 h-4" />} />
              <Button variant="ghost" size="sm" icon={<Users className="w-4 h-4" />} />
              <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Welcome to #{selectedChannel}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                This is the beginning of your conversation.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <Avatar
                  src={message.author.avatar}
                  name={message.author.name}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {message.author.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Message #${selectedChannel}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-neutral-100"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded">
                  <Paperclip className="w-4 h-4 text-neutral-400" />
                </button>
                <button className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded">
                  <Smile className="w-4 h-4 text-neutral-400" />
                </button>
                <button className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded">
                  <AtSign className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
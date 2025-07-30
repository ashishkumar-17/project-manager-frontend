import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Folder,
  File,
  Download,
  Share,
  MoreHorizontal,
  Filter,
  FolderPlus,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal} from "../components/ui/ConfirmModal.tsx";
import { FilePreviewModal } from "../components/ui/FilePreviewModal.tsx"
import {createFolder, deleteFile, uploadFile} from '../services/api.ts';
import { useData } from '../hooks/useData.ts';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FileItem, User} from '../types';

export const Files: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {projects, users, files, refetch} = useData();
  const {user} = useAuth();

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = currentFolder ? file.parentId === currentFolder : !file.parentId;
    return matchesSearch && matchesFolder;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'zip':
      case 'rar':
        return '📦';
      default:
        return '📄';
    }
  };

  // Handle file selection from input
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setPreviewFiles(Array.from(files));
      setPreviewModalOpen(true);
    }
  };

  // Handle file drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setPreviewFiles(Array.from(files));
      setPreviewModalOpen(true);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Handle confirmed upload
  const handleConfirmUpload = async () => {
    try {
      for (const file of previewFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploaderId', `${user?.id}`);
        if (currentFolder) formData.append('parentId', currentFolder);
        await uploadFile(formData);
      }
      await refetch();
      toast.success('Files uploaded successfully!');
      setPreviewFiles([]); // Clear preview files
      setPreviewModalOpen(false); // Close preview modal
    } catch (err) {
      console.error('File upload failed:', err);
      toast.error('File upload failed!');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const formData = new FormData();
    formData.append('folder', newFolderName);
    formData.append('creatorId', `${user?.id}`);
    if (currentFolder) formData.append('parentId', currentFolder);
    try {
      await createFolder(formData);
      setNewFolderName('');
      setNewFolderModalOpen(false);
      await refetch();
      toast.success('Folder created successfully!');
    } catch (error) {
      setNewFolderName('');
      setNewFolderModalOpen(false);
      console.error('Error creating folder:', error);
      toast.error('Folder creation failed');
    }
  };

  const handleFileAction = async (file: FileItem, action: string) => {
    switch (action) {
      case 'download':
        console.log('Download file:', file.name);
        break;
      case 'share':
        console.log('Share file:', file.name);
        break;
      case 'delete':
        setSelectedFile(file);
        setConfirmModalOpen(true);
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFile(selectedFile?.id);
      await refetch();
      toast.success("Delete file/folder successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Project Deletion Failed!");
    }
  };

  const getUploader = (uploaderId: string | User) => {
    return users.find((user) => user.id === uploaderId) || null;
  };

  const FileActions = ({ file }: {file: FileItem}) => {
    return (
        <div className="flex flex-col py-1">
          <button
              onClick={() => handleFileAction(file, 'download')}
              className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Download className="w-4 h-4 mr-2"/>
            Download
          </button>
          <button
              onClick={() => handleFileAction(file, 'share')}
              className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Share className="w-4 h-4 mr-2"/>
            Share
          </button>

          <button
              onClick={() => handleFileAction(file, 'delete')}
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <MoreHorizontal className="w-4 h-4 mr-2"/>
            Delete
          </button>
        </div>
    );
  };

  const UploadPreview = ({ file }: { file: File }) => {
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop()?.toLowerCase() || '');
    return (
        <div className="flex items-center space-x-4 p-4 border-b border-neutral-200 dark:border-neutral-700">
          {isImage ? (
              <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded"
              />
          ) : (
              <File className="w-8 h-8 text-neutral-400" />
          )}
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{file.name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(file.size)}</p>
          </div>
        </div>
    );
  };

  return (
      <>
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Files
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Manage and organize your project files
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                  variant="outline"
                  icon={<FolderPlus className="w-4 h-4" />}
                  onClick={() => setNewFolderModalOpen(true)}
              >
                New Folder
              </Button>
              <Button
                  icon={<Upload className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
              >
                Upload Files
              </Button>
              <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
              />
            </div>
          </motion.div>

          {/* Toolbar */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            <div className="flex flex-1 gap-4 max-w-2xl">
              <Input
                  placeholder="Search files..."
                  icon={<Search className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
              />
              <Button
                  variant="outline"
                  size="sm"
                  icon={<Filter className="w-4 h-4" />}
                  onClick={() => setFilterModalOpen(true)}
              >
                Filter
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  icon={<Grid3X3 className="w-4 h-4" />}
              />
              <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  icon={<List className="w-4 h-4" />}
              />
            </div>
          </motion.div>

          {/* Breadcrumb */}
          {currentFolder && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <button
                    onClick={() => setCurrentFolder(null)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  Files
                </button>
                <span>/</span>
                <span className="text-neutral-900 dark:text-neutral-100">
            {files.find(f => f.id === currentFolder)?.name}
          </span>
              </motion.div>
          )}

          {/* Files Grid/List */}
          {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file, index) => {
                  return (
                      <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                      >
                        <Card
                            hover
                            className="cursor-pointer group relative"
                            onClick={() => {
                              if(file.type === 'folder') {
                                setCurrentFolder(file.id)
                              }else {
                                setSelectedFile(file);
                                setShowPreview(true);
                              }
                            }}
                        >
                          <div className="text-center">
                            <div className="mb-3">
                              {file.type === 'folder' ? (
                                  <Folder className="w-12 h-12 text-blue-500 mx-auto" />
                              ) : (
                                  <div className="text-4xl mb-2">
                                    {getFileIcon(file.name)}
                                  </div>
                              )}
                            </div>
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm truncate">
                              {file.name}
                            </h3>
                            {file.type === 'file' && file.size && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                  {formatFileSize(file.size)}
                                </p>
                            )}
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                               onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative group/menu">
                              <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
                              >
                                <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                              </button>
                              <div className="absolute right-0 top-8 w-38 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-30">
                                <FileActions file={file} />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                  );
                })}
              </div>
          ) : (
              <Card>
                <div className="overflow-x-visible">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Size</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Modified</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Uploaded by</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFiles.map((file, index) => {
                      const uploader = getUploader(file.uploadedBy);
                      return (
                          <motion.tr
                              key={file.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                              onClick={() => {
                                if (file.type === 'folder') {
                                  setCurrentFolder(file.id);
                                } else {
                                  setSelectedFile(file);
                                  setShowPreview(true);
                                }
                              }}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {file.type === 'folder' ? (
                                    <Folder className="w-5 h-5 text-blue-500 mr-3" />
                                ) : (
                                    <File className="w-5 h-5 text-neutral-400 mr-3" />
                                )}
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {file.name}
                    </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {file.size ? formatFileSize(file.size) : '-'}
                            </td>
                            <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar
                                    src={uploader?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`}
                                    name={uploader?.name || 'Unknown User'}
                                    size="xs"
                                    className="mr-2"
                                />
                                <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                      {uploader?.name || 'Unknown User'}
                    </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="relative group" onClick={(e) => e.stopPropagation()}>
                                <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
                                  <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                </button>
                                <div
                                    className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
                                >
                                  <FileActions file={file} />
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </Card>
          )}

          {/* Upload Area */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
          >
            <Card className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Drop files here to upload
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  or click to browse your computer
                </p>
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* File Preview Modal */}
          <Modal
              isOpen={previewModalOpen}
              onClose={() => {
                setPreviewFiles([]);
                setPreviewModalOpen(false);
              }}
              title="Preview Files"
          >
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto">
                {previewFiles.map((file, index) => (
                    <UploadPreview key={index} file={file} />
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                    variant="outline"
                    onClick={() => {
                      setPreviewFiles([]);
                      setPreviewModalOpen(false);
                    }}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirmUpload}>
                  Upload Files
                </Button>
              </div>
            </div>
          </Modal>

          {/* Filter Modal */}
          <Modal
              isOpen={filterModalOpen}
              onClose={() => setFilterModalOpen(false)}
              title="Filter Files"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  File Type
                </label>
                <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                  <option value="">All Types</option>
                  <option value="document">Documents</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Project
                </label>
                <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setFilterModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setFilterModalOpen(false)}>
                  Apply Filter
                </Button>
              </div>
            </div>
          </Modal>

          {/* New Folder Modal */}
          <Modal
              isOpen={newFolderModalOpen}
              onClose={() => setNewFolderModalOpen(false)}
              title="Create New Folder"
          >
            <div className="space-y-4">
              <Input
                  label="Folder Name"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setNewFolderModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>
                  Create Folder
                </Button>
              </div>
            </div>
          </Modal>

          {filteredFiles.length === 0 && searchQuery && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
              >
                <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  No files found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Try adjusting your search criteria
                </p>
              </motion.div>
          )}
        </div>
        <ConfirmModal
            isOpen={confirmModalOpen}
            onClose={() => {
              setConfirmModalOpen(false);
              setSelectedFile(null);
            }}
            onConfirm={handleDeleteConfirm}
            title={"Delete " + selectedFile?.type}
            message="Do you really want to delete"
            itemName={selectedFile?.name || 'this File/Folder'}
        />
        <FilePreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            file={selectedFile}
            onDownload={(file) => handleFileAction(file, 'download')}
        />
      </>
  );
};
import React, { useState } from 'react';
import {
    Download,
    X,
    ZoomIn,
    ZoomOut,
    RotateCw,
    FileText,
    Volume2
} from 'lucide-react';
import { FileItem } from '../../types';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: FileItem | null;
    onDownload?: (file: FileItem, action: string) => void;
}

const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileName: string): string => {
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

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               file,
                                                               onDownload
                                                            }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Reset view when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setRotation(0);
        }
    }, [isOpen]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const getFileExtension = (filename: string): string => filename.split('.').pop()?.toLowerCase() || '';

    const renderFilePreview = () => {
        if (!file) return null;

        const extension = getFileExtension(file.name);
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
        const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension);
        const isAudio = ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
        const isPDF = extension === 'pdf';
        const isText = ['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(extension);
        const isCode = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'py', 'java', 'cpp', 'c'].includes(extension);

        if (isImage) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-4 flex items-center space-x-2">
                        <button
                            onClick={handleZoomOut}
                            className="p-2 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-white bg-black/20 px-3 py-1 rounded-lg font-medium">
              {Math.round(zoom * 100)}%
            </span>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleRotate}
                            className="p-2 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors"
                            title="Rotate"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                    </div>
                    <img
                        src={file.url || `https://picsum.photos/800/600?random=${file.id}`}
                        alt={file.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`
                        }}
                        draggable={false}
                    />
                </div>
            );
        }

        if (isVideo) {
            return (
                <div className="flex items-center justify-center h-full p-4">
                    <video
                        controls
                        className="max-w-full max-h-full rounded-lg shadow-lg"
                        src={file.url}
                        preload="metadata"
                    >
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Your browser does not support the video tag.
                        </p>
                    </video>
                </div>
            );
        }

        if (isAudio) {
            return (
                <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
                    <div className="text-center">
                        <Volume2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            {file.name}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                    <audio controls className="w-full max-w-md">
                        <source src={file.url} />
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Your browser does not support the audio element.
                        </p>
                    </audio>
                </div>
            );
        }

        if (isPDF) {
            return (
                <div className="w-full h-full">
                    <iframe
                        src={file.url || `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`}
                        className="w-full h-full border-0"
                        title={file.name}
                    />
                </div>
            );
        }

        if (isText || isCode) {
            return (
                <div className="w-full h-full p-6 bg-neutral-50 dark:bg-neutral-900">
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 h-full overflow-auto">
            <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
              {`// Preview of ${file.name}
${isCode ? '// This is a code file preview' : 'This is a text file preview'}

Sample content would be loaded here from the actual file.
For demonstration purposes, this shows how text-based files
would be displayed in the preview modal.

File: ${file.name}
Size: ${formatFileSize(file.size)}
Type: ${extension?.toUpperCase()} file
Modified: ${new Date(file.uploadedAt).toLocaleString()}

${isCode ? `// Example ${extension} code structure:
function example() {
  return "This would show the actual file content";
}` : `Example content for ${extension} files:
Line 1: Sample data
Line 2: More sample data
Line 3: Additional content...`}
`}
            </pre>
                    </div>
                </div>
            );
        }

        // Default preview for unsupported file types
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8">
                <FileText className="w-16 h-16 text-neutral-400" />
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            Preview not available
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
                            This file type cannot be previewed in the browser. Download the file to view its contents.
                        </p>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 space-y-3 text-left max-w-sm">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">File:</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate ml-2">{file.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Size:</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatFileSize(file.size)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Type:</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{extension?.toUpperCase() || 'Unknown'} file</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Modified:</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onDownload?.(file, 'download')}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Download className="w-4 h-4" />
                    <span>Download to view</span>
                </button>
            </div>
        );
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="text-2xl flex-shrink-0">
                            {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {file.name}
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                            onClick={() => onDownload?.(file, 'download')}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            title="Close"
                        >
                            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    {renderFilePreview()}
                </div>
            </div>
        </div>
    );
};
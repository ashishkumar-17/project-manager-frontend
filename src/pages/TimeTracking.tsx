import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar,
  TrendingUp,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useData } from '../hooks/useData';
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.ts"
import { createTimeEntry } from '../services/api.ts';

export const TimeTracking: React.FC = () => {
  const [manualTaskId, setManualTaskId] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [description, setDescription] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<Date | null>(null);
  const { projects, tasks, timeEntries, refetch } = useData();
  const [isPaused, setIsPaused] = useState(false);
  const [, setElapsedBeforePause] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking  && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddEntry = async () => {
    if (!manualTaskId || !manualStartTime || !manualEndTime || !manualDate) {
      toast.error("Please fill all fields");
      return;
    }

    const start = new Date(`${manualDate}T${manualStartTime}`);
    const end = new Date(`${manualDate}T${manualEndTime}`);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    if (diffMinutes <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      taskId: manualTaskId,
      userId: user?.id,
      description: manualDescription || 'No description',
      startTime: start,
      endTime: end,
      duration: diffMinutes,
      date: new Date(manualDate),
    };

    try {
      await createTimeEntry(newEntry);
      await refetch();
      toast.success("Manual time entry added!");
      setAddEntryModalOpen(false);

      // Clear form
      setManualTaskId('');
      setManualDescription('');
      setManualStartTime('');
      setManualEndTime('');
      setManualDate('');
    } catch (error) {
      console.error(error);
      toast.error("Failed to add manual entry");
    }
  };

  const handleStart = () => {
    if (!selectedTask) {
      toast.error("Please select a task before starting the timer.");
      return;
    }
    setIsTracking(true);
    setIsPaused(false);
    setStartTimestamp(new Date());
  };

  const handlePause = () => {
    setIsPaused(true);
    setElapsedBeforePause(currentTime);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = async () => {
    if (!isTracking || !startTimestamp) return;

    setIsTracking(false);
    setIsPaused(false);

    const endTimestamp = new Date();
    const diffMinutes = Math.floor(currentTime / 60);

    if (diffMinutes >= 10) {
      const newEntry = {
        id: crypto.randomUUID(),
        taskId: selectedTask,
        userId: user?.id,
        description: description || 'No description',
        startTime: startTimestamp,
        endTime: endTimestamp,
        duration: diffMinutes,
        date: new Date()
      };

      try {
        await createTimeEntry(newEntry);
        await refetch();
        toast.success("Time entry saved!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to save time entry.");
      }
    } else {
      toast.error("Entry not saved (less than 10 minutes)", { icon: "⏱️" });
    }

    setCurrentTime(0);
    setStartTimestamp(null);
    setElapsedBeforePause(0);
    setSelectedTask('');
    setDescription('');
  };

  const handleExportReport = () => {
    // Generate CSV or PDF report
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Task,Description,Duration, Task Status\n"
      + timeEntries.map(entry => {
          const task = tasks.find(t => t.id === entry.taskId);
          return `${new Date(entry.date).toLocaleDateString()},${task?.title || 'Unknown'},${entry.description},${Math.floor(entry.duration / 60)}h ${entry.duration % 60}m, ${task?.status}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${user?.name}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalHoursToday = timeEntries
    .filter(entry => {
      const today = new Date();
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === today.toDateString();
    })
    .reduce((total, entry) => total + entry.duration, 0) / 60;

  const totalHoursWeek = timeEntries
    .reduce((total, entry) => total + entry.duration, 0) / 60;

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
            Time Tracking
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Track your time and manage productivity
          </p>
        </div>
        <Button 
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </motion.div>

      {/* Timer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="text-center">
          <div className="mb-6">
            <div className="text-6xl font-mono font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center justify-center space-x-4 mb-6">
              {!isTracking ? (
                  <Button onClick={handleStart} icon={<Play />} size="lg">Start</Button>
              ) : isPaused ? (
                  <Button onClick={handleResume} icon={<Play />} size="lg">Resume</Button>
              ) : (
                  <Button variant={'danger'} onClick={handlePause} icon={<Pause />} size="lg">Pause</Button>
              )}
              {isTracking && (
                  <Button onClick={handleStop} icon={<Square />} size="lg" variant="outline">
                    Stop
                  </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Select Task
              </label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value="">Select a task...</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description
              </label>
              <input
                type="text"
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Today
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                  {totalHoursToday.toFixed(1)}h
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  This Week
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                  {totalHoursWeek.toFixed(1)}h
                </p>
              </div>
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Avg/Day
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                  {(totalHoursWeek / 7).toFixed(1)}h
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Time Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              Recent Time Entries
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<Filter className="w-4 h-4" />}
                onClick={() => setFilterModalOpen(true)}
              >
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setAddEntryModalOpen(true)}
              >
                Add Entry
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {timeEntries.map((entry) => {
              const task = tasks.find(t => t.id === entry.taskId);
              const project = task ? projects.find(p => p.id === task.projectId) : null;
              
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project?.color || '#6b7280' }}
                    />
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task?.title || 'Unknown Task'}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {entry.description}
                      </p>
                      {project && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          {project.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                      {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Time Entries"
      >
        <div className="space-y-4">
          <Input label="Date Range" type="date" />
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

      {/* Add Entry Modal */}
      <Modal
        isOpen={addEntryModalOpen}
        onClose={() => setAddEntryModalOpen(false)}
        title="Add Time Entry"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Task
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    value={manualTaskId}
                    onChange={(e) => setManualTaskId(e.target.value)}>
              <option value="">Select a task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <Input label="Description" placeholder="What did you work on?"
                 value={manualDescription}
                 onChange={(e) => setManualDescription(e.target.value)}/>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time"
                   value={manualStartTime}
                   onChange={(e) => setManualStartTime(e.target.value)}/>
            <Input label="End Time" type="time"
                   value={manualEndTime}
                   onChange={(e) => setManualEndTime(e.target.value)}/>
          </div>
          <Input label="Date" type="date"
                 value={manualDate}
                 onChange={(e) => setManualDate(e.target.value)}/>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setAddEntryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>
              Add Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
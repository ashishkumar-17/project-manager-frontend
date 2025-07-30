import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Project, Task, User, TimeEntry, FileItem } from '../types';

export function useData(userId?: string) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 👇 Shared function for fetching all data
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [projectRes, taskRes, userRes, timeEntryRes, filesRes] = await Promise.all([
                axios.get('/api/projects'),
                axios.get('/api/tasks'),
                axios.get('/api/users'),
                axios.get('/api/time-entry'),
                axios.get('/api/files')
            ]);
            setProjects(projectRes.data || []);
            setTasks(taskRes.data || []);
            setUsers(userRes.data || []);
            setTimeEntries(timeEntryRes.data || []);
            setFiles(filesRes.data || []);
        } catch (error) {
            console.error("Data fetch error:", error);
            setProjects([]);
            setTasks([]);
            setUsers([]);
            setTimeEntries([]);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const refetch = fetchAllData;

    function getAssigneeId(task: any): string | undefined {
        if (!task.assignee) return undefined;
        return typeof task.assignee === 'string' ? task.assignee : task.assignee.id;
    }

    const pendingTasks = userId
        ? tasks.filter(t => getAssigneeId(t) === userId && t.status !== 'DONE').length
        : 0;

    return { projects, tasks, users, loading, timeEntries, pendingTasks, files, refetch };
}
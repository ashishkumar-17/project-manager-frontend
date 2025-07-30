import axios from '../api/axiosInstance';
import type {User, Project, Task, TimeEntry} from '../types';

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get('/api/users');
  return res.data;
};
export const getAllProjects = async () => {
  const res = await axios.get('/api/projects');
  return res.data;
};

export const createProject = async (project: Partial<Project>) => {
  const res = await axios.post('/api/projects/add', project);
  return res.data;
};

export const updateProject = async (projectId: string, project: Partial<Project>) => {
  const res = await axios.put(`/api/projects/update/${projectId}`, project);
  return res.data;
};

export const deleteProject = async (id: string | undefined): Promise<void> => {
  const res = await axios.delete(`/api/projects/delete/${id}`);
  return res.data;
}
export const createTask = async (task: Partial<Task>) => {
  const res = await axios.post('/api/tasks/add', task);
  return res.data;
};

export const updateTask = async (taskId: string, task: Partial<Task>) => {
  const res = await axios.put(`/api/tasks/update/${taskId}`, task);
  return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await axios.delete(`/api/tasks/delete/${id}`);
  return res.data;
};

export const markTaskAsComplete = async (id: string): Promise<void> => {
  const res = await axios.put(`/api/tasks/${id}/markAsComplete`);
  return res.data;
};

export const createTimeEntry = async  (timeEntry: Partial<TimeEntry>) => {
  const res = await axios.post('/api/time-entry/create', timeEntry);
  return  res.data;
}

export const uploadFile = async (formData: FormData) => {
  const res = await axios.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export const createFolder = async  (formData: FormData) => {
  const res = await axios.post('/api/folders', formData);
  return res.data;
}

export const deleteFile = async (id: string | undefined) => {
  const res = await axios.delete(`/api/file/delete/${id}`);
  return res.data;
}
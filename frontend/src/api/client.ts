import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/input/upload', formData);
  return res.data;
};

export const startReconstruction = async (inputId: string, mode: string = 'video') => {
  const res = await apiClient.post(`/reconstruct?input_id=${inputId}&mode=${mode}`);
  return res.data;
};

export const getReconstructStatus = async (jobId: string) => {
  const res = await apiClient.get(`/reconstruct/${jobId}/status`);
  return res.data;
};

export const getWorld = async (worldId: string) => {
  const res = await apiClient.get(`/world/${worldId}`);
  return res.data;
};

export const getWorldScene = async (worldId: string) => {
  const res = await apiClient.get(`/world/${worldId}/scene`);
  return res.data;
};

export const completeWorld = async (worldId: string) => {
  const res = await apiClient.post(`/world/${worldId}/complete`);
  return res.data;
};

export const getMetrics = async (worldId: string) => {
  const res = await apiClient.get(`/world/${worldId}/metrics`);
  return res.data;
};

export const editWorldAppearance = async (worldId: string, edit: any) => {
  const res = await apiClient.post(`/world/${worldId}/edit`, edit);
  return res.data;
};

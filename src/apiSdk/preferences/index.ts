import axios from 'axios';
import queryString from 'query-string';
import { PreferenceInterface } from 'interfaces/preference';
import { GetQueryInterface } from '../../interfaces';

export const getPreferences = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/preferences${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPreference = async (preference: PreferenceInterface) => {
  const response = await axios.post('/api/preferences', preference);
  return response.data;
};

export const updatePreferenceById = async (id: string, preference: PreferenceInterface) => {
  const response = await axios.put(`/api/preferences/${id}`, preference);
  return response.data;
};

export const getPreferenceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/preferences/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePreferenceById = async (id: string) => {
  const response = await axios.delete(`/api/preferences/${id}`);
  return response.data;
};

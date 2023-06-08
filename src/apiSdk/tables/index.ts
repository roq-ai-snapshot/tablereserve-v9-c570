import axios from 'axios';
import queryString from 'query-string';
import { TableInterface } from 'interfaces/table';
import { GetQueryInterface } from '../../interfaces';

export const getTables = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tables${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTable = async (table: TableInterface) => {
  const response = await axios.post('/api/tables', table);
  return response.data;
};

export const updateTableById = async (id: string, table: TableInterface) => {
  const response = await axios.put(`/api/tables/${id}`, table);
  return response.data;
};

export const getTableById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tables/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTableById = async (id: string) => {
  const response = await axios.delete(`/api/tables/${id}`);
  return response.data;
};

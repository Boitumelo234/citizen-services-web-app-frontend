import axios from 'axios';

const API_URL = "http://localhost:8080/api/SystemSettings";

export const getSystemSettings = () => axios.get(API_URL);
export const updateSystemSettings = (settings) => axios.put(API_URL, settings);
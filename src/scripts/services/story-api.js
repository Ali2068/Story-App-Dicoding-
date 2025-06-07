import { getUserToken } from '../utils/auth';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registrasi gagal');
  return data;
};

const loginUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login gagal');
  return data;
};

const getStories = async () => {
  const token = getUserToken();
  if (!token) throw new Error('Token tidak ditemukan atau tidak valid');

  const response = await fetch(`${BASE_URL}/stories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Gagal memuat cerita');
  return data.listStory;
};

const addStory = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Gagal menambahkan cerita');
  return data;
};

export { registerUser, loginUser, getStories, addStory };
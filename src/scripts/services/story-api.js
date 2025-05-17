import { getUserToken } from '../utils/auth';

const BASE_URL = 'https://story-api.dicoding.dev/v1';

const registerUser = async ({ name, email, password }) => {
  const response = await fetch('https://story-api.dicoding.dev/v1/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Registrasi gagal');
  }

  return response.json();
};

const loginUser = async ({ email, password }) => {
  const response = await fetch('https://story-api.dicoding.dev/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Login gagal');
  }

  const data = await response.json();
  return data;
};

const getStories = async () => {
  const token = getUserToken();

  if (!token || token === 'undefined') {
    throw new Error('Token tidak ditemukan atau tidak valid');
  }

  const response = await fetch(`${BASE_URL}/stories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gagal memuat cerita.');
  }

  const data = await response.json();
  return data.listStory;
};

const addStory = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Gagal menambahkan cerita');
  }

  return response.json();
};

export const getVapidKey = async () => {
  const response = await fetch(`${BASE_URL}/push/web`);
  if (!response.ok) throw new Error('Gagal mengambil VAPID key');
  const data = await response.json();
  return data.vapidKey;
};

export { registerUser, loginUser, getStories, addStory };
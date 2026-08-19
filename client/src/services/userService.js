import api from '../api';

export const getPublicProfile = async (username) => {
  const response = await api.get(`/users/${encodeURIComponent(username)}/profile`);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

import api from '../api';

export const getTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

export const getTrip = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await api.post('/trips', tripData);
  return response.data;
};

export const updateTrip = async (id, tripData) => {
  const response = await api.put(`/trips/${id}`, tripData);
  return response.data;
};

export const deleteTrip = async (id) => {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
};

export const uploadTripPhoto = async (tripId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post(`/trips/${tripId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

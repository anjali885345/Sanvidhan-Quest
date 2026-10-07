import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('samvidhan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Modules
export const getModules = () => API.get('/modules');
export const getModule = (id) => API.get(`/modules/${id}`);
export const completeModule = (id) => API.post(`/modules/${id}/complete`);

// Games
export const getQuiz = (moduleId) => API.get(`/games/quiz/${moduleId}`);
export const submitQuiz = (id, answers) => API.post(`/games/quiz/${id}/submit`, { answers });
export const getScenarios = (moduleId) => API.get(`/games/scenario/${moduleId}`);
export const submitScenario = (id, choiceIndex) => API.post(`/games/scenario/${id}/submit`, { choiceIndex });
export const getMatch = (moduleId) => API.get(`/games/match/${moduleId}`);
export const submitMatch = (id, data) => API.post(`/games/match/${id}/submit`, data);
export const getTimeline = (moduleId) => API.get(`/games/timeline/${moduleId}`);
export const submitTimeline = (id, userOrder) => API.post(`/games/timeline/${id}/submit`, { userOrder });
export const getFillBlank = (moduleId) => API.get(`/games/fillblank/${moduleId}`);
export const submitFillBlank = (id, userAnswers) => API.post(`/games/fillblank/${id}/submit`, { userAnswers });
export const getMemory = (moduleId) => API.get(`/games/memory/${moduleId}`);
export const submitMemory = (id, data) => API.post(`/games/memory/${id}/submit`, data);

// Daily Challenge
export const getDailyChallenge = () => API.get('/daily');
export const completeDailyChallenge = () => API.post('/daily/complete');

// Gamification
export const getLeaderboard = () => API.get('/leaderboard');
export const getBadges = () => API.get('/badges');
export const getUserStats = () => API.get('/user/stats');

export default API;

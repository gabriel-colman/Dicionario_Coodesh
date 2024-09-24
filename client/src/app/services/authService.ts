import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${apiBaseUrl}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${apiBaseUrl}/auth/login`, {
    email,
    password,
  });
  return response.data;
};
export const getUserFavorites = async (token: string) => {
  const response = await axios.get(`${apiBaseUrl}/user/me/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserHistory = async (token: string) => {
  const response = await axios.get(`${apiBaseUrl}/user/me/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

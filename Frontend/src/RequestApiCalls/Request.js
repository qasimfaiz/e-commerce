import axios from "axios";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" :  process.env.REACT_APP_BASE_URL;

export const publicRequest = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-type": "application/json",
  },

  withCredentials: true,
});

export const userRequest = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-type": "application/json",
  },

  withCredentials: true,
});
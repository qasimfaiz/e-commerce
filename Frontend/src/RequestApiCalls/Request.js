import axios from "axios";

// const BASE_URL = "https://shopwiki-backend.vercel.app/";
const BASE_URL = "http://localhost:5000";

export const publicRequest = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-type": "application/json",
  },

  withCredentials: true,
});

export const userRequest =
































axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-type": "application/json",
  },

  withCredentials: true,
});

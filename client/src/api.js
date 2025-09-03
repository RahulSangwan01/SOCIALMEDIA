import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Vercel will inject this
  withCredentials: true // keep this if you are using cookies
});

export default api;

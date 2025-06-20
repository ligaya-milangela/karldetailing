import axios from "axios";

const api = axios.create({
  baseURL: "https://kar-detailing-services.onrender.com/api",
  withCredentials: true,
});

export default api;

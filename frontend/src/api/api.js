import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api", // backend local
  baseURL: "https://login-lockoutmechanism.onrender.com",
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    // these are NOT actual errors, they are expected states
    if ([400, 401, 423, 429].includes(status)) {
      return Promise.reject(err);
    }

    console.error("Unexpected API Error:", err);
    return Promise.reject(err);
  }
);

export default API;

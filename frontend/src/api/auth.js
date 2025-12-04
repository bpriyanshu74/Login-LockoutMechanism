import API from "./api";

export const loginUser = (email, password) =>
  API.post("api/auth/login", { email, password });

export const signupUser = (email, password) =>
  API.post("api/auth/signup", { email, password });

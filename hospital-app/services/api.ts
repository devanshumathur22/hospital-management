// services/api.ts

import axios from "axios";

export const API = axios.create({
  baseURL: "http://192.168.1.7:3000/api",
});
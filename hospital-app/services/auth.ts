// services/auth.ts

import { API } from "./api";

export const loginUser = (data: any) =>
  API.post("/auth/login", data);
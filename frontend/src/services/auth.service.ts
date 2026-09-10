import api from "./api";
import { User } from "../types/user";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const registerUser = async (
  data: RegisterData
) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
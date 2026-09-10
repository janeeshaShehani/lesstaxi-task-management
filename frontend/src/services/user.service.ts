import api from "./api";
import { User } from "../types/user";

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");

  console.log("GET /users RESPONSE:", response.data);

  const data = response.data;

  // Backend may return:
  // 1. [...]
  // 2. { users: [...] }
  // 3. { data: [...] }
  // 4. { data: { users: [...] } }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.users)) {
    return data.data.users;
  }

  console.error(
    "Unexpected /users response format:",
    data
  );

  return [];
};

// Get one user
export const getUser = async (
  userId: string
): Promise<User> => {
  const response = await api.get(
    `/users/${userId}`
  );

  const data = response.data;

  if (data?.data) {
    return data.data;
  }

  return data;
};
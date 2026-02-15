import api from './axios';

export type User = {
  id: number;
  username: string;
};

export async function getUserById(id: number): Promise<User | null> {
  try {
    const { data } = await api.get<User>(`users/${id}`);
    return data ?? null;
  } catch {
    return null;
  }
}

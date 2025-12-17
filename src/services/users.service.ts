// src/services/user.service.ts
import HttpClient from '../api/httpClient';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  entityId?: number | null;
  roleId: number;
  entity: Entity;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role{
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface Entity
{
  id: number;
  slug: string;
  name: string;
  abbreviation: string;
  url: string;
  entityType: string;
  parentEntity: number | null;
  governmentLevel: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  entityId?: number;
  roleId: number;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  entityId?: number;
  roleId?: number;
}
export interface PaginatedResponse<T> {
  total?: number;
  limit?: number;
  offset?: number;
  data: T[];
}
export class UserService {
  static async create(userData: CreateUserData): Promise<User> {
    return HttpClient.post<User>('/users', userData);
  }

  static async getAll(): Promise<PaginatedResponse<User>> {
    return HttpClient.get<PaginatedResponse<User>>('/users');
  }

  static async getById(id: number): Promise<User> {
    return HttpClient.get<User>(`/users/${id}`);
  }

  static async update(id: number, userData: UpdateUserData): Promise<User> {
    return HttpClient.patch<User>(`/users/${id}`, userData);
  }

  static async delete(id: number): Promise<void> {
    return HttpClient.delete<void>(`/users/${id}`);
  }

}
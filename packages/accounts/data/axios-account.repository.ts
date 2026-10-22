import axios, { type AxiosInstance } from 'axios';
import type { Account, AccountRepository } from '../domain';

export class AxiosAccountRepository implements AccountRepository {
  private readonly client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL, timeout: 10_000 });
  }

  async findAll(): Promise<readonly Account[]> {
    const response = await this.client.get<readonly Account[]>('/accounts');
    return response.data;
  }
}

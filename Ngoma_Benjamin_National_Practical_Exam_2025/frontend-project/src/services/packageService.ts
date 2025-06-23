import api from './api';

export interface Package {
  _id: string;
  packageNumber: string;
  packageName: string;
  packageDescription: string;
  packagePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageData {
  packageNumber: string;
  packageName: string;
  packageDescription: string;
  packagePrice: number;
}

export const packageService = {
  async getAllPackages(): Promise<Package[]> {
    const response = await api.get('/package');
    return response.data;
  },

  async getPackageById(id: string): Promise<Package> {
    const response = await api.get(`/package/${id}`);
    return response.data;
  },

  async createPackage(data: CreatePackageData): Promise<Package> {
    const response = await api.post('/package', data);
    return response.data;
  },

  async deletePackage(id: string) {
    const response = await api.delete(`/package/${id}`);
    return response.data;
  },
};
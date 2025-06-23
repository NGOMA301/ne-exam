import api from './api';
import { Car } from './carService';
import { Package } from './packageService';

export interface ServicePackage {
  _id: string;
  recordNumber: string;
  serviceDate: string;
  car: Car;
  package: Package;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePackageData {
  recordNumber: string;
  serviceDate?: string;
  car: string;
  package: string;
}

export const servicePackageService = {
  async getAllServicePackages(): Promise<ServicePackage[]> {
    const response = await api.get('/service-package');
    return response.data;
  },

  async getServicePackageById(id: string): Promise<ServicePackage> {
    const response = await api.get(`/service-package/${id}`);
    return response.data;
  },

  async createServicePackage(data: CreateServicePackageData): Promise<ServicePackage> {
    const response = await api.post('/service-package', data);
    return response.data;
  },

  async updateServicePackage(id: string, data: Partial<CreateServicePackageData>): Promise<ServicePackage> {
    const response = await api.put(`/service-package/${id}`, data);
    return response.data;
  },

  async deleteServicePackage(id: string) {
    const response = await api.delete(`/service-package/${id}`);
    return response.data;
  },
};
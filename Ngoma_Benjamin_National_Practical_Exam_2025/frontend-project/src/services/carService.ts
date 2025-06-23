import api from './api';

export interface Car {
  _id: string;
  plateNumber: string;
  carType: string;
  carSize: string;
  driverName: string;
  phoneNumber: string;
}

export interface CreateCarData {
  plateNumber: string;
  carType: string;
  carSize: string;
  driverName: string;
  phoneNumber: string;
}

export const carService = {
  async getAllCars(): Promise<Car[]> {
    const response = await api.get('/car');
    return response.data;
  },

  async getCarById(id: string): Promise<Car> {
    const response = await api.get(`/car/${id}`);
    return response.data;
  },

  async createCar(data: CreateCarData): Promise<Car> {
    const response = await api.post('/car', data);
    return response.data;
  },

  async deleteCar(id: string) {
    const response = await api.delete(`/car/${id}`);
    return response.data;
  },
};
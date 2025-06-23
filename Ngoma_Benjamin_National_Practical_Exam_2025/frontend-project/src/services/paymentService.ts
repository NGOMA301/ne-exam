import api from './api';
import { ServicePackage } from './servicePackageService';

export interface Payment {
  _id: string;
  paymentNumber: string;
  amountPaid: number;
  paymentDate: string;
  servicePackage: ServicePackage;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  paymentNumber: string;
  amountPaid: number;
  paymentDate?: string;
  servicePackage: string;
}

export interface DailyReportData {
  plateNumber: string;
  packageName: string;
  packageDescription: string;
  amountPaid: number;
  paymentDate: string;
}

export interface DailyReport {
  date: string;
  count: number;
  data: DailyReportData[];
}

export const paymentService = {
  async getAllPayments(): Promise<Payment[]> {
    const response = await api.get('/payment');
    return response.data;
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await api.get(`/payment/${id}`);
    return response.data;
  },

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post('/payment', data);
    return response.data;
  },

  async getInvoice(id: string) {
    const response = await api.get(`/payment/${id}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getDailyReport(date: string): Promise<DailyReport> {
    const response = await api.get(`/payment/reports/daily?date=${date}`);
    return response.data;
  },
};
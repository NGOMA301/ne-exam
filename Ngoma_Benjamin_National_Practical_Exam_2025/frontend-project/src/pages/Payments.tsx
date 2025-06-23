import React, { useState, useEffect } from 'react';
import { Plus, Search, Download, CreditCard, FileText } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import InputWithGenerator from '../components/UI/InputWithGenerator';
import Modal from '../components/UI/Modal';
import { paymentService, Payment, CreatePaymentData } from '../services/paymentService';
import { servicePackageService, ServicePackage } from '../services/servicePackageService';
import { generatePaymentNumber } from '../utils/generators';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePaymentData>({
    paymentNumber: '',
    amountPaid: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    servicePackage: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(payment =>
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.servicePackage.car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.servicePackage.package.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [payments, searchTerm]);

  const fetchData = async () => {
    try {
      const [paymentsData, servicePackagesData] = await Promise.all([
        paymentService.getAllPayments(),
        servicePackageService.getAllServicePackages(),
      ]);
      setPayments(paymentsData);
      setServicePackages(servicePackagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentService.createPayment(formData);
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const blob = await paymentService.getInvoice(paymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice_${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      paymentNumber: '',
      amountPaid: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      servicePackage: '',
    });
  };

  const handleGeneratePaymentNumber = () => {
    setFormData({ ...formData, paymentNumber: generatePaymentNumber() });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Manage payment records and generate invoices</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Process Payment
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search payments by payment number, plate number, or package name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No payments match your search criteria.' : 'Get started by processing your first payment.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Process Payment
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments?.map((payment) => (
            <Card key={payment._id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">#{payment?.paymentNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(payment?.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Vehicle</p>
                      <p className="font-medium text-gray-900">{payment?.servicePackage?.car?.plateNumber}</p>
                      <p className="text-gray-500">{payment?.servicePackage?.car?.driverName}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Service Package</p>
                      <p className="font-medium text-gray-900">{payment?.servicePackage?.package?.packageName}</p>
                      <p className="text-gray-500">Record: #{payment?.servicePackage?.recordNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Processed by</p>
                      <p className="font-medium text-gray-900">{payment?.user?.username}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${payment.amountPaid.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(payment._id)}
                    className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Invoice
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Process Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Process Payment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithGenerator
            label="Payment Number"
            type="text"
            value={formData.paymentNumber}
            onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
            placeholder="Enter payment number or generate random"
            onGenerate={handleGeneratePaymentNumber}
            generatorTooltip="Generate random payment number"
            required
          />
          
          <Input
            label="Payment Date"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            required
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Service Record</label>
            <select
              value={formData.servicePackage}
              onChange={(e) => {
                const selectedService = servicePackages.find(sp => sp._id === e.target.value);
                setFormData({ 
                  ...formData, 
                  servicePackage: e.target.value,
                  amountPaid: selectedService ? selectedService.package.packagePrice : 0
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Choose a service record...</option>
              {servicePackages?.map((service) => (
                <option key={service._id} value={service._id}>
                  #{service?.recordNumber} - {service?.car?.plateNumber} - {service?.package?.packageName} (${service?.package?.packagePrice})
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Amount Paid ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.amountPaid}
            onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })}
            placeholder="Enter amount paid"
            required
          />
          
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Process Payment
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;
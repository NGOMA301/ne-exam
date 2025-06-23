import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FileText, Car, Package } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import InputWithGenerator from '../components/UI/InputWithGenerator';
import Modal from '../components/UI/Modal';
import { servicePackageService, ServicePackage, CreateServicePackageData } from '../services/servicePackageService';
import { carService, Car as CarType } from '../services/carService';
import { packageService, Package as PackageType } from '../services/packageService';
import { generateRecordNumber } from '../utils/generators';

const Services: React.FC = () => {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServicePackage[]>([]);
  const [cars, setCars] = useState<CarType[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState<CreateServicePackageData>({
    recordNumber: '',
    serviceDate: new Date().toISOString().split('T')[0],
    car: '',
    package: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.package.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const fetchData = async () => {
    try {
      const [servicesData, carsData, packagesData] = await Promise.all([
        servicePackageService.getAllServicePackages(),
        carService.getAllCars(),
        packageService.getAllPackages(),
      ]);
      setServices(servicesData);
      setCars(carsData);
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicePackageService.updateServicePackage(editingService._id, formData);
      } else {
        await servicePackageService.createServicePackage(formData);
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await servicePackageService.deleteServicePackage(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleEdit = (service: ServicePackage) => {
    setEditingService(service);
    setFormData({
      recordNumber: service.recordNumber,
      serviceDate: new Date(service.serviceDate).toISOString().split('T')[0],
      car: service.car._id,
      package: service.package._id,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      recordNumber: '',
      serviceDate: new Date().toISOString().split('T')[0],
      car: '',
      package: '',
    });
  };

  const handleGenerateRecordNumber = () => {
    setFormData({ ...formData, recordNumber: generateRecordNumber() });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Service Records</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Service Records</h1>
          <p className="text-gray-600 mt-2">Track all car wash services performed</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search services by record number, plate number, or package name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No service records found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No services match your search criteria.' : 'Get started by adding your first service record.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Service
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredServices?.map((service) => (
            <Card key={service._id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">#{service?.recordNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(service?.serviceDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{service?.car?.plateNumber}</p>
                        <p className="text-gray-500">{service?.car?.carType} - {service?.car?.carSize}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-teal-500" />
                      <div>
                        <p className="font-medium text-gray-900">{service?.package?.packageName}</p>
                        <p className="text-gray-500">${service?.package?.packagePrice}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500">Receptionist</p>
                      <p className="font-medium text-gray-900">{service?.user?.username}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 lg:flex-none px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex-1 lg:flex-none px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? 'Edit Service Record' : 'Add New Service Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithGenerator
            label="Record Number"
            type="text"
            value={formData.recordNumber}
            onChange={(e) => setFormData({ ...formData, recordNumber: e.target.value })}
            placeholder="Enter record number or generate random"
            onGenerate={handleGenerateRecordNumber}
            generatorTooltip="Generate random record number"
            required
          />
          
          <Input
            label="Service Date"
            type="date"
            value={formData.serviceDate}
            onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
            required
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Car</label>
            <select
              value={formData.car}
              onChange={(e) => setFormData({ ...formData, car: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Choose a car...</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.plateNumber} - {car.carType} ({car.driverName})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Select Package</label>
            <select
              value={formData.package}
              onChange={(e) => setFormData({ ...formData, package: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Choose a package...</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.packageName} - ${pkg.packagePrice}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingService ? 'Update Service' : 'Add Service'}
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

export default Services;
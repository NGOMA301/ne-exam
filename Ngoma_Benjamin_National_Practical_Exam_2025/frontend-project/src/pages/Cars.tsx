import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Car } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import InputWithGenerator from '../components/UI/InputWithGenerator';
import Modal from '../components/UI/Modal';
import { carService, Car as CarType, CreateCarData } from '../services/carService';
import { generatePlateNumber } from '../utils/generators';

const Cars: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [formData, setFormData] = useState<CreateCarData>({
    plateNumber: '',
    carType: '',
    carSize: '',
    driverName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car =>
      car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCars(filtered);
  }, [cars, searchTerm]);

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCar) {
        // Update logic would go here if we had an update endpoint
        console.log('Update not implemented in backend');
      } else {
        await carService.createCar(formData);
      }
      await fetchCars();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carService.deleteCar(id);
        await fetchCars();
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleEdit = (car: CarType) => {
    setEditingCar(car);
    setFormData({
      plateNumber: car.plateNumber,
      carType: car.carType,
      carSize: car.carSize,
      driverName: car.driverName,
      phoneNumber: car.phoneNumber,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCar(null);
    setFormData({
      plateNumber: '',
      carType: '',
      carSize: '',
      driverName: '',
      phoneNumber: '',
    });
  };

  const handleGeneratePlateNumber = () => {
    setFormData({ ...formData, plateNumber: generatePlateNumber() });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Cars</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Cars</h1>
          <p className="text-gray-600 mt-2">Manage your registered vehicles</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Add New Car
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search cars by plate number, driver name, or car type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <Card className="text-center py-12">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No cars match your search criteria.' : 'Get started by adding your first car.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Car
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car._id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{car.plateNumber}</h3>
                    <p className="text-sm text-gray-500">{car.carType}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Size:</span>
                  <span className="font-medium text-gray-900">{car.carSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Driver:</span>
                  <span className="font-medium text-gray-900">{car.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">{car.phoneNumber}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Car Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCar ? 'Edit Car' : 'Add New Car'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithGenerator
            label="Plate Number"
            type="text"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
            placeholder="Enter plate number or generate random"
            onGenerate={handleGeneratePlateNumber}
            generatorTooltip="Generate random plate number"
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Car Type"
              type="text"
              value={formData.carType}
              onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
              placeholder="e.g., Sedan, SUV, Truck"
              required
            />
            
            <Input
              label="Car Size"
              type="text"
              value={formData.carSize}
              onChange={(e) => setFormData({ ...formData, carSize: e.target.value })}
              placeholder="e.g., Small, Medium, Large"
              required
            />
          </div>
          
          <Input
            label="Driver Name"
            type="text"
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            placeholder="Enter driver name"
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="Enter phone number"
            required
          />
          
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingCar ? 'Update Car' : 'Add Car'}
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

export default Cars;
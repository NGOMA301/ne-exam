import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import InputWithGenerator from '../components/UI/InputWithGenerator';
import Modal from '../components/UI/Modal';
import { packageService, Package as PackageType, CreatePackageData } from '../services/packageService';
import { generatePackageNumber } from '../utils/generators';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState<CreatePackageData>({
    packageNumber: '',
    packageName: '',
    packageDescription: '',
    packagePrice: 0,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.packageDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.packageNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [packages, searchTerm]);

  const fetchPackages = async () => {
    try {
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        // Update logic would go here if we had an update endpoint
        console.log('Update not implemented in backend');
      } else {
        await packageService.createPackage(formData);
      }
      await fetchPackages();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageService.deletePackage(id);
        await fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      packageNumber: pkg.packageNumber,
      packageName: pkg.packageName,
      packageDescription: pkg.packageDescription,
      packagePrice: pkg.packagePrice,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFormData({
      packageNumber: '',
      packageName: '',
      packageDescription: '',
      packagePrice: 0,
    });
  };

  const handleGeneratePackageNumber = () => {
    setFormData({ ...formData, packageNumber: generatePackageNumber() });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Service Packages</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Service Packages</h1>
          <p className="text-gray-600 mt-2">Manage your car wash service packages</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Add New Package
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search packages by name, description, or package number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'No packages match your search criteria.' : 'Get started by adding your first service package.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Package
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg._id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.packageName}</h3>
                    <p className="text-sm text-gray-500">#{pkg.packageNumber}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">{pkg.packageDescription}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-gray-900">${pkg.packagePrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                  Created {new Date(pkg.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Package Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithGenerator
            label="Package Number"
            type="text"
            value={formData.packageNumber}
            onChange={(e) => setFormData({ ...formData, packageNumber: e.target.value })}
            placeholder="Enter package number or generate random"
            onGenerate={handleGeneratePackageNumber}
            generatorTooltip="Generate random package number"
            required
          />
          
          <Input
            label="Package Name"
            type="text"
            value={formData.packageName}
            onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
            placeholder="Enter package name (e.g., Premium Wash)"
            required
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Package Description
            </label>
            <textarea
              value={formData.packageDescription}
              onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
              placeholder="Enter detailed description of the package..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <Input
            label="Package Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.packagePrice}
            onChange={(e) => setFormData({ ...formData, packagePrice: parseFloat(e.target.value) || 0 })}
            placeholder="Enter package price"
            required
          />
          
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingPackage ? 'Update Package' : 'Add Package'}
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

export default Packages;
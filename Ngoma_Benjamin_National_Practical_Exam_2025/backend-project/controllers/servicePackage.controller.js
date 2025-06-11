import ServicePackage from '../models/ServicePackage.js';

// Create new service record
export const createServicePackage = async (req, res) => {
  try {
    const newService = await ServicePackage.create({
      ...req.body,
      user: req.user._id // auto-attach the receptionist
    });
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service record', error: err.message });
  }
};

// Get all service records
export const getAllServicePackages = async (req, res) => {
  try {
    const services = await ServicePackage.find()
      .populate('car')
      .populate('package')
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service records', error: err.message });
  }
};

// Get single service record
export const getServicePackageById = async (req, res) => {
  try {
    const service = await ServicePackage.findById(req.params.id)
      .populate('car')
      .populate('package')
      .populate('user', 'username');

    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching service record', error: err.message });
  }
};

// Update service record
export const updateServicePackage = async (req, res) => {
  try {
    const updated = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating service record', error: err.message });
  }
};

// Delete service record
export const deleteServicePackage = async (req, res) => {
  try {
    await ServicePackage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service record', error: err.message });
  }
};

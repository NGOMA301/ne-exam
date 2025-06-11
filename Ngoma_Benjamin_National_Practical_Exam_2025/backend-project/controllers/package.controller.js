import Package from '../models/Package.js';

// Create a package
export const createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(500).json({ message: 'Error creating package', error: err.message });
  }
};

// Get all packages
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching packages', error: err.message });
  }
};

// Get package by ID
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching package', error: err.message });
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting package', error: err.message });
  }
};

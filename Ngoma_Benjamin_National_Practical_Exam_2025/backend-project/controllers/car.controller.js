import Car from '../models/Car.js';

// Create car
export const createCar = async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ message: "Error creating car", error: err.message });
  }
};

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cars", error: err.message });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Error fetching car", error: err.message });
  }
};

// Delete car
export const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting car", error: err.message });
  }
};

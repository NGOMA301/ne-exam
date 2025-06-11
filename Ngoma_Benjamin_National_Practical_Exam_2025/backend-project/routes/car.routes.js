import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  deleteCar
} from '../controllers/car.controller.js';

const router = express.Router();

router.post('/', createCar);
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.delete('/:id', deleteCar);

export default router;

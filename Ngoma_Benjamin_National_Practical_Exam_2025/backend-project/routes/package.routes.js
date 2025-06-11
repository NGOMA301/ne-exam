import express from 'express';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  deletePackage
} from '../controllers/package.controller.js';

const router = express.Router();

router.post('/', createPackage);
router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.delete('/:id', deletePackage);

export default router;

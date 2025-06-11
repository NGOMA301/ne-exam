import Payment from '../models/Payment.js';
import { generateInvoicePDF } from '../utils/generateInvoicePDF.js';
import path from 'path';
import fs from 'fs';


export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment', error: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('servicePackage')
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      })
      .populate('user', 'username')
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('servicePackage')
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      })
      .populate('user', 'username');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment', error: err.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'username')
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const invoicePath = await generateInvoicePDF(payment);
    const filename = `invoice_${payment._id}.pdf`;

    res.download(invoicePath, filename, (err) => {
      if (err) console.error('Download error:', err);
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to generate invoice', error: err.message });
  }
};

export const getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format.' });
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const payments = await Payment.find({
      paymentDate: { $gte: start, $lt: end }
    })
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car', select: 'plateNumber' },
          { path: 'package', select: 'packageName packageDescription' }
        ]
      })
      .sort({ paymentDate: -1 });

    const report = payments.map(payment => ({
      plateNumber: payment.servicePackage.car.plateNumber,
      packageName: payment.servicePackage.package.packageName,
      packageDescription: payment.servicePackage.package.packageDescription,
      amountPaid: payment.amountPaid,
      paymentDate: payment.paymentDate,
    }));

    res.status(200).json({ date, count: report.length, data: report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
};

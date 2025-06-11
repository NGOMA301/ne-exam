import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  carType: String,
  carSize: String,
  driverName: String,
  phoneNumber: String
});

export default mongoose.model('Car', carSchema);

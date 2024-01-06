import mongoose, { Schema } from "mongoose";
const appointmentSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  patient: { type: Schema.Types.ObjectId, ref: "patients" },
  medecin: { type: Schema.Types.ObjectId, ref: "medecins" },
});

const appointmentsModel = mongoose.model("appointment", appointmentSchema);

export default appointmentsModel;
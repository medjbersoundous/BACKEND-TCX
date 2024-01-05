import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    Adress:{
        type:String,
        required:true
    },
    Phone:{
        type:Number,
        required:true
    },
    gender: String,
    medecinID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medecins',
    },
    medecinLastname: String,
    medecinFirstname: String,
}, {
    timestamps: true,
});


export const PatientModel = mongoose.model('patients', patientSchema);
  
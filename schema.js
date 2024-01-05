import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: Number,
    role: String,
    medecinID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medecins',
    },
    medecinLastname: String,
    medecinFirstname: String,
}, {
    timestamps: true,
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    specialite: {
        type: String,
        required: true
    },
    patients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'patients',
        },
    ],
}, {
    timestamps: true,
});


export const UserModel = mongoose.model('medecins', userSchema);
export const PatientModel = mongoose.model('patients', patientSchema);

import mongoose from "mongoose";
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
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
    },
    specialite:{
        type:String,
        required:true
    },
    patients: [
        {
            patientID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'patients',
            },
            lastname: String,
            firstname: String,
        },
    ],
}, {
    timestamps: true,
});


export const UserModel = mongoose.model('medecins', userSchema);


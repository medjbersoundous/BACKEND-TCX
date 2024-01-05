import express from "express";
import { PatientModel } from "../models/patients.js";
import { UserModel } from "../models/medecins.js";
export const patientRouter=express.Router()

  //update patient
  // Update a patient by ID
  patientRouter.put('/:id', async (req, res) => {
    const patientId = req.params.id;
    const {  
      firstname, lastname, age, gender, Phone, Adress } = req.body;
  
    try {
      const patient = await PatientModel.findByIdAndUpdate(
        patientId,
        {  
          firstname, lastname,age, gender, Phone, Adress},
        { new: true }
      );
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
  
      res.json(patient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  
  
  
  //get all the patients
  patientRouter.get('/', async (req, res) => {
    try {
      const patients = await PatientModel.find();
      res.json(patients);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  //get one patient by id
  patientRouter.get('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await PatientModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Medecin not found' });
      }
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


// ajouter patient
patientRouter.post('/', async (req, res) => {
    const { lastname, firstname, age, gender, medecinLastname, medecinFirstname, Adress ,Phone } = req.body;
  
    try {
        // Find the doctor using lastname and firstname
        const medecin = await UserModel.findOne({
            lastname: medecinLastname,
            firstname: medecinFirstname,
        });
  
        if (!medecin) {
            return res.status(404).json({ error: 'Medecin not found' });
        }
  
        const data = new PatientModel({
            lastname,
            firstname,
            age,
            gender,
            Adress,
            Phone,
            medecinID: medecin._id,
            medecinLastname,
            medecinFirstname,
        });
  
        const val = await data.save();
  
        // Update the associated medecin's patients array with the new patient's details
        await UserModel.findOneAndUpdate(
            { _id: medecin._id },
            { 
                $push: { 
                    patients: {
                        patientID: data._id,
                        lastname,
                        firstname,
                    },
                },
            },
            { new: true }
        );
  
        res.json(val);
        console.log('Patient added');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
  });

// delete patient
patientRouter.delete('/:id', async(req,res)=>{
    const patientId = req.params.id;

    try {
        const deletedpatient = await PatientModel.findByIdAndDelete(patientId);

        if (!deletedpatient) {
            return res.status(404).json({ error: 'patient not found' });
        }

        console.log('patient deleted:', deletedpatient);
        res.json({ message: 'patient deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
})

//search about patient
import express from "express";
import { PatientModel } from "../models/patients.js";
import { UserModel } from "../models/medecins.js";
import { authenticateToken } from "../middlewares/auth.js";
import dotenv from "dotenv";
export const patientRouter=express.Router()
dotenv.config();
  //update patient
  // Update a patient by ID
  patientRouter.put('/:id',authenticateToken, async (req, res) => {
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
  
  
  

  //get one patient by id
  patientRouter.get('/:id',authenticateToken, async (req, res) => {
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

  //get all the patients
  patientRouter.get('/',authenticateToken, async (req, res) => {
    try {
      const patients = await PatientModel.find();
      res.json(patients);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });


// ajouter patient
patientRouter.post('/', authenticateToken, async (req, res) => {
  const { lastname, firstname, age, gender, Adress, Phone } = req.body;
  
  const medecinID = req.user.userId; 

  try {
      const medecin = await UserModel.findById(medecinID);

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
      });

      const val = await data.save();
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
patientRouter.delete('/:id',authenticateToken, async(req,res)=>{
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
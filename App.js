import mongoose from 'mongoose';
import express from 'express';
import { UserModel } from './schema.js';
import { PatientModel } from './schema.js';

const app = express();
app.use(express.json()); // Add this line to parse JSON requests

mongoose.connect('mongodb://localhost/medecinTCX', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.send('home page');
});
//get all the medecin
app.get('/medecins', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
//get one medecin by id

app.get('/medecins/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Medecin not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.post('/medecins', async (req, res) => {
  console.log('add medecin');
  const data = new UserModel({
    username: req.body.username,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    password: req.body.password,
    phonenumber: req.body.phonenumber,
    specialite: req.body.specialite,
    patienID: req.body.patienID,
});


  try {
    const val = await data.save();
    res.json(val); 
    console.log(' medecin added');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// ajouter patient
app.post('/patients', async (req, res) => {
  const { name, age, role, medecinLastname, medecinFirstname } = req.body;

  try {
      // Find the medecin using lastname and firstname
      const medecin = await UserModel.findOne({
          lastname: medecinLastname,
          firstname: medecinFirstname,
      });

      if (!medecin) {
          return res.status(404).json({ error: 'Medecin not found' });
      }

      const data = new PatientModel({
          name,
          age,
          role,
          medecinID: medecin._id,
          medecinLastname,
          medecinFirstname,
      });

      const val = await data.save();

      // Update the associated medecin's patients array with the new patient's name
      await UserModel.findOneAndUpdate(
          { _id: medecin._id },
          { $push: { patients: data._id } },
          { new: true }
      );

      res.json(val);
      console.log('Patient added');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
  }
});

//update medecin 'put'
app.put('/medecins/:id', async (req, res) => {
  const medecinId = req.params.id;
  const { username, lastname, firstname, password, phonenumber, specialite, patienID } = req.body;

  try {
      const medecin = await UserModel.findByIdAndUpdate(
          medecinId,
          { username, lastname, firstname, password, phonenumber, specialite, patienID },
          { new: true }
      );

      if (!medecin) {
          return res.status(404).json({ error: 'Medecin not found' });
      }

      res.json(medecin);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
  }
});

//update patient
// Update a patient by ID
app.put('/patients/:id', async (req, res) => {
  const patientId = req.params.id;
  const { name, age, role } = req.body;

  try {
    const patient = await PatientModel.findByIdAndUpdate(
      patientId,
      { name, age, role },
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
app.get('/patients', async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
//get one patient by id
app.get('/patients/:id', async (req, res) => {
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

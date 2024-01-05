import mongoose from 'mongoose';
import express from 'express';
import { doctorRouter } from './routes/doctors.routes.js';
import { patientRouter } from './routes/patients.routes.js';


const app = express();
app.use(express.json())
app.use('/medecins', doctorRouter); 
app.use('/patients', patientRouter );

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


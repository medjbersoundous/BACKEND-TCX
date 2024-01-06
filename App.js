import mongoose from 'mongoose';
import express from 'express';
import { doctorRouter } from './routes/doctors.routes.js';
import { patientRouter } from './routes/patients.routes.js';
import { appointmentsRouter } from './routes/appointment.routes.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors()); // for dev 
app.use(express.json())
app.use('/medecins', doctorRouter); 
app.use('/patients', patientRouter );
app.use('/appointment', appointmentsRouter);

const port=process.env.PORT

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log('Server is running');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.send('home page');
});

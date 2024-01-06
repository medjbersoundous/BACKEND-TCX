import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/medecins.js";
import dotenv from "dotenv";
import { authenticateToken } from "../middlewares/auth.js";
dotenv.config();

export const doctorRouter = express.Router();


//get all the medecin
doctorRouter.get('/', authenticateToken, async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  //get one medecin by id
  
  doctorRouter.get('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
  
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
  

// sign up medecin - creation 
const registrationSchema = Joi.object({
  username: Joi.string().required(),
  lastname:Joi.string().required(),
  firstname:Joi.string().required(),
  gender:Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phonenumber: Joi.string()
    .pattern(/^(05|06|07)\d{8}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.SECRETE_KEY, { expiresIn: "1h" });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.SECRETE_KEY, {
    expiresIn: "7d",
  });
}

doctorRouter.post("/register", async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new UserModel({
      lastname:req.body.lastname,
      firstname:req.body.firstname,
      username: req.body.username,
      email: req.body.email,
      gender:req.body.gender,
      password: hashedPassword,
      phonenumber: req.body.phonenumber,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

doctorRouter.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

doctorRouter.post("/refresh-token",authenticateToken, async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY);
    const userId = decoded.userId;

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

//////end partie akram


//update medecin 'put'
doctorRouter.put('/:id', authenticateToken, async (req, res) => {
    const medecinId = req.params.id;
    const { username, lastname, firstname, password, gender, email, phonenumber, patienID } = req.body;
  
    try {
        const medecin = await UserModel.findByIdAndUpdate(
            medecinId,
            { username, lastname, gender, email, firstname, password, phonenumber, patienID },
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

  // supprimer doctor
  doctorRouter.delete('/:id',authenticateToken, async (req, res) => {
    const medecinId = req.params.id;

    try {
        const deletedMedecin = await UserModel.findByIdAndDelete(medecinId);

        if (!deletedMedecin) {
            return res.status(404).json({ error: 'Medecin not found' });
        }

        console.log('Doctor deleted:', deletedMedecin);
        res.json({ message: 'Medecin deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});
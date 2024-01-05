import mongoose from "mongoose";
import express from "express";
import {UserModel} from './schema.js'
const app = express()
mongoose.connect('mongodb://localhost:27017/dev')

app.get('/', (req,res)=>{
    res.send('home page')
})
app.get('/medecin', (res,res)=>{
   res.json( UserModel.find())
    
})
app.listen(3000, ()=>{
    console.log('server is running')
})
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    age:Number
})

 export const UserModel = mongoose.model("medecins", UserSchema)


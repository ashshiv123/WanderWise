// src/models/user.model.js (CORRECT and FINAL version)
import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pathSchema } from "./pathhistory.model.js"; // <-- 1. IMPORT the schema blueprint

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
        },
        isontour:{
            type:Boolean,
            default:false,
        },
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        // This is optional for the user, but if present, must be a valid Point
        currentLocation: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        },
        //  2. USE the imported schema to structure the array
        //  Now, every item pushed into this array MUST look like a pathSchema object.
        pathhistory: [pathSchema],

        credits:{
            type:Number,
            default:0,
        }
    },
    {
        timestamps:true,
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next(); // If password is not modified, skip hashing
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to save
})

userSchema.methods.ispasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// 3. ADD Geospatial Indexes for fast queries
userSchema.index({ currentLocation: '2dsphere' });
userSchema.index({ 'pathhistory.path': '2dsphere' }); // Note the quotes for the nested field

export const User = mongoose.model("User", userSchema);
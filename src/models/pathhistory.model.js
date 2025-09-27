// src/models/pathhistory.model.js (CORRECT way)
import mongoose, {Schema} from "mongoose";

// Define the blueprint for a path
export const pathSchema = new Schema({
    path: {
        type: {
            type: String,
            enum: ['LineString'], // Each path is a LineString
            required: true
        },
        coordinates: {
            type: [[Number]], // An array of coordinate pairs [lng, lat]
            required: true
        }
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false }); // Optional: Prevents Mongoose from creating an _id for each sub-document

// We DO NOT create a model here. We only export the schema itself.
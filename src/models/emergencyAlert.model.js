// src/models/emergencyAlert.model.js
import mongoose, { Schema } from "mongoose";

const emergencyAlertSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // A reference to the user who triggered the alert
        required: true,
        index: true
    },
    // A snapshot of the user's location at the time of the emergency
    location: {
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
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved', 'false_alarm'],
        default: 'active',
        index: true
    },
    // Optional fields for tracking the response
    acknowledgedBy: {
        type: Schema.Types.ObjectId, // Ref to an Admin user
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

emergencyAlertSchema.index({ location: '2dsphere' });

export const EmergencyAlert = mongoose.model("EmergencyAlert", emergencyAlertSchema);
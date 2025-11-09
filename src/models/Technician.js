const mongoose = require('mongoose');
const User = require('./User');
const bcrypt = require('bcryptjs');


const technicianSchema = new mongoose.Schema({
    degree: { type: String, default: "none" },
    experience: { type: String, default: "none" },
    about: { type: String, required: "true" },
    availability: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },  // admin approves technicians
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }],
}, { timestamps: true });


const Technician = User.discriminator('technician', technicianSchema);

module.exports = Technician;
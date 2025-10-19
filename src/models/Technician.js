    const mongoose = require('mongoose');
    const User = require('./User');
    const bcrypt = require('bcryptjs');


    const technicianSchema = new mongoose.Schema({
        speciality: { type: String, required: true },
        degree: { type: String, default: "none" },
        experience: { type: String, default: "none" },
        about: { type: String, required: "true" },
        availability: { type: Boolean, default: true },
        fees: { type: Number, required: "true" },
        address: { type: Object, required: "true" },
        isApproved: { type: Boolean, default: false },  // admin approves technicians

    }, { timestamps: true });


    const Technician=User.discriminator('technician',technicianSchema);

    module.exports=Technician;
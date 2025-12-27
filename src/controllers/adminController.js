const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// get all users
async function allUsers(req, res) {
  try {
    const users = await User.find({role:{$in: ["customer","admin"]}}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

async function allTechnicians(req,res){
  try{
    const technicians=await User.find({role:"technician"}).select('-password').sort({createdAt:-1});
    res.json(technicians);
  }
  catch(err){
    res.status(500).json({message:'Server error'});
  }
}

// approve technician
async function approveTech(req, res) {
  try {
    const { id } = req.params;
    const tech = await User.findById(id);
    if (!tech || tech.role !== 'technician') return res.status(404).json({ message: 'Technician not found' });

    tech.isApproved = true;
    await tech.save();
    res.json({ message: 'Approved', technician: tech });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// delete a user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const u = await User.findByIdAndDelete(id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// view all bookings
async function allBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate('technicianId', 'name email skills')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

async function addService(req,res){
  try{
    const service = await Service.create(req.body);
    res.status(201).json({
      success:true,
      message:"Service created successfully",
      data:service,
    });
  }
  catch(error){
    res.status(400).json({success:false,error:error.message});
  }
}

module.exports = { allUsers,allTechnicians, approveTech, deleteUser, allBookings,addService };

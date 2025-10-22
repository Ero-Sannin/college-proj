const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// list available technicians (approved + availability true)
async function listTechnicians(req, res) {
  try {
    const techs = await User.find({ role: 'technician', isApproved: true }).select('-password');
    res.json(techs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// book a technician
async function bookTech(req, res) {
  try {
    const { technicianId, serviceId, date, note } = req.body;
    if (!technicianId || !date) return res.status(400).json({ message: 'technicianId and date required' });

    const tech = await User.findById(technicianId);
    if (!tech || tech.role !== 'technician' || !tech.isApproved) {
      return res.status(400).json({ message: 'Technician not available' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }
    const existing = await Booking.findOne({ technicianId, date });
    if (existing) {
      return res.status(400).json({ message: 'Technician already booked for this date' });
    }


    const booking = new Booking({
      customerId: req.user._id,
      technicianId,
      serviceId,
      date,
      note: note || ''
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// get customer's bookings
async function myBookings(req, res) {
  try {
    const bookings = (await Booking.find({ customerId: req.user._id }).populate('technicianId', 'name phone skills').populate('serviceId')).sort({date:-1});
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.image = req.file.path; // Cloudinary URL
    await user.save();

    res.json({ message: 'Profile picture updated successfully', image: user.image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { listTechnicians, bookTech, myBookings,updateProfilePic };

const User = require('../models/User');
const Booking = require('../models/Booking');

// list available technicians (approved + availability true)
async function listTechnicians(req, res) {
  try {
    const techs = await User.find({ role: 'technician', isApproved: true}).select('-password');
    res.json(techs); 
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// book a technician
async function bookTech(req, res) {
  try {
    const { technicianId, date, note } = req.body;
    if (!technicianId || !date) return res.status(400).json({ message: 'technicianId and date required' });

    const tech = await User.findById(technicianId);
    if (!tech || tech.role !== 'technician' || !tech.isApproved) {
      return res.status(400).json({ message: 'Technician not available' });
    }

    const booking = new Booking({
      customerId: req.user._id,
      technicianId,
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
    const bookings = await Booking.find({ customerId: req.user._id }).populate('technicianId', 'name phone skills');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listTechnicians, bookTech, myBookings };

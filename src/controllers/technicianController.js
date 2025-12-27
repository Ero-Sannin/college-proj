const Booking = require('../models/Booking');
const User = require('../models/User');

// set availability
async function setAvailability(req, res) {
  try {
    const { availability } = req.body;
    if (typeof availability !== 'boolean') return res.status(400).json({ message: 'availability boolean required' });

    const updated = await User.findByIdAndUpdate(req.user._id, { availability }, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// assigned bookings
async function assignedBookings(req, res) {
  try {
    const bookings = await Booking.find({ technicianId: req.user._id }).populate('customerId', 'name phone');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

// update booking status
async function updateStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const allowed = ['pending','accepted','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.technicianId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

const updateProfilePicTechnician = async (req, res) => {
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
module.exports = { setAvailability, assignedBookings, updateStatus,updateProfilePicTechnician };

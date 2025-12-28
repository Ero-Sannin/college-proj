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
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate({
        path: "technicianId",
        select: "-password",   // 👈 only this line matters
      })
      .populate('serviceId')
      .sort({ date: -1 });
    res.json(bookings);
    console.log(bookings);
  } catch (err) {
    console.error('Error in myBookings:', err);
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

// Get logged-in user's profile
const getMyProfile = async (req, res) => {
  try {
    // Assuming you have middleware that sets req.user.id from the JWT
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

async function getTechnicianById(req, res) {
  try {
    const { techId } = req.params;

    // Find technician by ID, exclude password, and populate related services
    const technician = await User.findOne({ _id: techId, role: "technician" })
      .select('-password')
      .populate('services'); // optional — remove if not needed

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json(technician);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
   }
}


module.exports = { listTechnicians, bookTech, myBookings, updateProfilePic, getMyProfile, getTechnicianById,cancelBooking};

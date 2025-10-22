const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { setAvailability, assignedBookings, updateStatus, updateProfilePicTechnician } = require('../controllers/technicianController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect, authorize('technician'));

router.patch('/availability', setAvailability);
router.get('/bookings', assignedBookings);
router.patch('/bookings/:bookingId/status', updateStatus);
router.patch('/profile-pic',upload.single('image'),updateProfilePicTechnician);

module.exports = router;

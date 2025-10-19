const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { setAvailability, assignedBookings, updateStatus } = require('../controllers/technicianController');

const router = express.Router();

router.use(protect, authorize('technician'));

router.patch('/availability', setAvailability);
router.get('/bookings', assignedBookings);
router.patch('/bookings/:bookingId/status', updateStatus);

module.exports = router;

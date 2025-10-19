const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { listTechnicians, bookTech, myBookings } = require('../controllers/customerController');

const router = express.Router();

router.use(protect, authorize('customer'));

router.get('/technicians', listTechnicians);
router.post('/book', bookTech);
router.get('/bookings', myBookings);

module.exports = router;

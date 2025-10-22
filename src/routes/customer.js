const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { listTechnicians, bookTech, myBookings, updateProfilePic } = require('../controllers/customerController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect, authorize('customer'));

router.get('/technicians', listTechnicians);
router.post('/book', bookTech);
router.get('/bookings', myBookings);
router.patch('/profile-pic',upload.single('image'),updateProfilePic);

module.exports = router;

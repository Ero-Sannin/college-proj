const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { listTechnicians, bookTech, myBookings, updateProfilePic, getMyProfile, getTechnicianById,cancelBooking} = require('../controllers/customerController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/technicians', listTechnicians);
router.get('/technicians/:techId',getTechnicianById);
router.use(protect);
router.get('/profile',getMyProfile);
router.use(authorize('customer'));



router.post('/book', bookTech);
router.get('/bookings', myBookings);
router.patch('/profile-pic',upload.single('image'),updateProfilePic);
router.put('/bookings/:bookingId/cancel', cancelBooking);
module.exports = router;

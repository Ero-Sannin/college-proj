const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { listTechnicians, bookTech, myBookings, updateProfilePic, getMyProfile, getTechnicianById } = require('../controllers/customerController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/technicians', listTechnicians);
router.get('/technicians/:id',getTechnicianById);
router.use(protect, authorize('customer'));

router.get('/profile',getMyProfile);

router.post('/book', bookTech);
router.get('/bookings', myBookings);
router.patch('/profile-pic',upload.single('image'),updateProfilePic);

module.exports = router;

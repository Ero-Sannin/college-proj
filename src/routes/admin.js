const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { allUsers, approveTech, deleteUser, allBookings, allTechnicians, addService } = require('../controllers/adminController');
const { updateProfilePic } = require('../controllers/customerController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();


router.use(protect, authorize('admin'));

router.get('/users', allUsers);
router.get('/technicians',allTechnicians);
router.post('/addService',addService);
router.patch('/technicians/:id/approve', approveTech);
router.delete('/users/:id', deleteUser);
router.get('/bookings', allBookings);
router.patch('/profile-pic',upload.single('image'),updateProfilePic);

module.exports = router;

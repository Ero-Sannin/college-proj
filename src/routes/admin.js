const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { allUsers, approveTech, deleteUser, allBookings, allTechnicians } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', allUsers);
router.get('/technicians',allTechnicians);
router.patch('/technicians/:id/approve', approveTech);
router.delete('/users/:id', deleteUser);
router.get('/bookings', allBookings);

module.exports = router;

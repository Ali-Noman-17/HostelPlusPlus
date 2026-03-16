const express = require('express');
const router = express.Router();
const ownerController = require('../ctrls/ownerctrl');
const { authenticate, authorize } = require('../midware/auth');
const { checkHostelOwnership } = require('../midware/ownership');

router.use(authenticate);
router.use(authorize('owner'));

router.get('/dashboard', ownerController.getOwnerDashboard);

router.get('/hostels', ownerController.getMyHostels);
router.post('/hostels', ownerController.createHostel);
router.put('/hostels/:id', authenticate, authorize('owner'), checkHostelOwnership, ownerController.updateHostel);

router.get('/hostels/:id/rooms', authenticate, authorize('owner'), checkHostelOwnership, ownerController.getHostelRooms);
router.post('/hostels/:id/rooms', authenticate, authorize('owner'), checkHostelOwnership, ownerController.addRoom);
router.put('/rooms/:id', ownerController.updateRoom);
router.delete('/rooms/:id', ownerController.deleteRoom);

router.get('/hostels/:id/bookings', authenticate, authorize('owner'), checkHostelOwnership, ownerController.getHostelBookings);

module.exports = router;
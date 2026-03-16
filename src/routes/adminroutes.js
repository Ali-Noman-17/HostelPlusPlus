const express = require('express');
const router = express.Router();
const adminController = require('../ctrls/adminctrl');
const { authenticate, authorize } = require('../midware/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.changeUserRole);
router.put('/users/:id/verify', adminController.verifyUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/hostels', adminController.getAllHostels);
router.get('/hostels/pending', adminController.getPendingHostels);
router.put('/hostels/:id/verify', adminController.verifyHostel);

router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDashboard, getAllUsers, blockUser, deleteUser,
  getAllListings, toggleListing
} = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);
router.get('/listings', getAllListings);
router.put('/listings/:id/toggle', toggleListing);

module.exports = router;

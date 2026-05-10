const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const {
  updateProfile, uploadAvatar, uploadPhotos,
  getUsers, getUserById, saveProfile, getSavedProfiles
} = require('../controllers/userController');

router.use(protect);
router.put('/profile', updateProfile);
router.post('/avatar', (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, uploadAvatar);
router.post('/photos', (req, res, next) => {
  upload.array('photos', 5)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, uploadPhotos);
router.get('/', getUsers);
router.get('/saved', getSavedProfiles);
router.get('/:id', getUserById);
router.post('/:id/save', saveProfile);

module.exports = router;

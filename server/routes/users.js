const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const {
  updateProfile, uploadAvatar, uploadPhotos,
  getUsers, getUserById, saveProfile, getSavedProfiles
} = require('../controllers/userController');

router.use(protect);
router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/photos', upload.array('photos', 5), uploadPhotos);
router.get('/', getUsers);
router.get('/saved', getSavedProfiles);
router.get('/:id', getUserById);
router.post('/:id/save', saveProfile);

module.exports = router;

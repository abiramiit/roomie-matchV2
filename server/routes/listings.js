const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const {
  createListing, getListings, getListingById,
  updateListing, deleteListing, getMyListings
} = require('../controllers/listingController');

router.use(protect);
router.get('/', getListings);
router.get('/my', getMyListings);
router.get('/:id', getListingById);
router.post('/', (req, res, next) => {
  upload.array('photos', 8)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

module.exports = router;

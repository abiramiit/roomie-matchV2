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
router.post('/', upload.array('photos', 8), createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

module.exports = router;

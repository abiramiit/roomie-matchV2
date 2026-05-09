const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getMatches, likeUser, dislikeUser, getMyMatches,
  getNotifications, markNotificationsRead
} = require('../controllers/matchController');

router.use(protect);
router.get('/', getMatches);
router.get('/my', getMyMatches);
router.get('/notifications', getNotifications);
router.put('/notifications/read', markNotificationsRead);
router.post('/like/:id', likeUser);
router.post('/dislike/:id', dislikeUser);

module.exports = router;

const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');

router.use(protect);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/:userId', sendMessage);

module.exports = router;

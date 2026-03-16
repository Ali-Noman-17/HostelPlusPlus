const express = require('express');
const router = express.Router();
const reviewController = require('../ctrls/reviewctrl');
const { authenticate } = require('../midware/auth');
const { checkReviewOwnership } = require('../midware/ownership');

router.get('/hostel/:id', reviewController.getHostelReviews);

router.post('/', authenticate, reviewController.createReview);
router.put('/:id', authenticate, checkReviewOwnership, reviewController.updateReview);
router.delete('/:id', authenticate, checkReviewOwnership, reviewController.deleteReview);
router.get('/user/me', authenticate, reviewController.getMyReviews);
router.post('/:id/helpful', authenticate, reviewController.markHelpful); 

module.exports = router;
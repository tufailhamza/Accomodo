const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../Utils/WrapAsync');
const ExpressError = require('../Utils/ExpressError');
const ReviewController = require('../Controllers/reviews')
const validateReview = require('../middleware')
const Checkauthentication = require('../middleware');

router.post('/',Checkauthentication,validateReview,catchAsync(ReviewController.PostingRevies))
router.delete('/:reid',Checkauthentication,catchAsync(ReviewController.DestroyReviews))
module.exports = router;
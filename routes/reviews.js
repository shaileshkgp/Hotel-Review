const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../Models/campground');
const Review = require('../Models/review')

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');




router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a review');
    res.redirect(`/hotels/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/hotels/${id}`);

}))

module.exports = router;
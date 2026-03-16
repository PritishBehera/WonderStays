const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewControllers = require("../controllers/review.js");


//review post route
router.post("/",isLoggedIn,validateReview,reviewControllers.createReview);

//review delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports = router;
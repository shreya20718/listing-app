const express = require('express');
const router = express.Router({ mergeParams: true });
//const wrapAync=require("../util/wrapAsync.js");
const ErrorExpress=require("../util/errorexpress.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const listing=require("../models/listing.js");

//review post route
router.post("/",async(req,res)=>{
  let foundlisting=await listing.findById(req.params.id);
let newReview=new Review(req.body.review);

foundlisting.reviews.push(newReview);

await newReview.save();
await foundlisting.save();
res.redirect(`/listings/${foundlisting._id}`);

});

//delete review route
router.delete(" /:reviewId",async(req,res)=>{
  let{ id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

module.exports = router;
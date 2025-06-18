const Review = require("../models/review.js");
const listing=require("../models/listing.js");

module.exports.create = async (req, res) => {
     let foundlisting=await listing.findById(req.params.id);
let newReview=new Review(req.body.review);
newReview.author = req.user._id; // Set the author to the current user
foundlisting.reviews.push(newReview);

await newReview.save();
await foundlisting.save();
   req.flash('success', 'New Listing Review successfully!');
res.redirect(`/listings/${foundlisting._id}`);

}

module.exports.delete = async (req, res) => {
     let{ id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
     req.flash('success', ' Review Deleted successfully!');
  res.redirect(`/listings/${id}`);
}
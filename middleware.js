const listing = require('./models/listing');
const Review = require('./models/review');

module.exports.loggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
   req.session.redirectUrl = req.originalUrl; // Store the original URL
    req.flash('error', 'You must be logged in to create a listing.');
     return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirect = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Save the redirect URL to locals
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    const {id}=req.params;
    let loti=await listing.findById(id);
if(!loti.owner._id.equals(req.user._id)) {
  req.flash('error', 'You are not the owner of this listing.');
  return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.isAuthor=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    let roti=await Review.findById(reviewId);
if(!roti.author.equals(res.locals.currentUser._id)) {
  req.flash('error', 'You are not the author of this review.');
  return res.redirect(`/listings/${id}`);
}
next();
};





if(process.env.NODE_ENV !== 'production') {
  
  require('dotenv').config();
}

const urldb=process.env.ATLASDB_NAME;


const{storage} = require('./cloudconfig.js');
const express=require("express");
const app=express();
app.set("view engine","ejs");
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const path=require('path');
const Review = require("./models/review.js");
const passport = require('passport');
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session = require('express-session');
const MongoStore=require("connect-mongo")
 const flash = require('connect-flash');
 const localStrategy = require('passport-local');
 const User = require('./models/user.js'); // Assuming you have a User model
const userRouter= require("./route/user.js");
const { loggedIn, saveRedirect ,isOwner, isAuthor} = require("./middleware.js"); // Assuming you have a middleware file
const multer = require('multer'); 
const upload = multer({storage }); 
 //const wrapAync=require("./util/wrapAsync.js");
 const { listingSchema ,reviewSchema} = require("./schema.js");
 //const ErrorExpress=require("./util/errorexpress.js");
 const listingcontroller=require("./controller/listing");
  const reviewcontroller=require("./controller/review");
  const usercontroller=require("./controller/user");


app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const { date } = require("joi");
const { MongoBulkWriteError } = require('mongodb');

main().then(()=>{
    console.log("connected to mongo");
})
.catch(err => console.log(err));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));


async function main() {
  
  await mongoose.connect(urldb)

}

 const store=MongoStore.create({
  mongoUrl: urldb,
  crypto: {
secret: process.env.SECRET,
  },
  touchAfter:24*3600,
  }
)

store.on("error",()=>{
  console.log("error",err);
})

const sessionOption={
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000, 
    maxAge: 7*24*60*60*1000 ,
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  }
}




app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
res.locals.currentUser = req.user; // Make currentUser available in all views
if(req.session.redirectUrl) {
  res.locals.redirectUrl = req.session.redirectUrl; // Store redirectUrl in locals
  delete req.session.redirectUrl;
}
  next();
});


//app.use("/",userRouter);

//const newlisting = require("./route/list.js");

//const reviews = require("./route/review.js");

app.get("/signup",usercontroller.signup); 

app.post("/signup", usercontroller.signupPost);

app.get("/login", (usercontroller.login));

app.post("/login",saveRedirect, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), 
usercontroller.loginPost);


app.get("/logout", usercontroller.logout);
//index route
app.get("/listings",(listingcontroller.index));

//new route
app.get("/listings/new",loggedIn,(listingcontroller.new))
  

//show route
 app.get("/listings/:id",(listingcontroller.show));

  //create route
app.post(
  "/listings", loggedIn, upload.single("listing[image]"), listingcontroller.create);


//edit route
app.get("/listings/:id/edit",loggedIn,isOwner,(listingcontroller.edit));


//update route
app.put("/listings/:id",loggedIn,isOwner,upload.single("listing[image]"),(listingcontroller.update));

//delete route
app.delete("/listings/:id",isOwner,loggedIn,(listingcontroller.delete));

//review post route
app.post("/listings/:id/review",loggedIn,(reviewcontroller.create));
 

//delete review route
app.delete("/listings/:id/review/:reviewId",loggedIn,isAuthor,(reviewcontroller.delete));

 



//app.use("/listing",newlisting);

//app.use("/listings/:id/review",reviews);

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong" } = err;
//   res.render("error.ejs", { statusCode, message });
// });



app.get("/listings/category/:category", async (req, res) => {
  const { category } = req.params;
  const alllisting = await listing.find({ category });
  res.render("listings/index.ejs", { alllisting, category });
});


app.get("/search", async (req, res) => {
  const { location } = req.query;
  console.log("Searched country or location :",location);
  const alllisting = await listing.find({ location });
   res.render("listings/index.ejs", { alllisting, category: `Search: ${location}` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
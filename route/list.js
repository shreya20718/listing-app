const express = require('express');
const router = express.Router();
const wrapAync=require("../util/wrapAsync.js");
const { listingSchema ,reviewSchema} = require("../schema.js");
const ErrorExpress=require("../util/errorexpress.js");
const listing=require("../models/listing.js");



//index route
router.get("/",wrapAync(async (req,res)=>{
 const alllisting= await listing.find({});
 res.render("listings/index.ejs",{alllisting});
  }));

//new route
router.get("/new",wrapAync(async (req,res)=>{
    res.render("listings/new.ejs");
  }));

//show route
  router.get("/:id",wrapAync(async(req,res)=>{
    const {id}=req.params;
    const newlisting=await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listing: newlisting});
  }));

  //create route
router.post("/",wrapAync(async(req,res)=>{
 let result=listingSchema.validate(req.body);
 console.log(result);
const alllisting= new listing(req.body.listing);

await alllisting.save();

res.redirect("/listing");
}));


//edit route
router.get("/:id/edit",wrapAync(async(req,res)=>{
   const {id}=req.params;
    const newlisting=await listing.findById(id);
  res.render("listings/edit.ejs",{ listing: newlisting});
}));

//update route
router.put("/:id",wrapAync(async(req,res)=>{
  const {id}=req.params;
 await listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listing/${id}`);
}));

//delete route
router.delete("/:id",wrapAync(async(req,res)=>{
  const {id}=req.params;
  let deletedlisting =  await listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listing");
}));

module.exports = router;
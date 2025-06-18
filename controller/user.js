 const User = require('../models/user.js'); 

module.exports.signup=  (req, res) => {
res.render("users/signup");
}

module.exports.signupPost = async (req, res) => {
    try{
let{ username, email, password } = req.body;
  const newUser =new User({ username, email });
  const registerUser=await User.register(newUser, password);
  console.log(registerUser);
  req.login(registerUser, (err) => {
    if (err) {
     return next(err);
    }
req.flash('success', 'User registered successfully!');
res.redirect("/listings");
  }); }
  catch (e){
  req.flash('error', e.message);
  res.redirect("/signup");
  }
}

module.exports.login = (req, res) => {
   res.render("users/login.ejs");
}

module.exports.loginPost=async (req, res) => {

  res.redirect(res.locals.redirectUrl || "/listings");
}


module.exports.logout = (req, res) => {
  req.logout((err)=>{
    if(err) {
       return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect("/listings");
  });
}
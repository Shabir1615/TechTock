loadLogin = (req,res)=>{
    res.render("login")
}


const User = require("../../model/userModel")
// const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Category = require("../../model/categoryModel");
const Address = require("../../model/addressModel");
const { use } = require("../../router/user_route");


function validateLogin(data) {
    const {email, password} = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    


    // email validation //
    if (!email) {
        errors.emailError = "please enter your email address";
    } else if (email.length < 1 || email.trim() === "" || !emailPattern.test(email)) {
        errors.emailError = "please Enter a Valid email";
    }
    // Password Validation //
  
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}
var profilename
    const verifyLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(req.body);
          
            const valid = validateLogin(req.body);
            console.log(valid);
          
            const userData = await User.findOne({ email: email });
            console.log(userData);
          
          
            if (!userData) {
              return res.status(401).json({ error: "Invalid Email address" });
            } else if (!valid.isValid) {
              return res.status(400).json({ error: valid.errors });
            } else if (userData.isBlocked === true) {
              return res.status(402).json({ error: "Your Account is blocked" });
            } else {
              const passwordMatch = await bcrypt.compare(password, userData.password);
          
              if (passwordMatch) {
                console.log("Verified password");
                req.session.user = userData;
                req.session.logged = true;
                return res.status(200).end();
              } else {
                return res.status(409).json({ error: "Invalid Password" });
              }
            }
          
          
        } catch (error) {
            console.log(error.message);
        }
    };


//user logout
const doLogout = async (req, res) => {
  try {
    req.session.destroy()
      
      res.redirect("/login");
  } catch (error) {
      console.log(error.message);
  }
};

//my profile/////////////////////////////////


const dashboard =async (req,res)=>{
  console.log(8698);
try {
    const userData = req.session.user;
    const userId = userData._id
    console.log(92,userData);
    const categoryData = await Category.find({ is_blocked: false });
    const addressData = await Address.find({userId : userId})
    res.render("dashboard",{categoryData , message:"true",userData, addressData})
} catch (error) {
  console.log(error);
}
}





module.exports= {
  verifyLogin,
  loadLogin,
  doLogout,
  dashboard
}
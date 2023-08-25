const productData = require("../../model/productModel");
const Category = require("../../model/categoryModel");
const Address = require("../../model/addressModel");
const User = require("../../model/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const homePage = async (req, res) => {
  // console.log(req.session.user);

  const categoryData = await Category.find();
  if (req.session.user) {
    res.render("home", { message: "true", categoryData });
  } else {
    res.render("home", { message: "false", categoryData });
  }
};

async function validation(data) {
  const { name, email, address, mobile, city, state, pincode } = data;
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  const pincodeRegex = /^\d{6}$/;
  const cityRegex = /^[a-zA-Z]{2,50}$/;
  const stateRegex = /^[a-zA-Z]{2,50}$/;
  const addressRegex = /^[a-zA-Z0-9\s,.\-]{5,100}$/;

  if (!name) {
    errors.nameError = "please eneter the name";
  }

  if (!email) {
    errors.emailError = "please enter the email";
  } else if (!emailRegex.test(email)) {
    errors.emailRegex = "please provide valid email";
  }

  if (!mobile) {
    errors.phoneError = "Please provide a Phone number";
  } else if (!phoneRegex.test(mobile)) {
    errors.phoneError = "Invalid Phone Number";
  }

  if (!pincode) {
    errors.pincodeError = "Please provide a Pincode";
  } else if (!pincodeRegex.test(pincode)) {
    errors.pincodeError = "Invalid Pin number";
  }

  if (!cityRegex) {
    errors.cityError = "Please provide  your city name";
  } else if (!cityRegex.test(city)) {
    errors.cityError = "Error";
  }

  if (!address) {
    errors.addressError = "Please provide a Address";
  } else if (!addressRegex.test(address)) {
    errors.addressError = "Invalid Address";
  }

  if (!state) {
    errors.stateError = "Please provide your state name";
  } else if (!stateRegex.test(state)) {
    errors.stateError = "Invalid ";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}






const addNewAddress = async (req, res) => {
  try {
    const userData = req.session.user;
    const userId = userData._id;

    const { name, email, address, mobile, city, state, pincode } = req.body;

    const data = {
      userId,
      name,
      email,
      address,
      mobile,
      city,
      state,
      pincode,
      is_default: false,
    };

    const valid = await validation(req.body);

    if (valid.isValid) {
      const address = new Address(data);
      await address.save();
      return res.status(200).end();
    } else if (!valid.isValid) {
      return res.status(400).json({ error: valid.errors });
    }
  } catch (error) {
    console.log(error);
  }
};




   

    function generateOTP() {
        let otp = "";
        for (let i = 0; i < 4; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }





    const securePassword = async (password) => {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
      } catch (error) {
        console.log(error.message);
        throw error; // Rethrow the error to be handled in the calling function if needed.
      }
    };

    

//forgot password////////////////////////////////

let forgotPasswordOtp;

const loadForgotPassword = async (req, res) => {
  try {
      const categoryData = await Category.find({ is_blocked: false });
  
      if (req.session.forgotEmailNotExist) {
         
          res.render("verifyEmail", {categoryData, emailNotExist: "Sorry, email does not exist! Please register now!" ,loggedIn:false,walletBalance,subTotal:0,cart:{}});
          req.session.forgotEmailNotExist = false;
      } else {
          res.render("verifyEmail",{loggedIn:false,categoryData,subTotal:0,cart:{},message:"false"});
      }
  } catch (error) {
      console.log(error.message);
  }
};

const verifyForgotEmail = async (req, res) => {
  try {
      const verifyEmail = req.body.email;
      const ExistingEmail = await User.findOne({ email: verifyEmail });

      if (ExistingEmail) {
          if (!forgotPasswordOtp) {
              forgotPasswordOtp = generateOTP();
              console.log(forgotPasswordOtp);
              email = verifyEmail;
              sendForgotPasswordOtp(email, forgotPasswordOtp);
              res.redirect("/forgotOtpEnter");
              setTimeout(() => {
                  forgotPasswordOtp = null;
              }, 60 * 1000);
          } else {
              res.redirect("/forgotOtpEnter");
          }
      } else {
          req.session.forgotEmailNotExist = true;
          res.redirect("/forgotPassword");
      }
  } catch (error) {
      console.log(error.message);
  }
};

async function sendForgotPasswordOtp(email, otp) {
  try {
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: "shabirjaan.shafi@gmail.com",
              pass: "efhzfchvjqstvmkb",
          },
      });

      const mailOptions = {
          from: "shabirjaan.shafi@gmail.com",
          to: email,
          subject: "Your OTP for password resetting",
          text: `Your OTP is ${otp}. Please enter this code to reset your password.`,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(result);
  } catch (error) {
      console.log(error.message);
  }
}

const resendForgotOtp = async (req, res) => {
  try {
      const generatedOtp = generateOTP();
      forgotPasswordOtp = generatedOtp;

      sendForgotPasswordOtp(email, generatedOtp);
      res.redirect("/forgotOtpEnter");
      setTimeout(() => {
          forgotPasswordOtp = null;
      }, 60 * 1000);
  } catch (error) {
      console.log(error.message);
  }
};

const showForgotOtp = async (req, res) => {
  try {
      const categoryData = await Category.find({ is_blocked: false });

      if (req.session.wrongOtp) {
          res.render("forgotOtpEnter", { invalidOtp: "Otp does not match" ,loggedIn:false,categoryData,subTotal:0,cart:{},message:"false"});
          req.session.wrongOtp = false;
      } else {
          res.render("forgotOtpEnter", { countdown: true ,loggedIn:false, invalidOtp:"" ,categoryData,subTotal:0,cart:{},message:"false"});
      }
  } catch (error) {
      console.log(error.message);
  }
};

const verifyForgotOtp = async (req, res) => {
  try {
      const categoryData = await Category.find({ is_blocked: false });
      var txt1=req.body.txt1;
      var txt2 =req.body.txt2
      var txt3=req.body.txt3
      var txt4=req.body.txt4
      const userEnteredOtp=txt1+txt2+txt3+txt4
   
      if (userEnteredOtp === forgotPasswordOtp) {
          res.render("passwordReset",{loggedIn:false,invalidOtp:"",categoryData,subTotal:0,cart:{},message:"false"});
      } else {
          req.session.wrongOtp = true;
          res.redirect("/forgotOtpEnter");
      }
  } catch (error) {
      console.log(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
      const categoryData = await Category.find({ is_blocked: false });
      const newPassword = req.body.password;
      const securedPassword = await securePassword(newPassword);

      const userData = await User.findOneAndUpdate({ email: email }, { $set: { password: securedPassword } });
      if (userData) {
          req.session.passwordUpdated = true;
          res.render("login",{blocked:false,loggedIn:false,categoryData,subTotal:0,cart:{}});
      } else {
          console.log("Something error happened");
      }
  } catch (error) {
      console.log(error.message);
  }
};







module.exports = { homePage, addNewAddress, loadForgotPassword, updatePassword, verifyForgotOtp, showForgotOtp,
  resendForgotOtp, verifyForgotEmail };

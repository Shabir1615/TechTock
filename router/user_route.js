const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController/user_controller.js");
const loginController = require("../controller/userController/login_controller.js");
const signUpController = require("../controller/userController/signUp_controller.js");
const otpController = require("../controller/userController/otp_controller.js")
const productController = require("../controller/userController/productController.js")
const auth = require("../middleWare/userAuth.js")
const { isLogout, isLogin, isCheckout, blockCheck } = auth


//home//////////////////////////////////////
userRouter.get("/", blockCheck, userController.homePage);




//login///////////////////////////////////
userRouter.get("/login", isLogout,blockCheck, loginController.loadLogin)
userRouter.post("/login",loginController.verifyLogin)
userRouter.get('/logout',  loginController.doLogout)








//signUp///////////////////////////////
userRouter.post("/signUpPost",signUpController.verifySignUp)

 
//otp///////////////////////////////////////////
userRouter.get("/otp", isLogout, otpController.otpGet)
userRouter.post("/otpEnter", isLogout, otpController.otpVerify)


//category/////////////////////////
userRouter.get("/products", productController.loadProducts)




module.exports = userRouter
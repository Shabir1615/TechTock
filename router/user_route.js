const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController/user_controller.js");
const loginController = require("../controller/userController/login_controller.js");
const signUpController = require("../controller/userController/signUp_controller.js");
const otpController = require("../controller/userController/otp_controller.js")
const productController = require("../controller/userController/productController.js")
const cartController  = require("../controller/userController/cartController.js")
const orderController = require("../controller/userController/orderController.js")
const auth = require("../middleWare/userAuth.js")
const { isLogout, isLogin, isCheckout, blockCheck } = auth


//home//////////////////////////////////////
userRouter.get("/", blockCheck, userController.homePage);




//login///////////////////////////////////
userRouter.get("/login", isLogout,blockCheck, loginController.loadLogin)
userRouter.post("/login",loginController.verifyLogin)
userRouter.get('/logout',  loginController.doLogout)
userRouter.get('/dashboard',isLogin,  loginController.dashboard)







//signUp///////////////////////////////
userRouter.post("/signUpPost",signUpController.verifySignUp)

 
//otp///////////////////////////////////////////
userRouter.get("/otp", isLogout, otpController.otpGet)
userRouter.post("/otpEnter", isLogout, otpController.otpVerify)


//category/////////////////////////
userRouter.get("/products", productController.loadProducts)
userRouter.get("/allProducts", productController.loadAllProducts)


//full view

userRouter.get("/fullView", productController.productView)



//cart
userRouter.get('/cart', isLogin, blockCheck, cartController.loadCart)
userRouter.get('/addToCart',cartController.addToCart)
userRouter.post('/cartUpdation',cartController.updateCart)
userRouter.get('/removeCart',cartController.removeCart)
userRouter.get('/checkStock', cartController.checkStock)
userRouter.get('/checkout', isLogin, blockCheck, cartController.loadCheckout)
userRouter.post('/validateCoupon', cartController.validateCoupon)
userRouter.get('/updateQuantity',cartController.updateQuantity)






//chechout //////////////////////

userRouter.get("/orderSuccess", orderController.orderSuccess)
userRouter.post("/placeOrder", orderController.placeOrder)
userRouter.get("/myOrder", orderController.myOrders)
userRouter.get("/orderdetails", orderController.orderDetails)
userRouter.get("/orderFilter", orderController.filterOrder);
userRouter.post("/updateOrder", orderController.updateOrder);



//forgot
userRouter.get('/forgotPassword',isLogout,userController.loadForgotPassword)
userRouter.post('/verifyEmail',isLogout,userController.verifyForgotEmail)
userRouter.get('/forgotOtpEnter',isLogout,userController.showForgotOtp)
userRouter.post('/verifyForgotOtp',isLogout,userController.verifyForgotOtp)
userRouter.get('/resendForgotPasswordotp', isLogout ,userController.resendForgotOtp)
userRouter.post('/newPassword',isLogout, userController.updatePassword)





userRouter.post('/addNewAddress',userController.addNewAddress)

module.exports = userRouter
const adminController = require("../controller/adminController/adminController");
const productController = require("../controller/adminController/productController")
const adminDashboard = require('../controller/adminController/adminDashboard')
const express = require("express");
const admin_route=express()
admin_route.set("views", "./Views/admin");
const store = require("../middleWare/multer");
const adminAuth= require("../middleWare/adminAuth");
const orderController = require("../controller/adminController/orderController")










//login////////////////////////////////////////

admin_route.get('/' ,adminController.loadLogin)
admin_route.post('/login',adminController.verifyLogin)
admin_route.get('/logout',adminController.adminLogout)


//admin dash//////////////////
admin_route.get("/admindash",adminDashboard.loadDashboard);

//user management///////////////////////////////////
admin_route.get("/users",adminController.loadUsers)
admin_route.get("/blockUser/:id", adminController.blockUser);


//category management//////////////////////////
admin_route.get("/categories", adminAuth.isLogin, adminController.loadCategories)
admin_route.get('/addCategory', adminAuth.isLogin,  adminController.addCategory)
admin_route.post('/addCategory', adminAuth.isLogin,  store.single('image') , adminController.addNewCategory)
admin_route.get('/editCategory/:id', adminAuth.isLogin,  adminController.editCategory)
admin_route.post('/updateCategory/:id', adminAuth.isLogin,  store.single('image') , adminController.updateCategory)
admin_route.get('/unlistCategory/:id', adminAuth.isLogin,  adminController.unlistCategory)



//product management////////////////////////////

admin_route.get("/products", adminAuth.isLogin, productController.viewProducts)
admin_route.get('/addProduct', adminAuth.isLogin, productController.addProduct)
admin_route.post('/addProducts', adminAuth.isLogin, store.array('image', 4), productController.addProductPost)
admin_route.get('/updateProduct/:id', store.array('image', 4) , adminAuth.isLogin, productController.updateProduct)
admin_route.post('/update_product_post/:id', store.array('image', 5) , adminAuth.isLogin, productController.updateProductPost)
admin_route.get('/deleteProduct/:id', adminAuth.isLogin, productController.deleteProduct)



//order managemnet /////////////////////////////
admin_route.get("/orders",orderController.loadOrders)
admin_route.get('/orderDetails', orderController.orderDetails)
admin_route.post('/updateOrder', orderController.updateOrder)



//couponsss//////////////////////////////

admin_route.get('/coupons', adminAuth.isLogin, adminController.loadCoupons)
admin_route.get('/loadAddCoupon', adminAuth.isLogin, adminController.loadAddCoupon)
admin_route.post('/addCoupon', adminController.addCoupon)
admin_route.post('/blockCoupon', adminController.blockCoupon)
admin_route.post('/deleteCoupon', adminController.deleteCoupon)



//graphsssss

admin_route.get("/admindash",adminDashboard.loadDashboard);
admin_route.get('/chartData', adminDashboard.chartData)
admin_route.get('/getSales', adminDashboard.getSales)
admin_route.post('/downloadSalesReport', adminDashboard.downloadSalesReport)
admin_route.get('/renderSalesReport', adminDashboard.renderSalesReport)




module.exports = admin_route
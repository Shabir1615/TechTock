// const Product = require("../../model/productModel");
// const Category = require("../../model/categoryModel");
const Order = require("../../model/orderModel")
const moment = require("moment");
const Addres = require("../../model/addressModel")






const loadOrders = async (req, res) => {
    try {
        const ordersPerPage = 7;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * ordersPerPage;

        const orders = await Order.find().sort({ date: -1 }).skip(skip).limit(ordersPerPage);
        
        const totalCount = await Order.countDocuments();
        const totalPages = Math.ceil(totalCount / ordersPerPage);

        const orderData = orders.map((order) => {
            const formattedDate = moment(order.date).format("MMMM D YYYY");

            return {
                ...order.toObject(),
                date: formattedDate,
            };
        });

         res.render("orders", {
            user: req.session.admin,
            orderData,
            currentPage: page,
            totalPages,
            productUpdated:""
        });
    } catch (error) {
        console.log(error.message);
    }
};



const updateOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        const status = req.body.status;
        console.log(orderId, status);


        if (status === "Delivered") {

            const returnEndDate = new Date()
            returnEndDate.setDate(returnEndDate.getDate() + 7)

            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status, 
                    deliveredDate: new Date(), 
                    returnEndDate: returnEndDate,                    
                },
                $unset: { ExpectedDeliveryDate: "" }
            }, 
                { new: true });
        }else if (status === "Cancelled") {

            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status,                   
                },
                $unset: { ExpectedDeliveryDate: "" }
            }, 
                { new: true });
        }
        
        
        else {
            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status } }, 
                { new: true });
        }

        res.json({
            messaage: "Success",
        });
    } catch (error) {
        console.log(error.message);
    }
};


const orderDetails = async (req, res) => {
    try {
        const orderId = req.query.orderId;

        const orderDetails = await Order.findById(orderId);
        const orderProductData = orderDetails.product;
        const addressId = orderDetails.address;

        const addressData = await Addres.findById(addressId);

        res.render("adminOrderDetails", {
            orderDetails,
            orderProductData,
            addressData,
            user: req.session.admin 
        });
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    loadOrders,
    updateOrder,
    orderDetails
}
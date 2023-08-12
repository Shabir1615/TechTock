const productData = require("../../model/productModel")
const Category = require("../../model/categoryModel")


const homePage = async (req,res)=>{
    // console.log(req.session.user);


    const categoryData = await Category.find();
    if(req.session.user){
    res.render("home",{message: "true",categoryData})}
    else{
        res.render("home",{message: "false",categoryData})}
    }




   
module.exports = {homePage
}

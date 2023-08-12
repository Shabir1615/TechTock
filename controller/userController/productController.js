const Product = require("../../model/productModel")
const Category = require("../../model/categoryModel");





const loadProducts = async (req, res) => {
    const categoryData = await Category.find({ is_blocked: false });
    

    try {
        const page = parseInt(req.query.page) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;

       

       

        const id = req.query.id;
        let productData;
        let totalCount

        
            const isCategory = await Category.exists({ _id: id });

            if (isCategory) {
                productData = await Product.find({ category: id })
                    .skip((page - 1) * productsPerPage)
                    .limit(productsPerPage);
                
                totalCount = await Product.countDocuments({ category: id });
            } else {
                productData = await Product.find({ subCategory: id })
                    .skip((page - 1) * productsPerPage)
                    .limit(productsPerPage);

                totalCount = await Product.countDocuments({ subCategory: id });
            }
        

        
        const totalPages = Math.ceil(totalCount / productsPerPage);

        const userData = req.session.user;
          var val=(userData)?true:false
        if (userData){
            walletBalance=userData.wallet.balance
        }
        res.render("products", {
            id,
            productData,
            categoryData,
            userData,
           message:"true",
            
            currentPage: page,
            totalPages,
           
        });
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData, categoryData });
    }
};










module.exports = {  
    loadProducts
    
  };
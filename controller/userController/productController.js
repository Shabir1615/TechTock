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
        console.log(id);
        
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
        console.log(productData);
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


const loadAllProducts = async(req,res)=>{
    const categoryData = await Category.find({ is_blocked: false });
    try {
        
        const page = parseInt(req.query.allProductsPage) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;

        let productData;

        const search = req.query.search;

        if (search) {
            productData = await Product.find({
                name: { $regex: ".*" + search + ".*", $options: "i" },
            })
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
        } else {
            productData = await Product.find()
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
        }

        const totalCount = search
            ? await Product.countDocuments({ name: { $regex: ".*" + search + ".*", $options: "i" } })
            : await Product.countDocuments();

        const totalPages = Math.ceil(totalCount / productsPerPage);
        console.log(req.session.user);
        if (req.session.user) {
            const userData = req.session.user;
            
            res.render("allProducts", {
                loggedIn:true,
                currentPage: page,
                totalPages,
                categoryData,
                message:"true"
                
                
            });
        } else {
            res.render("allProducts", {
                loggedIn:false,
                productData,
                currentPage: page,
                totalPages,
                categoryData,
                message:"true"
              
                
            });
        }
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData, categoryData ,loggedIn:false,walletBalance});
    }
};




const productView = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;
        let relatedProducts;
         const id = req.query.id;
        const isCategory = await Category.exists({ _id: id });

        var obj=`"${id}"`
            // Get the product id from the query string
            
            var id_curr = `ObjectId(${obj})`;
          
            // Get the category name from the product
            var categoryName = await Product.findOne({id: id_curr}, {category: 1});
          
            // Get all the products from MongoDB which are related to the category
             relatedProducts = await Product.find({category: categoryName});
          
            // Return the related products
          
    

        
        const productId = req.query.id;
       
       
        const productData = await Product.findById(productId);
        console.log(productData);
        
        const categoryData = await Category.find({ is_blocked: false });
        
        
       
           
        
         

                if (!productData) {
                    res.render("404");
                } else res.render("fullView", { productData, categoryData, loggedIn:true,message:"true" });
           
        
        
    } catch (error) {
        
        console.log(error.message);
        const userData = req.session.user;
        var val=(userData)?true:false
        const categoryData = await Category.find({ is_blocked: false });
        
        res.render("404", {  categoryData , });
    }
};











module.exports = {  
    loadProducts,
    loadAllProducts,
    productView
    
  };
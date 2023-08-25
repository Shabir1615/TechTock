const productData = require("../../model/productModel");
const categoryData = require("../../model/categoryModel");

const cloudinary = require("../../config/cloudinary");
require("dotenv").config();

const addProduct = async (req, res) => {
  try {
    const data = await categoryData.find();

    res.render("add_product", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addProductPost = async (req, res) => {
  try {
    console.log(29);
    const { name, price, quantity, category, description } = req.body;
    const image = req.files;
    let productImages = [];

    for (const file of image) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Products",
      });

      const image = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      productImages.push(image);
    }

    const exist = await productData.findOne({ name });
    if (exist) {
      res.render("add_product", { message: "The product already exists" });
    } else {
      const product = new productData({
        name,
        price,
        description,
        category,
        imageUrl: productImages,
        stock: quantity,
      });

      const productResult = await product.save();
      console.log(`productDetails ${productResult}`);
      console.log("******Data stored in the database******");

      return res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(`addProduct${error}`);
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  console.log(`..........  ${productId}`);
  try {
    const product = await productData.findById(productId);
    const categories = await categoryData.find();
    console.log("111111111111111");
    console.log(categoryData);
    // console.log(`.......... product ${product}`);

    if (!product) {
      return res.render("update_product", {
        message: "Product not found",
        categoryData,
        product,
      });
    }

    res.render("update_product", { product, categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProductPost = async (req, res) => {
  // console.log("hiiiiiii");
  const { product_name, product_details, category, quantity, price } = req.body;
  const id = req.params.id;

  try {
    const product = await productData.findById(id);

    if (!product) {
      return res.render("update_product", { message: "Product not found" });
    }

    product.name = product_name;
    product.product_details = product_details;
    product.category = category;
    product.stock = quantity;
    product.price = price;

    await product.save();

    res.redirect("/admin/products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteId = req.params.id;
    await productData.findByIdAndDelete(deleteId);

    res.redirect("/admin/products");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const viewProducts = async (req, res) => {
  console.log(118);
  try {
    const data = await productData.find().populate("category");
    console.log(data);

    res.render("view_products", { data, totalPages: null, productUpdated: [] });
  } catch (error) {
    console.error(`viewProduct${error}`);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addProduct,
  addProductPost,
  updateProduct,
  updateProductPost,
  deleteProduct,
  viewProducts,
};

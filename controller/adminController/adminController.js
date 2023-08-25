const User = require("../../model/userModel");
const Category = require("../../model/categoryModel");
const Product = require("../../model/productModel");
const cloudinary = require("../../config/cloudinary");
const Coupon = require("../../model/couponModel")
const credentials = {
  email: "admin@gmail.com",
  password: "admin",
};

const moment = require("moment")

const loadLogin = async (req, res) => {
  // res.render('login')
  try {
    if (req.session.wrongAdmin) {
      res.render("login", { invalid: "invalid details" });
      req.session.wrongAdmin = false;
    } else {
      res.render("login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};
var email;
const verifyLogin = async (req, res) => {
  try {
    console.log(req.body.email);
    if (
      req.body.email == credentials.email &&
      req.body.password == credentials.password
    ) {
      req.session.admin = req.body.email;
      email = req.body.email;

      res.redirect("/admin/admindash");
    } else {
      req.session.wrongAdmin = true;
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.messaage);
  }
};



//user load
const loadUsers = async (req, res) => {
  try {
    const userData = await User.find();
    res.render("users", { users: userData, user: req.session.admin });
  } catch (error) {
    console.log(error.message);
  }
};
//user block

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;

    const blockUser = await User.findById(id);

    await User.findByIdAndUpdate(
      id,
      { $set: { isBlocked: !blockUser.isBlocked } },
      { new: true }
    );

    return res.status(200).end();
  } catch (error) {
    console.log(error);
  }
};

////////////////////CATEGORIES/////////////////////////////

const loadCategories = async (req, res) => {
  try {
    const categoryData = await Category.find();
    if (req.session.categoryUpdate) {
      res.render("categories", {
        categoryData,
        catNoUpdation: "",
        catUpdated: "Category updated successfully",
        user: req.session.admin,
      });
      req.session.categoryUpdate = false;
    } else if (req.session.categorySave) {
      res.render("categories", {
        categoryData,
        catNoUpdation: "",
        catUpdated: "Category Added successfully",
        user: req.session.admin,
      });
      req.session.categorySave = false;
    } else if (req.session.categoryExist) {
      res.render("categories", {
        categoryData,
        catUpdated: "",
        catNoUpdation: "Category Already Exists!!",
        user: req.session.admin,
      });
      req.session.categoryExist = false;
    } else {
      res.render("categories", {
        categoryData,
        user: req.session.admin,
        catUpdated: "",
        catNoUpdation: "",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addCategory = async (req, res) => {
  try {
    res.render("addCategory", { user: req.session.admin });
  } catch (error) {
    console.log(error.message);
  }
};

const addNewCategory = async (req, res) => {
  const categoryName = req.body.name;
  const categoryDescription = req.body.categoryDescription;
  const image = req.file;
  const lowerCategoryName = categoryName.toLowerCase();

  try {
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "Categories",
    });

    const categoryExist = await Category.findOne({
      category: lowerCategoryName,
    });
    if (!categoryExist) {
      const category = new Category({
        category: lowerCategoryName,
        imageUrl: {
          public_id: result.public_id,
          url: result.secure_url,
        },
        description: categoryDescription,
      });

      await category.save();
      req.session.categorySave = true;
      res.redirect("/admin/categories");
    } else {
      req.session.categoryExist = true;
      res.redirect("/admin/categories");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoryData = await Category.findById({ _id: categoryId });

    return res.render("editCategory", {
      categoryData,
      user: req.session.admin,
      catUpdated: "",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryName = req.body.name;
    const categoryDescription = req.body.categoryDescription;
    const newImage = req.file;

    const categoryData = await Category.findById(categoryId);
    const categoryImageUrl = categoryData.imageUrl.url;

    let result;

    if (newImage) {
      if (categoryImageUrl) {
        await cloudinary.uploader.destroy(categoryData.imageUrl.public_id);
      }
      result = await cloudinary.uploader.upload(newImage.path, {
        folder: "Categories",
      });
    } else {
      result = {
        public_id: categoryData.imageUrl.public_id,
        secure_url: categoryImageUrl,
      };
    }

    const catExist = await Category.findOne({ category: categoryName });
    const imageExist = await Category.findOne({
      "imageUrl.url": result.secure_url,
    });

    if (!catExist || !imageExist) {
      await Category.findByIdAndUpdate(
        categoryId,
        {
          category: categoryName,
          imageUrl: {
            public_id: result.public_id,
            url: result.secure_url,
          },
          description: categoryDescription,
        },
        { new: true }
      );
      req.session.categoryUpdate = true;
      res.redirect("/admin/categories");
    } else {
      req.session.categoryExist = true;
      res.redirect("/admin/categories");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const unlistCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const unlistCategory = await Category.findById(categoryId);
    console.log(unlistCategory, "unlistCategory");
    await Category.findByIdAndUpdate(
      categoryId,
      { $set: { is_blocked: !unlistCategory.is_blocked } },
      { new: true }
    );

    res.status(200).redirect("/admin/categories");
  } catch (error) {
    console.log(error.message);
  }
};






//couponsss////////////////////

const loadCoupons = async (req, res) => {

  try {

      const coupon = await Coupon.find();
   
      const couponData = coupon.map((element) => {
          const formattedDate = moment(element.expiryDate).format("MMMM D, YYYY");

          return {
              ...element,
              expiryDate: formattedDate,
          };
      });

  res.render("coupons", { couponData, user: req.session.admin  });
  } catch (error) {
      console.log(error.messaage);
  }
};

const loadAddCoupon = async (req, res) => {
  try {
      res.render("addCoupon", { user: req.session.admin });
  } catch (error) {
      console.log(error.messaage);
  }
};

const addCoupon = async (req, res) => {
  try {
      const { couponCode, couponDiscount, couponDate, minDiscount, maxDiscount } = req.body;

      const couponCodeUpperCase = couponCode.toUpperCase();

      const couponExist = await Coupon.findOne({ code: couponCodeUpperCase });

      if (!couponExist) {
          const coupon = new Coupon({
              code: couponCodeUpperCase,
              discount: couponDiscount,
              expiryDate: couponDate,
              minDiscount: minDiscount,
              maxDiscount: maxDiscount
          });

          await coupon.save();
          res.json({ message: "coupon addedd" });
      } else {
          res.json({ messaage: "coupon exists" });
      }
  } catch (error) {
      console.log(error.messaage);
  }
};

const blockCoupon = async (req, res) => {
  try {
      const couponId = req.query.couponId;

      const unlistCoupon = await Coupon.findById(couponId);

      await Coupon.findByIdAndUpdate(couponId, { $set: { status: !unlistCoupon.status } }, { new: true });

      res.json({ message: "success" });
  } catch (error) {
      console.log(error.message);
  }
};

const deleteCoupon = async (req, res) => {
  try {
      const couponId = req.query.couponId;

      await Coupon.findByIdAndDelete(couponId);

      res.json({ message: "success" });
  } catch (error) {
      console.log(error.message);
  }
};



module.exports = {
  loadLogin,
  adminLogout,
  verifyLogin,



  loadCategories,
  addCategory,
  addNewCategory,
  editCategory,
  updateCategory,
  unlistCategory,

  loadUsers,
  blockUser,

  deleteCoupon,
  blockCoupon,
  addCoupon ,
  loadAddCoupon,
  loadCoupons
};

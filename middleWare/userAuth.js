const User = require("../model/userModel");

const isLogin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isCheckout = async (req, res, next) => {
  try {
    if (!req.session.checkout) {
      return res.redirect("/myOrders");
    }
    next();
  } catch (error) {}
};

const blockCheck = async (req, res, next) => {
  try {
    if (req.session.user) {
      const userData = req.session.user;
      const id = userData._id;
      const user = await User.findById(id);

      if (user.isBlocked) {
        res.redirect("/logout");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
  blockCheck,
  isCheckout,
};

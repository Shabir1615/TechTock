const user = require("../../model/userModel.js");

//signUp validation

async function validation(data) {
  const { username, phone, email, password, confirmPassword } = data;
  console.log(data);
  console.log(username);
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  const existingUser = await user.findOne({ email: email });

  if (!email) {
    errors.emailError = "Please Enter an Email";
  } else if (!emailRegex.test(email)) {
    errors.emailError = "please provide a valid Email";
  } else if (existingUser && email == existingUser.email) {
    errors.emailError = "This email is already registered";
  }

  if (!username) {
    errors.nameError = "Please Enter a name";
  }

  if (!phone) {
    errors.phoneError = "Please provide a Phone number";
  } else if (!phoneRegex.test(phone)) {
    errors.phoneError = "Invalid Phone Number";
  }

  if (!password) {
    errors.passwordError = "Please provide a Password";
  } else if (password.length < 8) {
    errors.passwordError = "Password length should be at least 8";
  }

  if (password != confirmPassword && password.length > 0) {
    errors.confirmPasswordError = "The passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

const verifySignUp = async (req, res) => {
  try {
    console.log(22);
    const { username, email, phone, password } = req.body;
    const data = new user({
      username: username,
      email: email,
      phone: phone,
      password: password,
    });
    console.log(58, data);
    const valid = await validation(req.body);
    console.log(valid);
    if (valid.isValid) {
      //  await data.save();
      req.session.detail = data;
      return res.status(200).end();
    } else if (!valid.isValid) {
      return res.status(400).json({ error: valid.errors });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  verifySignUp,
};

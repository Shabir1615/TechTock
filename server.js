const express = require("express");
const session = require("express-session");
const uuid = require("uuid").v4;
const app = express();
const path = require("path");
const ejs = require("ejs");
const userRoute = require("./router/user_route");
const adminRoute = require("./router/admin_route");
const mongoDB = require("./config/connection.js");
require("dotenv").config();

app.use(
  session({
    secret: uuid(),
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views/user"),
  path.join(__dirname, "views/admin"),
  // path.join(__dirname,"views/partials"),
]);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "public/assets/js")));
app.use("/css", express.static(path.join(__dirname, "public/assets/css")));
// app.use(""

app.use("/", userRoute);
app.use("/admin", adminRoute);

mongoDB();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/`);
});

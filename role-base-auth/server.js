const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// dotenv package is used to secure the importance file  (config)
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// express middleware
app.use(express.json());
app.use(cookieParser());

// port
const PORT = process.env.PORT || 4000;

// routes middleware
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// api routes
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);

app.listen(PORT, (req, res) => {
  console.log(`server ${PORT}`);
});

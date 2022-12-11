const express = require("express");
const app = express();

// dotenv package is used to secure the importance file  (config)
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

app.use(express.json());

const PORT = process.env.PORT || 4000;

// hahaha add by lokendra
// sdsdsds;d,;FontFaceSetLoadEvent,dfdf,

// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);

app.listen(PORT, (req, res) => {
  console.log("server " + PORT);
});

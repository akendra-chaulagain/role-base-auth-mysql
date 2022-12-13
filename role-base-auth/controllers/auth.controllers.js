const db = require("../connection/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(500).json({ msg: "Enter all the data" });
  }
  //   validate  user from database
  const q = `SELECT * FROM users WHERE email = ?`;
  db.query(q, [req.body.email], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ msg: "Something went wrong , Please try again! " });
    if (data.length)
      return res.status(500).json({ msg: "Email already exists!" });
    // hash password
    const salt = bcrypt.genSaltSync(10);
    // now we set user password to hashed password
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const q =
      "INSERT INTO users (`username`,email,`password`,`role`) VALUE (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      roles.client,
    ];
    db.query(q, [values], (err, data) => {
      if (err)
        return res
          .status(500)
          .json({ msg: "Something went wrong , Please try again! " });

      return res.status(200).json({ msg: "User has been created" });
    });
  });
};

// login user

const loginUser = (req, res) => {
  if (!req.body.password || !req.body.email) {
    return res.status(500).json({ msg: "Please enter all data" });
  }

  const q = "SELECT * FROM users  WHERE email = ?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(500).json({ msg: "User not found" });

    const chechPassword = bcrypt.compare(req.body.password, data[0].password);
    if (!chechPassword) return res.status(400).json({ msg: "Invalid data !" });

    // const token = jwt.sign(
    //   { id: data[0].id, role: data[0].role },
    //   process.env.JWT_SECRET_KEY
    // );

    const accessToken = jwt.sign(
      { id: data[0].id, role: data[0].role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    const { password, ...others } = data[0];
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .json({ others });
  });
};



module.exports = { registerUser, loginUser };

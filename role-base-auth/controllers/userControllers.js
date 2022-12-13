const db = require("../connection/db");
const jwt = require("jsonwebtoken");

// dotenv package is used to secure the importance file  (config)
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.deleteUser = (req, res) => {
  // delete from super admin
  const q = "DELETE FROM users WHERE `id` = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ msg: "Something went wrong , Please try again! " });

    if (data.affectedRows > 0)
      return res.status(200).json({ msg: "User deleted! " });
  });

  //  delete from admin
};

// update user
exports.updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in !");
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid !");
    // const q = "UPDATE users SET `username`=?,`email`=? WHERE id = ?";
    const q = "UPDATE users SET `username`=?,`email`=? WHERE id=? ";
    // const
    const values = [req.body.username, req.body.email, userInfo.id];
    db.query(
      q,
      [req.body.username, req.body.email, userInfo.id],
      (err, data) => {
        if (err)
          return (
            res
              .status(500)
              // .json({ msg: "Something went wrong , Please try again! " });
              .json(err)
          );

        if (data.affectedRows > 0)
          return res.status(200).json({ msg: "User updated! " });
      }
    );

    //  delete from admin
  });
};

// get all users
exports.getAllUsers = (req, res) => {
  const q = "SELECT * FROM users ";
  //   console.log(req.body.postId);
  db.query(q, [], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ msg: "Something went wrong , Please try again! " });
    return res.status(200).json(data);
  });
};

// Add this to the top of the file
const { roles } = require("../utils/role");

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("You are not logged in !");
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid !");

      try {
        const permission = roles.can(userInfo.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

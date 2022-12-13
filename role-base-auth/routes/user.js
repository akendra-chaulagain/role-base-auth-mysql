const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

// router.delete("/:id", deleteUser);
router.delete(
  "/:userId",
  userController.grantAccess("deleteAny", "users"),
  userController.deleteUser
);


router.put(
  "/:userId",
//   userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "users"),
  userController.updateUser
);



// router.put("/:id", updateUser);
// router.get("/", getAllUsers);

module.exports = router;

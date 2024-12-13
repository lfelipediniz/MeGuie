const router = require("express").Router();

const upload = require("../config/multer");

const userController = require("../controllers/userController");

router.route("/users/register").post(upload.single("file"), (req, res) => userController.register(req, res));
router.route("/users/login").post((req, res) => userController.login(req, res));
router.route("/users").get((req, res) => userController.getAll(req, res));
router.route("/users/:id").get((req, res) => userController.get(req, res));
router.route("/users/:id").delete((req, res) => userController.delete(req, res));
router.route("/users/:id").put(upload.single("file"), (req, res) => userController.update(req, res));

module.exports = router;

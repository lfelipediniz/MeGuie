const router = require("express").Router()

const upload = require("../config/multer")

const postController = require("../controllers/postController.js")

router.route("/posts").post(upload.single("file"), (req, res) => postController.create(req, res));
router.route("/posts").get((req, res) => postController.getAll(req, res))
router.route("/posts/:id").get((req, res) => postController.get(req, res))
router.route("/posts/:id").delete((req, res) => postController.delete(req, res))
router.route("/posts/:id").put(upload.single("file"), (req, res) => postController.update(req, res))
router.route("/postsByUser/:userId").get((req, res) => postController.getPostsByUser(req, res))
router.route("/toggleLike/:id").put((req, res) => postController.toggleLike(req, res))

module.exports = router
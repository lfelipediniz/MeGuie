const router = require("express").Router()

const commentController = require("../controllers/commentController.js")

router.route("/comments").post((req, res) => commentController.create(req, res))
router.route("/comments").get((req, res) => commentController.getAll(req, res))
router.route("/comments/:id").get((req, res) => commentController.get(req, res))
router.route("/comments/:id").delete((req, res) => commentController.delete(req, res))
router.route("/comments/:id").put((req, res) => commentController.update(req, res))
router.route("/commentsByUser/:userId").get((req, res) => commentController.getCommentsByUser(req, res))
router.route("/commentsByPost/:postId").get((req, res) => commentController.getCommentsByPost(req, res))

module.exports = router
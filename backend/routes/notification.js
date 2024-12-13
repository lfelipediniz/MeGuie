const router = require("express").Router()

const notificationController = require("../controllers/notificationController.js")

router.route("/notification").post((req, res) => notificationController.create(req, res))
router.route("/notification/:userId").get((req, res) => notificationController.get(req, res))

module.exports = router
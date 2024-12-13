const router = require("express").Router()

const postRouter = require("./post")
const commentRouter = require("./comment")
const userRouter = require("./user")
const notificationRouter = require("./notification")

router.use("/", postRouter)
router.use("/", commentRouter)
router.use("/", userRouter)
router.use("/", notificationRouter)

module.exports = router
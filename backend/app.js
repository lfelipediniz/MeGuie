const express = require("express")
const cors = require("cors")
const path = require('path')
const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors())

app.use(express.json())

// DB Connection
const conn = require("./db/conn")

conn()

const routes = require("./routes/router")

app.use("/api", routes)

app.listen(3000, () => {
  console.log("Servidor online!")
})
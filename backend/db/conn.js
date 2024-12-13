const mongoose = require("mongoose")
require('dotenv').config()

async function main() {
  try {
    mongoose.set("strictQuery", true)
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dhq86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    console.log("Conectado ao banco!")
  } catch (error) {
    console.log(`Erro: ${error}`)
  }
}

module.exports = main
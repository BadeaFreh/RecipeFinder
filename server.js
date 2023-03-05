const express = require("express");
const app = express();
const path = require("path");
const api = require("./routes/recipesApi")
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "node_modules")))

const port = 3000
app.use("/", api)

app.listen(port, function () {
  console.log(`Running server on port ${port}`)
})
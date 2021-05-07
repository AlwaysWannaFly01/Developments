const guide = require("./guide");

module.exports = app => {
  app.use("/guide", guide)
}
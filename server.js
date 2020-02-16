let bodyParser = require("body-parser");
let mangoose = require("mongoose");
let logger = require("morgan");

let express = require("express");
let app = express();

app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(process.cwd() + "/public"));

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listenintg on PORT " + port);
});

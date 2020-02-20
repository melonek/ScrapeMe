let express = require("express");
let route = express.Router();
let path = require("path");

let request = require("request");
let cheerio = require("cheerio");

let Comment = require("../models/Comment.js");
let Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.redirect("/articles");
});

router.get("/scrape", function(req, res) {
  request("http://9news.com.au");
  let $ = cheerio.load(html);
  let titleArray = [];
});

$("story-block story-block--has-media").each(function(i, element) {
  let result = {};

  result.title = $(this)
    .children("a")
    .text();
  result.link = $(this)
    .children("a")
    .attr("href");

  if (result.title !== "" && result.link !== "") {
    if (titleArray.indexOf(result.title) == -1) {
      titlesArray.push(result.title);

      Article.count({title: result.title}, function (err, test){
          if (test === 0){
              let entry = new Article(result);
              entry.save(function(err, doc){
                  if (err){
                      console.log(err);
                  } else {
                      console.log(doc)
                  }
 }              })
          }
      })
    } else {
      console.log("Article already exists");
    }
  } else {
    console.log("Not saved to DB, missing data");
  }
});

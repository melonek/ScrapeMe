let express = require("express");
let router = express.Router();
let path = require("path");

let request = require("request");
let cheerio = require("cheerio");

let Comment = require("../models/Comment.js");
let Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.redirect("/articles");
});

router.get("/scrape", function(req, res) {
  request("https://www.9news.com.au/perth", function(error, response, html) {
    let $ = cheerio.load(html);
    let titlesArray = [];

    $(".story__headline").each(function(i, element) {
      let result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      if (result.title !== "" && result.link !== "") {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Article.count({ title: result.title }, function(err, test) {
            if (test === 0) {
              let entry = new Article(result);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log("Article already exists.");
        }
      } else {
        console.log("Not saved to DB, missing data");
      }
    });
    res.redirect("/");
  });
});
router.get("/articles", function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        let artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});

router.get("/articles-json", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get("/clearAll", function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all articles");
    }
  });
  res.redirect("/articles-json");
});

router.get("/readArticle/:id", async function(req, res) {
  let articleId = req.params.id;
  let hbsObj = {
    article: [],
    body: []
  };

  let foundArticle = await Article.findOne({ _id: articleId });
  let foundComments = await Comment.find({ articleId });
  hbsObj.article = {
    _id: foundArticle._id,
    title: foundArticle.title,
    comment: foundComments
  };
  let link = foundArticle.link;

  request(link, function(error, response, html) {
    let $ = cheerio.load(html);

    $(".article").each(function(i, element) {
      hbsObj.body = $(this)
        .children(".article__body")
        .text();

      res.render("article", hbsObj);
      return false;
    });
  });
});

router.post("/comment/:id", async function(req, res) {
  try {
    let newComment = new Comment({
      name: req.body.name,
      body: req.body.comment,
      articleId: req.params.id
    });
    await newComment.save();
    res.redirect("/readArticle/" + newComment.articleId);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;

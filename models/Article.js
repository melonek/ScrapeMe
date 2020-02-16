let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    ref: "Summary"
  },
  link: {
    type: String,
    required: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Articles;

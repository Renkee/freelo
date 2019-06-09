const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: String,
    text: String,
    patch: String,
    tags: Array,
    enabled: Boolean
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);

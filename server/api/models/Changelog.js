const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let changelogSchema = new Schema({
    subject: {
        type: {
            type: String
        },
        id: String
    },
    action: String,
    changed_element: {
        type: {
            type: String
        },
        extra: {
            id: String,
            title: String
        }
    },
}, {timestamps: true});

module.exports = mongoose.model("Changelog", changelogSchema);
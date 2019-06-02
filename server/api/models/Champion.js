const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let championSchema = new Schema({
	api_name: String,
	freelo: Boolean,
	roles: Array,
	power: Array,
	runes: Array,
	contents: Array
});

module.exports = mongoose.model("Champion", championSchema);

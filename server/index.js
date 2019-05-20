const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log("Connected to MongoDB database!");
	})
	.catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const champions = require("./champions");
app.use("/champions", champions);

// export the server middleware
module.exports = {
    path: '/api',
    handler: app
}
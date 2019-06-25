const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require('helmet')
const winston = require('winston')
const morgan = require('morgan')
const { combine, timestamp, colorize, printf } = winston.format;
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

app.use(helmet())

// Logging
winston.configure({
	format: combine(
		timestamp(),
		colorize(),
		printf(({ level, message, timestamp }) => {
			return `${timestamp || ''} ${level || ''}: ${message || ''}`;
		})
	),
	transports: [new winston.transports.Console()]
});

// cut off newline(\n) at end of morgan message
app.use(morgan('short', { stream: {write: message => winston.info(message.substring(0,message.length - 1))} }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(session({
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 1 * 60 * 60 // 1 hour
	}),
	cookie: {
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production'
	},
	resave: true,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	name: 'sesid'
}))
if(process.env.NODE_ENV !== 'production') {
	app.use(cors());
} else {
	app.use(csrf())
}


// Routes
const auth = require("./api/auth");
const champions = require("./api/champions");
const posts = require("./api/posts");
const changelog = require("./api/changelog");

app.use("/api/auth", auth);
app.use("/api/champions", champions);
app.use("/api/posts", posts);
app.use("/api/changelog", changelog);

// export the server middleware
module.exports = {
    path: '/',
    handler: app
}
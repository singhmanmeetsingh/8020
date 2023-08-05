
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

// express configration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5500);

// // Middleware to parse form datas
// app.use(bodyParser.urlencoded({ extended: false }));

// path for all the css imports
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

console.log("ÜRI", process.env.MONGODB_URI)
/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});


// controllers
const indexController = require("./controllers/index");

//routes
app.get("/", indexController.index);


app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
  console.log('Press CTRL-C to stop');
});

module.exports = app;

const { check } = require('express-validator');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port', process.env.PORT || 5500);
// SESSION START
app.use(
  session({
    key: 'user_sid',
    secret: 'qwerty@1234',
    resave:false,
    saveUninitialized: false,
    // cookie:{
    //   expires:500000,
    // },

  })
)

// SESSION END

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
const indexController = require("./controllers");
const userController = require("./controllers/user");
const dashboardController = require("./controllers/dashboard")

// // middleware
// app.use((req, res, next) => {
//   if(req.session.user && req.cookies.user_sid){
//     // redirect to home page
//   }
//   next()
// })

//routes
app.get("/", indexController.index);

app.get('/login', userController.getLogin); 
app.post('/login', [
  check('email', 'Your email is not valid').not().isEmpty(),
  check('password').not().isEmpty()
], userController.postLogin);

app.post('/logout', userController.logout)

app.get('/dashboard', dashboardController.index)

app.post('/dashboard/add',[
  check('title').not().isEmpty(),
  check('content').not().isEmpty()
]
,dashboardController.addPage)

app.post('/dashboard/delete', dashboardController.deletePage)

app.get('/:pageName', indexController.dyn)


app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
  console.log('Press CTRL-C to stop');
});

module.exports = app;
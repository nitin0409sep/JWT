// Express
const express = require('express');

// DB Connection
require('./db/conn');

// App
const app = express();

// Path 
const path = require('path');

// Routes
const Routes = require('./routes/authRoutes');

// Cookie Parser  -- Middleware to parse cookie data
const cookieParser = require('cookie-parser');

// Middle Ware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Custom Middleware For Auth
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


// cookieParser Middleware
app.use(cookieParser());

// HBS
const hbs = require('hbs');

// Static Files Path
const static_path = path.join(__dirname, "../public");

// Static Files Middleware
app.use('/public', express.static(static_path));

// Views Path
const viewsPath = path.join(__dirname, '../temp/views')

// Partials Path
const partialsPath = path.join(__dirname, '../temp/partials')

// If Condition In HandelBars 
hbs.registerHelper('ifCond', function (user, options) {
  if (user) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


// View Engine
app.set('view engine', 'hbs');

// Views 
app.set("views", viewsPath);

// Partials
hbs.registerPartials(partialsPath);

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(Routes);


/*

// cookies
app.get('/set-cookies', (req, res) => {

  // Method 1
  // res.setHeader('Set-Cookie', 'newUser = true');

  // Method 2
  res.cookie('newUser', false);   // Cookies passed as key : value pair
  res.cookie('userEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });  // 1 day  

  // httpOnly = Cant be accessed from console
  // secure = save only if it follows https

  res.send("Cookie Setuped");
})


app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
})

*/


// Server
app.listen("80", () => {
  console.log("Server has started successfull");
})
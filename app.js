const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;


//passport config
require('./config/passport')(passport);


//setting up server interface
const mongoose = require('mongoose');
require('dotenv/config')

mongoose.connect(process.env.DB_connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
} ,()=>{
    console.log('Connected to the Database !!')
})

//set template Engine EJS using middleware (USE)
app.use(expressLayouts);
app.set('view engine', 'ejs');


//Bodyparser
app.use(express.urlencoded({extended: false}))


//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //ppassport 
  
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());


//Global variables for the flash messages 
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
})



//set routes for pages 
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, 
    console.log(`Server Running on Port ${PORT}`));
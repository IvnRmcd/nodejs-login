const express = require('express');
const router = express.Router();
const user = require('../models/User');
const bcrypt = require('bcryptjs');

const UserModel = require("../models/User");

router.get('/login', (req, res) =>{res.render('login')});
 

router.get('/register', (req, res) =>{ res.render('register')});


//Register Handle
router.post('/register', (req, res) => {
//destructuring
const {name, email, password, password2} = req.body
let errors = [];

//check required fields -- Look into middleware validation methods
if (!name || !email || !password || !password2) {
    errors.push({msg: "Please fill out all fields"})
}

//check passwords match
if (password !== password2) {
    errors.push({msg: "Passwords do not match"})
}


//check Password Length
if (password < 6) {
    errors.push({msg: "Password length should be at least 6 characters"})
}

if (errors.length > 0) {
    res.render('register', {
        errors, 
        name,
        email,
        password,
        password2
    })
}else{
    UserModel.findOne({email:email}).then(user => {
        if (user) {
            errors.push({msg: "Email Address already exists"})
            res.render('register', {
                errors, 
                name,
                password,
                password2
            })
        }else{
            const newUser = new UserModel({
                name,
                email,
                password,
            });
           //hash the password
           bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) =>{
                   if (err) throw err;
                   newUser.password = hash;

                   newUser.save()
                   .then(user => {
                       req.flash('success_msg', 'You are not Registered and can log in');
                       res.redirect('/users/login');
                   })
                   .catch(err => console.log(err))
               })
           })
           
        }
    }).catch(error => console.log(error))

}

})

//check passwords

//check password length

module.exports = router;
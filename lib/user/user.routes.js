'use strict';

const passport = require('passport');
const express = require('express');
const router = express.Router();

const User = require('./user.model');

require('./user.local');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

// router.post('/login',
//   passport.authenticate('local',
//     {
//       failureRedirect: '/login',
//       successRedirect: '/home'
//     }
//   )
// );

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info,
      });
      // res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      } else {
        router.get('/home', (req, res) => {
          res.render('home')
        })
      }
      // res.status(200).json({
      //   status: 'Login successful!'
      // });
    });
  })(req, res, next);
});

// session.regenerate() is a express session method
// router.get, .post, .delete is common REST practice
// uses delete method override and regenerates the session id on req
router.delete('/login', (req, res) => {
  req.session.regenerate(function(err) {
    if(err) throw err;
    res.redirect('/');
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

// If the passwords do NOT match, redirect to login and send message
// If the passwords DO match, use the User model schema and mongo findOne()
// to look for the req.body.email. If the email exists, redirect to login.
// If the the req.body.email does NOT exist, create the user and redirect to login.
router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
          if (err) throw err;

          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

// router.get('/home', (req, res, next) => {
//   res.render('home')
// })


module.exports = router;

'use strict';
const path = require('path')
const express = require('express');
const chalk = require('chalk');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();

const PORT = process.env.PORT || 3000;

const routes = require('./lib/user/user.routes.js');

const SESSION_SECRET = process.env.SESSION_SECRET || 'logansecrets';


app.set('view engine', 'pug');
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));

// override with POST having ?_method=DELETE in index.jade
app.use(methodOverride('_method'));

app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

// remember to place below session ^^
app.use(passport.initialize());
app.use(passport.session());

app.locals.title = '';

// grabs the user.email and displays to '/', otherwise 'Guest'
// locals is available to all renderers, but only during the request
app.use((req, res, next) => {
  res.locals.user = req.user;
  console.log("server.js ln48", req.user);
  next();
});

app.use(routes);

mongoose.connect('mongodb://localhost:27017/orator2', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(chalk.magenta.bold('Node.js server started. ') + chalk.red.bold.bgYellow(`Listening on PORT ${PORT}`));
  });
});

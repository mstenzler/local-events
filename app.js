'use strict'
const express         = require('express');
const path            = require('path');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const session         = require('express-session');
const methodOverride  = require('method-override');
const homeRoute       = require('./routes/home');
const userRoute       = require('./routes/user');
const eventRoute      = require('./routes/event');
const { ObjectID }    = require('mongodb');

const app             = express();
const port            = process.env.PORT || process.argv[2] || 3000
const maxAgeHours     = 24;
const maxAge          = maxAgeHours * 3600000;

app.locals.pluralize = function(num, single, plural) {
    return num + " " +(num > 1 ? plural : single);
  };

app.locals.isRsvp = function(event, user) {
  console.log('IN isRsvp');
  if (! (user && user['_id']) )  {
    console.log('NO USER or user[_id]');
    return false;
  } else {
    let matching = event.rsvps.filter(function(obj) {
      return (obj.toString() === user['_id']);
    })
    return (matching.length > 0);
  }
};

// Adding session as a middleware
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'sooopersekret',
  cookie: {maxAge: maxAge}
}));

// Adding Method override to allow our form to delete
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));
app.use('/bower_components', express.static(path.join(__dirname,'/bower_components')))

app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/event', eventRoute);

app.listen(port, function() {
  console.log('Server is listening on ',port);
})
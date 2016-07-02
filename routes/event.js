const router = require('express').Router();
const { searchEvent, saveEvent, 
        getEvents, categories } = require('../models/event');
const { loginCheck }                         = require('../lib/utils');

router.get('/json/search', searchEvent, function(req,res) {
  res.json(res.events);
});

router.get('/popular', getEvents, function(req,res) {
  res.render('event/popular', { events: res.eventList });
});

router.post('/search', loginCheck, searchEvent, function(req,res) {
   res.render('index',{user: req.session.user, categories: categories(), 
    events: res.events });
});

router.post('/rsvp', loginCheck, saveEvent, function(req,res) {
   res.render('index',{user: req.session.user, categories: categories(), 
    events: res.events });
});

module.exports = router;
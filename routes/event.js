const router                    = require('express').Router();
const { searchEvent, saveEvent, 
        getEvents, categories } = require('../models/event');
const { loginCheck, apiLoginCheck,  passUser }  = require('../lib/utils');


router.post('/json/search', searchEvent, function(req,res) {
  res.json(res.events);
});

router.get('/json/search', searchEvent, function(req,res) {
  res.json(res.events);
});

router.get('/popular', passUser, getEvents, function(req,res) {
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

router.post('/api/rsvp', apiLoginCheck, saveEvent, function(req,res) {
   res.json(res.result)
});

module.exports = router;
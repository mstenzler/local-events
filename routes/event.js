const router = require('express').Router();
const { searchEvent, categories } = require('../models/event');

router.get('/json/search', searchEvent, function(req,res) {
  res.json(res.events);
  //res.render('index',{user: req.session.user});
});

router.post('/search', searchEvent, function(req,res) {
  //res.json(res.events);
   res.render('index',{user: req.session.user, categories: categories(), events: res.events });
});

module.exports = router;
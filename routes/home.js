const router = require('express').Router();
const { categories } = require('../models/event');

router.get('/', function(req,res) {
  res.render('index',{user: req.session.user, categories: categories() });
});

module.exports = router;
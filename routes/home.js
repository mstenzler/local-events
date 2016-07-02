const router = require('express').Router();
const { categories } = require('../models/event');
const { loginCheck } = require('../lib/utils');


router.get('/', loginCheck, function(req,res) {
  res.render('index',{user: req.session.user, categories: categories() });
});

module.exports = router;
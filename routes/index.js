var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'BREIT: Balance Rate Equations for Ion Transportation' });
});

module.exports = router;

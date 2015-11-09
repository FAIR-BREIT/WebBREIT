var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res, next) {
  var options = {
    root: __dirname + '/../results/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile(req.params.name, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

module.exports = router;

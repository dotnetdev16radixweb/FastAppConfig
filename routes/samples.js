var express = require('express');
var router = express.Router();
var samples = require('../dashsamples.json');

router.get('/', function(req, res) {
	res.json(samples.samples);
});

module.exports = router;

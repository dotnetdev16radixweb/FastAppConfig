var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	configManager = req.configManager;
	res.render('index',{"serverMode":configManager.isServerMode()});
});

module.exports = router;

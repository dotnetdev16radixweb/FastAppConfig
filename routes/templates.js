var express = require('express');
var router = express.Router();
var configManager = require("../src/ConfigManager");

router.get('/', function(req, res) {
	res.json(configManager.getConfig().templates);
});

module.exports = router;

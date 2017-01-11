var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	var json = req.body[0];
	req.configManager.saveConfig(json);
	req.restManager.updateConfiguration();
	res.status = 200;
	res.send("Settings Updated");
});

module.exports = router;

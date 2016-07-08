var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	var sampleId = req.body[0];
	var application = req.body[1];
	
	req.appConfigManager.deploySampleDashboard(sampleId,application,function(results){
		res.send("Sample Dashboard Deployed Successfully");
	});
	
	
});

module.exports = router;

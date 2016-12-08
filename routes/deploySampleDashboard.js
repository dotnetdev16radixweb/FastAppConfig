var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	var sampleId = req.body[0];
	var application = req.body[1];
	
	req.appConfigManager.deploySampleDashboard(sampleId,application,function(err,results){
		if(err){
			res.status = 500;
			res.send(err.body);
		}else{
			res.status = 200;
			res.send("Sample Dashboard Deployed Successfully");
		}
	});
	
});

module.exports = router;

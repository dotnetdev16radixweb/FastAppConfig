var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	var sampleId = req.body[0];
	var applicationId = req.body[1];
	
	req.appConfigManager.deploySampleHealthRule(sampleId,applicationId,true,function(results){
		res.send("Sample Health Rule Copied Successfully");
	});
		
});

module.exports = router;

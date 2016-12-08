var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	var sampleId = req.body[0];
	var applicationId = req.body[1];
	
	req.appConfigManager.deploySampleHealthRule(sampleId,applicationId,true,function(err,results){
		if(err){
			res.status = 500;
			res.send(err.body);
		}else{
			res.status = 200;
			res.send("Sample Health Rule Copied Successfully");
		}
	});
		
});

module.exports = router;

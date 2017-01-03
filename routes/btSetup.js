var express = require('express');
var router = express.Router();
var config = require('../config.json');

router.get('/bts/:applicationName/:timeFrame/:btListTopCount', function(req, res) {
	
	req.btConfigManager.getBTDetailList(req.params.applicationName,req.params.timeFrame,req.params.btListTopCount,function(err,result){
		if(err){
			res.status(500).json(err.body);
		}else{
			res.status(200).json(result);
		}
	});
	
});

router.post('/bts/createBTs/', function(req, res) {
	
	var applicationId = req.body[0];
	var btList = req.body[1];

	req.btConfigManager.createCustomMatchRules(applicationId,btList,function(err,result){
		if(err){
			res.status(500).json(err.body);
		}else{
			res.status(200).json(btList.length);
		}
	});
	
});

router.post('/bts/deleteBTs/', function(req, res) {
	
	var applicationName = req.body[0];
	var btList = req.body[1];
	var timeFrame = req.body[2];
	var btListTopCount = req.body[3];

	req.btConfigManager.deleteBTs(applicationName,btList,timeFrame,btListTopCount,function(err,result){

		if(err)
		{
			if (err.body.displayText)
			{
				res.status(500).json(err.body.displayText);
			}
			else
			{
				res.status(500).json(err.body);
			}
		}
		else
		{
			res.status(200).json(result);
		}
	});
	
});

module.exports = router;

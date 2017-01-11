var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	var allApp =
	{
			"description": "",
			"id": 0,
			"name": "<All Applications>"
	};
	req.appConfigManager.fetchApplications(function(err,results){
		if(err){
			res.status = 500;
			res.send(err.statusMessage);
		}else{
			if(results){
				res.status = 200;
				results.push(allApp);
				res.json(results);
			}else{
				res.status = 500;
				res.json({"error":"not able to connect","details":results});
			}
		}
	})

});

module.exports = router;

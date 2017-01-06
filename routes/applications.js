var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

	var allApp =
	{
			"description": "",
			"id": 0,
			"name": "<All Applications>"
	};

	req.restManager.getAppJson(function(err,result){
		result.push(allApp);
		res.json(result);
	});

});

module.exports = router;

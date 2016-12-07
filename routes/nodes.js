var express = require('express');
var router = express.Router();
var config = require('../config.json');

router.get('/:appid/:tierid', function(req, res) {
	req.restManager.getNodesJson(req.params.appid,req.params.tierid,function(result){
		res.json(result);
	});
});

module.exports = router;

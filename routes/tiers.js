var express = require('express');
var router = express.Router();
var config = require('../config.json');

router.get('/:appid', function(req, res) {
	req.restManager.getTiersJson(req.params.appid,function(err,result){
		res.json(result);
	});
});

module.exports = router;

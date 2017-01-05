var express = require('express');
var router = express.Router();

router.get('/:appid/:tierid', function(req, res) {
	req.restManager.getNodesJson(req.params.appid,req.params.tierid,function(err,result){
		res.json(result);
	});
});

module.exports = router;

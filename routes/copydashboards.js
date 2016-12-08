var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
	
	var template = req.body[0];
	var application = req.body[1];
	var dashboardName = req.body[2];
	
	req.appConfigManager.postDashBoard(template.dashid,application.id,application.name,dashboardName,function(err,results){
		if(err){
			res.status = 500;
			res.send(err.statusMessage);
		}else{
			res.status = 200;
			res.send("Dashboard Copied Successfully");
		}
	});
	
	
});

module.exports = router;

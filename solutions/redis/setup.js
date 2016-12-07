var log4js = require('log4js');
var log = log4js.getLogger("elasticsearch-setup.js");

var plugin = require('./package.json')

var Package = function(config) {

	context = plugin.context;
	
	config.app.get('/'+context+'/*', function(req, res) {
		var path = req.params[0];
		
		log.debug("path :"+path);
		
		if (path.indexOf('..') === -1) {
			return res.sendfile(__dirname + '/public/' + path);
		} else {
			res.status = 404;
			return res.send(path+' Not Found');
		}
	});

	return this;
};

module.exports = Package;
var log4js = require('log4js');
var log = log4js.getLogger("elasticsearch");
var plugin = require('./package.json')

var nunjucks = require('nunjucks');
var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(
		__dirname + '/views'));

function render(res, template, info) {
	return res.send(partial(template, info));
}

function partial(name, data) {
	if (!data) {
		data = {};
	}

	if (typeof (data.partial) === 'undefined') {
		data.partial = partial;
	}

	var tmpl = nunjucksEnv.getTemplate(name);
	return tmpl.render(data);
}


var Package = function(config) {

	context = plugin.context;
	app = config.app;

	app.get('/'+context+'/deploy.html',function(req,res){
		return render(res, 'deploy.njk', {});
	});

	app.get('/' + context + '/*', function(req, res) {
		var path = req.params[0];
		if (path.indexOf('..') === -1) {
			return res.sendfile(__dirname + '/public/' + path);
		} else {
			res.status = 404;
			return res.send('Not Found');
		}
	});

	return this;
};



module.exports = Package;
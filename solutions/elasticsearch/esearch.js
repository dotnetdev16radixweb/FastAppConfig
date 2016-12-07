var log4js = require('log4js');
var log = log4js.getLogger("elasticsearch");
var plugin = require('./package.json');
var fs 				= require('fs');
var services = require('./services.js');


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
	
	app.post('/'+context+'/postpackage-hr',function(req,res){
		var appid 		= req.body[0];
		var appname 	= req.body[1];
		var tierid 		= req.body[2];
		var tiername 	= req.body[3];
		var nodename 	= req.body[4];
		var cluster  	= req.body[5];
		var hrname 		= req.body[6];
		
		fs.readFile('./solutions/elasticsearch/hr.xml', 'utf-8', function (err, data) {
  			sourceXMLAsString = data;
  			
  			sourceXMLAsString = sourceXMLAsString.replace("{healthrulename}",hrname);
  			
  			var mods = [{element:'application-component-node',regexs:[{regex:'{node}',value:nodename}]},
  			         {element:'logical-metric-name',regexs:[{regex:'{node}',value:nodename},{regex:'{cluster}',value:cluster}]},
  			         {element:'metric-name',regexs:[{regex:'{cluster}',value:cluster}]}];
  			
  			req.hrManager.updateNodeReference(sourceXMLAsString,mods,function(hrxml){
  				log.debug(hrxml);
  				req.restManager.postHealthRules(appid,hrxml,true,function(result){
  					res.status = 200;
  					return res.send("success");
  				})
  			})	
  		});
		res.status = 500;
		return res.send("error");
		
	})

	app.post('/'+context+'/postpackage-dash',function(req,res){
		var appid		= req.body[0];
		var appname 	= req.body[1];
		var tierid 		= req.body[2];
		var tiername 	= req.body[3];
		var nodename 	= req.body[4];
		var cluster  	= req.body[5];
		var hrname 		= req.body[6];
		var dashboardName = req.body[7];
		
		console.log(appid+" "+appname+" "+tierid+" "+tiername+" "+nodename+" "+cluster+" "+hrname+" "+dashboardName);
				
		fs.readFile('./solutions/elasticsearch/dash.json', 'utf-8', function (err, data) {
			dashboardJsonObj = JSON.parse(data);
			dashboardJsonObj = services.updateDashboard(dashboardJsonObj,dashboardName,hrname,appname,appid,tiername,tierid,nodename,cluster);
			console.log(JSON.stringify(dashboardJsonObj,null,4));
			req.restManager.postDashboard(dashboardJsonObj,function(result){
				res.status = 200;
				return res.send("success");
			})
		});
		
		res.status = 500;
		return res.send("error");
	})

	
	
	return this;
};

 



module.exports = Package;
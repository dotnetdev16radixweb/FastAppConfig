var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var packageController = require("package.js");

var routes = require('./routes/index');
var schedule = require('node-schedule');
var childProcess = require("child_process");
var fs = require('fs');
var configManager = require("./src/ConfigManager.js");
var moment = require("moment");

var restManager = require('./src/RestManager.js');
var btConfigManager = require('./src/BTConfigManager.js');
var appConfigManager = require('./src/AppConfigManager.js');
var hrManager = require('./src/HealthRuleManager.js');


var templates = require('./routes/templates.js');
var appJson = require('./routes/applications.js');
var btSetupRoutes = require('./routes/btSetup.js');
var copyhealthrules = require('./routes/copyhealthrules.js');
var copydashboards = require('./routes/copydashboards.js');
var samples = require('./routes/samples.js');
var dashsamples = require("./dashsamples.json");
var deploySampleHealthRules = require("./routes/deploySampleHealthRules.js");
var deploySampleDashboard = require("./routes/deploySampleDashboard.js");
var tiersJson = require('./routes/tiers.js');
var nodesJson = require('./routes/nodes.js');
var settings = require('./routes/settings.js');

var app = express();
var mkdirp = require('mkdirp');

mkdirp('/tmp/log/fastappconfig', function (err) {
	if (err) console.error(err);
});

var log4js = require('log4js');
var log = log4js.getLogger("app");


var init = function(){

}()

app.use(function(req,res,next){
    req.restManager = restManager;
    req.btConfigManager = btConfigManager;
    req.appConfigManager = appConfigManager;
    req.configManager = configManager;
    req.hrManager = hrManager;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/public/images/*', function (req,res)
{
    res.sendFile (__dirname+req.url);
});

app.use(express.static(__dirname + '/public/images'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/templates.json',templates);
app.use('/applications.json',appJson);
app.use('/btSetup',btSetupRoutes);
app.use('/tiers',tiersJson);
app.use('/nodes',nodesJson);
app.use('/copyhealthrules',copyhealthrules);
app.use('/copydashboards',copydashboards);
app.use('/samples.json',samples);
app.use('/deploySampleHealthRules',deploySampleHealthRules);
app.use('/deploySampleDashboard',deploySampleDashboard);
app.use('/settings',settings);

app.use('/', routes);

app.get('/btsetup.html', function(req, res) {
    res.render('btsetup');
});

app.get('/deploy.html', function(req, res) {
	res.render('deploy');
});

app.get('/samples.html', function(req, res) {

    var themeId = req.param("theme");
    var filteredSamples = JSON.parse(JSON.stringify(dashsamples));
    filteredSamples.samples = [];

    if (!themeId)
    {
        if (dashsamples.themes.length > 0)
        {
            themeId = dashsamples.themes[0].id;
        }
    }

    if (themeId)
    {
        for(var i=0; i < dashsamples.samples.length; i++)
        {
            var dashsample = dashsamples.samples[i];
            if (dashsample.themes)
            {
                for(var j=0; j < dashsample.themes.length; j++)
                {
                    if (themeId == ("" + dashsample.themes[j]))
                    {
                        filteredSamples.samples.push(dashsample);
                    }
                }
            }
        }
        res.render('sample',{"filteredSamples":filteredSamples, "appConfigManager": appConfigManager, "themeId": themeId});
    }
	else
    {
        res.render('sample',{"filteredSamples":dashsamples, "appConfigManager": appConfigManager, "themeId": themeId});
    }
});

app.get('/deploysample.html', function(req, res) {
	var id = req.param("id");
    var themeId = req.param("theme");
    var selectedSample = appConfigManager.findSampleById(id);
	var selectedTheme;
    var themes = [];

    if (themeId)
    {
        selectedTheme = appConfigManager.findThemeById(themeId);
    }
    if (selectedSample.themes)
    {
        for(var i=0; i < selectedSample.themes.length; i++)
        {
            var theme = appConfigManager.findThemeById(selectedSample.themes[i]);
            if (theme)
            {
                themes.push(theme);
            }
        }
    }

    res.render('deploysample',{"sample":selectedSample, "selectedTheme": selectedTheme, "themes": themes});
});

app.get('/deployhelp.html', function(req, res) {
	res.render('deployhelp');
});

//Add plugins
plugins = [];
packageController.autoload({
    debug: true,
    identify: function() {
    	plugins.push({dir:this.dir,meta:this.meta});
        return (true);
    },
    directories: [path.join(__dirname, "solutions")],
    packageContstructorSettings: {app:app}
});

app.get('/solutions.html', function(req, res) {
	res.render('solutions',{"plugins":plugins});
});

app.get('/settings.html', function(req, res) {
    res.render('settings',{"json": configManager.getAllConfigItems()});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error(req.originalUrl+' Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    	log.error("Something went wrong:", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
	log.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


process.on('exit', function() {
	  console.log("shutting down");
});

module.exports = app;

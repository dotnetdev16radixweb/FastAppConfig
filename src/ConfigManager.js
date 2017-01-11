var storage = require('node-persist');

var appdatapath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')
storage.initSync({dir:appdatapath+'/fastappconfig/config',logging: false});

var serverMode = true;
try {
	var configFile	= require("../config.json");
} catch (ex) {
    serverMode = false;
}

exports.isServerMode = function(){
	return serverMode;
}

exports.getConfig = function(){
	return exports.getAllConfigItems();
}

exports.getConfigItem = function(key){
	if(serverMode){
		return configFile[key];
	}
	return storage.getItemSync(key);
}

exports.setConfigItem = function(key,value){
	if(serverMode){
		//doNothing
		return;
	}
	storage.setItemSync(key,value);
}

exports.getAllConfigItems = function(){
	
	if(serverMode){
		return configFile;
	}
	
	var config = {};
	storage.forEach(function(key, value) {
		config[key]=value;
	});
	if(isEmptyObject(config)){
		return getDefaultConfig();
	}else
		return config;
}

exports.removeConfigItem = function(key){
	if(serverMode){
		//do nothing
		return;
	}
	storage.removeItemSync(key);
}

function isEmptyObject(obj) {
	return !Object.keys(obj).length;
}

exports.getDefaultConfig = function(){
	return {"restuser":"<username>@account","restpassword":"<password>","controller":"controller.saas.appdynamics.com","https":true,"port":443,"saml":false,"templates":[{"id": 1,"type": "Java","description": "Template Application","appid": 1,"dashid": 1}]}
}

exports.saveConfig = function(json){
	if(serverMode){
		//do nothing
		return;
	}
	exports.setConfigItem("controller",json.controller);
	exports.setConfigItem("restuser",json.restuser);
	exports.setConfigItem("restpasswrd",json.restpasswrd);
	exports.setConfigItem("https",json.https);
	exports.setConfigItem("port",json.port);
	exports.setConfigItem("saml",json.saml);
	exports.setConfigItem("templates",json.templates);
	exports.setConfigItem("restdebug",json.restdebug);
}


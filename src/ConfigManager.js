var storage = require('node-persist');

var appdatapath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local')
storage.initSync({dir:appdatapath+'/fastappconfig/config',logging: false});

// this should be removed
// code should take care of cases where there is no config data
var configfile	= require("../config.json");
console.log("Adding config.json data to appdata store");
for (item in configfile){
	storage.setItemSync(item,configfile[item]);
}

exports.getConfig = function(){
	console.log("Calling deprecated getConfig() use getConfigItem/setConfigItem instead");
	return exports.getAllConfigItems();
}

exports.getConfigItem = function(key){
	return storage.getItemSync(key);
}

exports.setConfigItem = function(key,value){
	storage.setItemSync(key,value);
}

exports.getAllConfigItems = function(){
	var config = {};
	storage.forEach(function(key, value) {
		config[key]=value;
	});
	return config;
}

exports.removeConfigItem = function(key){
	storage.removeItemSync(key);
}

var log4js = require('log4js');
var log = log4js.getLogger("BTConfigManager");

var btConfigManager = require('./BTConfigManager');
var restManager = require("./RestManager");

function addBTRule(node,btProperties)
{			
	var node1 = node.ele('custom-match-point')
	node1.ele('name', btProperties.name);
	node1.ele('business-transaction-name', btProperties.name);
	node1.ele('entry-point', btProperties.entryPointType);
	node1.ele('background', false);
	node1.ele('enabled', true);
	var node2 = node1.ele('match-rule').ele(btProperties.matchRuleType);
	node2.ele('enabled', true);
	node2.ele('priority', btProperties.priority);
	node2.ele('excluded', false);
	node2.ele('uri', {'filter-type': btProperties.criteria, 'filter-value': btProperties.uri});
	node2.ele('properties');
}

exports.createCustomMatchRules = function (applicationID,createList,callback)
{
	var agentType;
	var javaList = [];
	var dotNetList = [];

	for (var i = 0; i < createList.length; i++)
	{
		if (createList[i].entryPointType == "SERVLET")
		{
			createList[i].matchRuleType = "servlet-rule";
			javaList.push(createList[i]);
		}
		else if (createList[i].entryPointType == "ASP_DOTNET")
		{
			createList[i].matchRuleType = "asp-dotnet-rule"; 
			dotNetList.push(createList[i]);
		}
	}

	if (javaList.length > 0)
	{
		var builder = require('xmlbuilder');
		var xml = builder.create('custom-match-points');

		for (var i = 0; i < javaList.length; i++)
		{
			addBTRule(xml, javaList[i]);
		}

		addBTRule(xml, {name: "Catch-All", entryPointType: "SERVLET", matchRuleType: "servlet-rule", priority: 0, criteria: "NOT_EMPTY", uri: "<not empty>"});

		restManager.postCustomMatchRules(applicationID,xml,"servlet",callback);
	}

	if (dotNetList.length > 0)
	{
		var builder = require('xmlbuilder');
		var xml = builder.create('custom-match-points');

		for (var i = 0; i < dotNetList.length; i++)
		{
			addBTRule(xml, dotNetList[i]);
		}

		addBTRule(xml, {name: "Catch-All", entryPointType: "ASP_DOTNET", matchRuleType: "asp-dotnet-rule", priority: 0, criteria: "NOT_EMPTY", uri: "<not empty>"});

		restManager.postCustomMatchRules(applicationID,xml,"aspDotNet",callback);
	}
}

exports.getBTDetailList = function (appName,timeFrame,btListTopCount,callback){

	restManager.getBTList(appName,function(err1,btNames){

		var btList = [];

		for (var i = 0; i < btNames.length; i++)
		{
			if (btNames[i].name != "_APPDYNAMICS_DEFAULT_TX_")
			{
				btNames[i].topN = false;
				btNames[i].createCMR = false;
				btNames[i].topCPM = false;
				btNames[i].topART = false;

				if (btNames[i].entryPointType == "SERVLET" || btNames[i].entryPointType == "ASP_DOTNET")
				{
					btNames[i].canCreateCMR = true;
				}
				else
				{
					btNames[i].canCreateCMR = false;
				}

				btList.push(btNames[i]);
			}
		}

		restManager.getBTCallsPerMinute(appName,"*","*",timeFrame,function(err1,cpmList){

			cpmList.forEach(function(cpm){

				var metricPath = cpm.metricPath.split("|");
				var tierName = metricPath[2];
				var btName = metricPath[3];

				for (var i = 0; i < btList.length; i++)
				{
					var bt = btList[i];

					if (bt.name == btName && bt.tierName == tierName)
					{
						if (cpm.metricValues.length > 0)
						{
							bt.cpm = cpm.metricValues[0].value;
						}
						else
						{
							bt.cpm = -1;
						}
						break;
					}
				}

			});

			restManager.getBTAverageResponseTime(appName,"*","*",timeFrame,function(err1,artList){

				artList.forEach(function(art){

					var metricPath = art.metricPath.split("|");
					var tierName = metricPath[2];
					var btName = metricPath[3];

					for (var i = 0; i < btList.length; i++)
					{
						var bt = btList[i];

						if (bt.name == btName && bt.tierName == tierName)
						{
							if (art.metricValues.length > 0)
							{
								bt.art = art.metricValues[0].value;
							}
							else
							{
								bt.art = -1;
							}
							break;
						}
					}

				});

				btList.sort(SortByCPM);
				
				var topN = Math.min(btListTopCount, btList.length); 

				for (var i = 0; i < topN; i++)
				{
					btList[i].topN = true;
					btList[i].createCMR = true;
					btList[i].topCPM = true; 
				}

				btList.sort(SortByART);

				for (var i = 0; i < topN; i++)
				{
					btList[i].topN = true;
					btList[i].createCMR = true;
					btList[i].topART = true; 
				}

				btList.sort(SortByName);

				console.log("callback: " + btList.length);
				callback(null,btList);

			});

		});



	});

}

exports.deleteBTs = function (appName,btList,timeFrame,btListTopCount,callback){
	
	var deleteBTList = [];

	for (var i = btList.length - 1; i >= 0; i--) 
	{
		deleteBTList.push(btList[i].id);
	}

	restManager.deleteBTs(deleteBTList,function(err,list){

		console.log("err: " + err + ", " + list);

		if (err)
		{
			callback(err,null);
		}
		else
		{
			btConfigManager.getBTDetailList(appName,timeFrame,btListTopCount,callback);
		}

	});
}

function SortByCPM(x,y) 
{
	return y.cpm - x.cpm; 
}
function SortByART(x,y) 
{
	return y.art - x.art; 
}
function SortByName(x,y) 
{
	if (y.name.toLowerCase() < x.name.toLowerCase())
	{
		return 1;
	}
	else
	{
		return -1;
	}
}

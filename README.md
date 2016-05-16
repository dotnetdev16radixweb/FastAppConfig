FastAppConfig
==========

Deploy Health Rules and Dashboards quickly

Installation :

Required Frameworks :
1. node.js
2. bower

Installation :

1. Clone from repository : 
>git clone https://github.com/Appdynamics/FastAppConfig.git

2. Change into the direcotry
> cd FastAppConfig

3. Download the dependencies
> bower install

4. Download npm dependencies
> npm install

5. Configure the application. See Configuration Steps

6. start node.js
> npm start

6. Open browser to :
http://localhost:3000

Configuration Steps :

Create a config.json file in the root directory. Here is a sample :

{
	"restuser" : "username@account_name",
	"restpasswrd" : "password",
	"controller" : "server.saas.appdynamics.com",
	"https" : true,
	"templates":[
		{"id":1,"name":"Java Template","type":"Java","description":"Java Application - Health Rules and Dashboards","appid":38,"dashid":39},
		{"id":2,"name":".NET Template","type":".NET","description":".NET Application - Health Rules and Dashboards","appid":27,"dashid":3},
	]
}

restuser is the username @ the account 
https is wether you are using https to reference your controller.
appid is the application id
dashid is the id of the dashboard
templates are entries that point to your template application on your controller. 

Scenario : Copy Health Rules
You would create or use an existing application as your template. In this application configure your health rules the way you want. These
rules would then be copied to the target application or "All Applications" if you desire. If you select All Applications the health rules 
would be copied to all existing applications.

Scenario : Copy Dashboard
You would create a dashboard and use this as a template. Then when you are ready to the copy the dashboard to the target application, we download the 
dashboard and update any references to an application and change it to the target application. For example health rule references are modified
and deep link references are also modified.

Scenario : Copy Health Rules to All Applications
You can select a template and select the "All Applications" option in the target application from the drop down selection. This would copy
all the health rules from the template application to all other applications on the Controller. 
If you want to push just 1 health rule change, then make sure that only 1 health rule exist in the template application.





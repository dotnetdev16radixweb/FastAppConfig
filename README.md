<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/features.png"/>

#### Required Frameworks
1. node.js version v0.10.34 or v4.x <br/>
2. bower<br/>

References :<br/>
http://www.thinkingmedia.ca/2015/07/how-to-install-nodejs-bower-and-grunt-on-windows-8/<br/>
https://nodejs.org/en/download/<br/>
http://bower.io/<br/>

### Intsalling on Ubuntu
http://www.hostingadvice.com/how-to/install-nodejs-ubuntu-14-04/#ubuntu-package-manager

1. sudo apt-get install nodejs
2. sudo apt-get install npm
3. sudo ln -s /usr/bin/nodejs /usr/bin/node
4. sudo npm install bower -g

Switch to node version 0.10.34
(If you need to switch node.js versions follow this : https://github.com/creationix/nvm)

1. curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
2. Logout and log back in
2. Check if it installed >command -v nvm should output nvm
3. nvm install 0.10.34

### Installing on Mac
Download Node 4.x from
https://nodejs.org/en/download/<br/>

Install Bower from
http://bower.io/<br/>

### Installing on Windows
Download Node 4.x from
http://www.thinkingmedia.ca/2015/07/how-to-install-nodejs-bower-and-grunt-on-windows-8/<br/>

####Installation

1. Clone from repository :
>git clone https://github.com/Appdynamics/FastAppConfig.git

2. Change into the directory
> cd FastAppConfig

3. Download the dependencies
> bower install

4. Download npm dependencies
> npm install

5. Configure the app.
Create a config.json file in the root directory with the following :

<pre>
{
	"restuser" : "username@account_name",
	"restpasswrd" : "password",
	"controller" : "server.saas.appdynamics.com",
	"https" : true,
	"templates":[
		{"id":1,"name":"Java Template","type":"Java","description":"Java Application - Health Rules and Dashboards","appid":2,"dashid":2},
		{"id":2,"name":".NET Template","type":".NET","description":".NET Application - Health Rules and Dashboards","appid":3,"dashid":3}
	]
}
</pre>
<br/>
restuser is the username @ the account <br/>
https is a flag to set if you are using https to reference your controller.<br/>
appid is the application id<br/>
dashid is the id of the dashboard<br/>
templates are entries that point to your template application on your controller.<br/>

If you are running your controller with a different port e.g. 8090 then you need to add the port element e.g.

"controller" : "server.saas.appdynamics.com",
"port":8090,

6. start node.js
> npm start

6. Open browser to :
http://localhost:3000

####Configuration Steps


---
####Feature 1 : Sample Dashboards
Use this option to quickly deploy existing sample dashboards into your Controller. When you select this option you will be shown a list of sample dashboards
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/sample1.png"/>
You can then select a sample dashboard to deploy. You will select the destination application you want the dashboard associated with. Some sample dashboards come with the associated Health Rules. Deploy the Health Rules first and then deploy the Dashboard. The dashboard will then be named with the name of the application plus the dashboard sample name.
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/sample2.png"/>

#### Steps to add your own sample : <br/>
<ul>
	<li>Create a directory under the public/samples directory</li>
	<li>Add the dashboard.json, hr.xml (Health Rules), preview png and a full png screenshot.</li>
	<li>Last step is to update the ./dashsamples.json file</li>
	<li>Restart the app by running npm start again and your sample should be available for deployment.</li>
</ul>

#### Steps to sanitize a Dashboard Sample : <br/>
<ul>
	<li>Change any reference to your Application Name element to {app_name}</li>
	<li>Change any deep links, replace https://client.saas.appdynamics.com/controller.... to {server}/controller....</li>
</ul>


---
####Feature 2 : Health Rules and Dashboard Templates
Use this option when you have configured health rules and dashboards for your applications that you would like to use as a template for new applications. You can point to the Application and Dashboard, which can then be copied over to new applications as they are onboarded. The typical use case is where you want to onboard 50+ new apps quickly. Best practice is to setup one app with health rules and dashboards for each type of environment example Java vs .NET. You can also make modifications to the base health rules and then publish this to all apps.

#### Screenshots
Step 1 : Select Template
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/step1.png"/>
Once you have your templates configured, then first step is decide if which template's health rules you are going to copy. When you select copy in Step 3
the Health Rules are first copied and then modified, then it is pushed back to the Controller.

Step 2 : Select Destination Application
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/step2.png"/>
In Step 2 you will select your destination application that the health rules and dashboard will be copied to. To copy to all applications selec the "All Application" option.

Step 3 : Copy Health Rules
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/step3.png"/>
If you select to overwrite the rules, then all the rules from the template application will be copied to the destination application. If you select to not overwrite the rules, then only new rules will be copied over.

Step 4 : Copy Dashboards
<img src="https://github.com/Appdynamics/FastAppConfig/blob/master/public/img/step4.png"/>
When you copy the Dashboard, the template dashboard will be downloaded and modified. The internal references to health rules and deep links will be modified to reference the destination application. If you copy again, a new dashboard will be created. Overwriting dashboards are not supported right now .

---
#### Scenario : Copy Health Rules <br/>
You would create or use an existing application as your template on your controller. In this template application configure your health rules the way you want. These rules would then be copied to the target application that you select in Step 2.
<p/>
#### Scenario : Copy Dashboard <br/>
You would create a dashboard and use this as a template. If you have status widgets tied to health rules, then make sure that these health rules are also copied to the target application. When you are ready to the copy the dashboard to the target application, this app downloads the
dashboard and update any references e.g. Health Rules and deep links, and updates it to the target application.
<p/>
#### Scenario : Copy Health Rules to All Applications <br/>
You can select a template and select the "All Applications" option in the target application from the drop down selection. This would copy
all the health rules from the template application to all other applications on the Controller.
If you want to push just 1 health rule change, then make sure that only 1 health rule exist in the template application.

####

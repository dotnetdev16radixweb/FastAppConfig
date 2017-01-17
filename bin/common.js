#!/usr/bin/env node
module.exports = () => {

    var app = require(__dirname + '/../app');
    app.set('port', process.env.PORT || 3000);

    const os = require("os");
    var logpath = os.tmpdir()+'/log/fastappconfig';

    const mkdirp = require('mkdirp');
    try {
        mkdirp.sync(logpath);
    } catch (e) {
        console.error("Could not set up log directory at " + logpath + ", error was: ", e);
        process.exit(1);
    }

    var log4js = require('log4js');
    // All logs will be created in logpath. Use absolute=true in json to override
    log4js.configure(__dirname + '/../log4js.json', { cwd: logpath });

    var log = log4js.getLogger("startup");
    var server = app.listen(app.get('port'), function() {
        log.info('Express server listening on port ' + server.address().port);
    });
}

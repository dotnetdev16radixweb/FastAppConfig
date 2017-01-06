#!/usr/bin/env node

module.exports = () => {

    var app = require(__dirname + '/../app');
    app.set('port', process.env.PORT || 3000);

    const fs = require('fs');

    /**
     * make a log directory, just in case it isn't there.
     */
    try {
        fs.mkdirSync('/tmp');
        fs.mkdirSync('/tmp/log');
    } catch (e) {
        if (e.code != 'EEXIST') {
            console.error("Could not set up log directory, error was: ", e);
            process.exit(1);
        }
    }

    var log4js = require('log4js');
    log4js.configure(__dirname + '/../log4js.json');

    var log = log4js.getLogger("startup");

    var server = app.listen(app.get('port'), function() {
        log.info('Express server listening on port ' + server.address().port);
    });
}

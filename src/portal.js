/**
 * Portal Server
 * usage  : nodejs portal.js
 * example: nodejs portal.js
 */
 
'use strict';
(function(){

// Imports
// -----------------------------------------------------------------
const cluster = require('cluster');
const fs = require('fs');
const PortalServer = require('./portal/server.js');

// Start server
// -------------------------------------------------------------
function start_server(id,config,port) {
    var server = new PortalServer(id);
    if (!server.init(config)) {
        process.exit();
        return;
    }
    server.start(port);
}
// Program Entrance
// -----------------------------------------------------------------
function main() {
    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    // Start server instances according to config['server']['threads']
    if (cluster.isMaster) {
        if (config['server']['threads'] == -1) {
            config['server']['threads'] = require('os').cpus().length;
        }
        if ( config['server']['threads'] == 1 ) {
            start_server(1, config, config['server']['port']);
        } else {
            for (var i = 1; i <= config['server']['threads']; i++) {
                cluster.fork({'id': i});
            }
        }
    } else {
        start_server(cluster.worker.id, config, config['server']['port']);
    }
}
main();

})();

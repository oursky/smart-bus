/**
 * Portal Server
 * Simple express httpd servicing static content and ajax
 * static contents are located in html/ folder
 * ajax:
 *   /ajax/stops?route=XX
 *   /ajax/buses?route=XX
 */ 
module.exports = (function(){
// Imports
// -----------------------------------------------------------------
const fs = require('fs');
const path = require('path');
const express    = require('express');
const BodyParser = require('body-parser');
const Database = require('../datastore/database.js');


// -----------------------------------------------------------------
class PortalServer {
    constructor() {
    }
    /**
     * Initlization
     * @public
     * @param  {!Object} config configuration
     * @return {boolean} true if success
     */
    init(config) {
        this._db = new Database(config["database"]);
        // express
        this._app = express()
                    // .use(BodyParser.urlencoded({extended: true}))
                    .use(BodyParser.json())
                    ;
        // Error Handler
        this._app.use(function(err, req, res, next) {
            if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
                res.status(403).json({"error":"INVALID_PARAM"});
            }
        });
        // Remove useless header   
        this._app.use(function (req, res, next) {
            res.removeHeader("X-Powered-By");
            next();
        });
        // Static content
        this._app.use('/', express.static(path.join(__dirname, 'html')))        
        // Register URI Handlers
        fs.readdirSync("./portal/api").forEach((module) => {
            var mod = require("../portal/api/" + module);
            var uri = "/api/" + module.slice(0, -path.extname(module).length);
            this._app.post(uri, mod.handler.bind(this));
        });
        return true;
    }
    /**
     * Start server
     * @public
     * @param {!number} port Server TCP port
     * @return {boolean} true if success
     */
    start(port) {
        this._app.listen(port);
        return true;
    }    
    /**
     * Stop server
     * @public
     * @param {!number} port Server TCP port
     * @return {boolean} true if success
     */
    stop(port) {
        this._app.close();
        return true;
    }
}

// EXPORTS
// -----------------------------------------------------------------
return PortalServer;
}());   

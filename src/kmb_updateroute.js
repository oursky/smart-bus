/**
 * Fetch bus stops of a route and store into database
 * usage  : nodejs kmb_updateroutes.js route
 * example: nodejs kmb_updateroutes.js 12A
 */
 
'use strict';
(function(){
// Imports
// -----------------------------------------------------------------
const fs = require('fs');
const Async = require('async');
const Database = require('./datastore/database.js');
const KMB  = require('./datasrc/kmb.js');
const HK80 = require('./datasrc/hk80.js');

// Local Variables
// -----------------------------------------------------------------
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();
var hk80 = new HK80();
var jobs = 0;		// We quit when no more job

function update_route(datasrc,route) {
    jobs ++;
    datasrc.get_bounds(route, (bounds) => {
        for (var bound of bounds) {
            console.log("Route " + route + ", bound: " + bound);
            jobs ++;
            datasrc.get_stops(route, bound, (basic,stops) => {
                stops.forEach((stop)=> {
                    var locations = [{x:stop.x,y:stop.y}];
                    if (stop.path) locations = locations.concat(stop.path);
                    // TODO: hk80 has a block request to resolve a list of locations
                    Async.map(locations, (pos,cb) => {
                        jobs ++;
                        hk80.get_latlng(pos.x, pos.y, (lat,lng) => {
                            jobs --;
                            cb(null, {lat:lat, lng:lng});
                        });
                    }, (err, results) => {
                        // Bus stop main info
                        jobs++;
                        db.busstop_set(
                            stop.route, stop.bound, stop.seq, stop.bsicode,
                            // stop.name_en, stop.name_tc, stop.name_sc,
                            // stop.location_en, stop.location_tc, stop.location_sc,
                            stop.name_en, '',  '',
                            stop.location_en, '', '',
                            stop.x, stop.y, results[0].lat, results[0].lng,
                            results,
                            stop.fare,
                            0, 0,
                            () => jobs-- );
                    }); // Async
                });	// stops.forEach
                jobs --;
            });	// datasrc.get_stops
        } // for (var bound of bounds)
        jobs --;
    }); // datasrc.get_bounds
}

// Program Entrance
// -----------------------------------------------------------------
update_route(kmb, process.argv[2]);

setInterval(()=>{
    console.log("Outstanding Jobs: " + jobs);
    if (jobs==0) process.exit();
}, 1000);

})();

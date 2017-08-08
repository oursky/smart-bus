/**
 * Fetch bus stops of a route and store into database
 * usage  : nodejs kmb_updateroutes.js route
 * example: nodejs kmb_updateroutes.js 12A
 */
 
'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB  = require('./datasrc/kmb');
const HK80 = require('./datasrc/hk80');

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
					jobs ++;
					hk80.get_latlon(stop.x, stop.y, (lat,lon) => {
						jobs ++;
		  				db.busstop_set(
	    					stop.route, stop.bound, stop.seq, stop.bsicode,
							// stop.name_en, stop.name_tc, stop.name_sc,
							// stop.location_en, stop.location_tc, stop.location_sc,
							stop.name_en, '',  '',
							stop.location_en, '', '',
							stop.x, stop.y, lat, lon,
							stop.fare,
							0, 0,
							() => jobs-- );
						jobs --;
					}); // hk80.get_latlon
				});	// stops.forEach
				jobs --;
			});	// datasrc.get_stops
		}
		jobs --;
	}); // datasrc.get_bounds
}

update_route(kmb, process.argv[2]);

setInterval(()=>{
	console.log("Outstanding Jobs: " + jobs);
	if (jobs==0) process.exit();
}, 1000);

})();
/**
 * Fetch bus stops of a route and store into database
 * usage  : nodejs kmb_updateroutes.js config.json route
 * example: nodejs kmb_updateroutes.js config.json 12A
 */
 
'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB  = require('./datasrc/kmb');
const HK80 = require('./datasrc/hk80');

var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();
var hk80 = new HK80();

function update_route(datasrc,route) {
	datasrc.get_bounds(route, (bounds) => {
		for (var bound of bounds) {
			console.log("Route " + route + ", bound: " + bound);
			datasrc.get_stops(route, bound, (route) => {
				route['routeStops'].forEach((stop)=> {
					hk80.get_latlon(stop['X'], stop['Y'], (lat,lon) => {
		  				db.busstop_set(
	    					stop['Route'], stop['Bound'], stop['Seq'], stop['BSICode'],
							// stop['EName'], stop['CName'], stop['SCName'],
							// stop['ELocation'], stop['CLocation'], stop['SCLocation'],
							stop['EName'], '',  '',
							stop['ELocation'], '', '',
							stop['X'], stop['Y'], lat, lon,
							stop['AirFare'],
							0, 0);
					}); // hk80.get_latlon
				});	// route['routeStops'].forEach
			});	// datasrc.get_route
		}
	}); // datasrc.get_bounds
}

update_route(kmb, process.argv[3]);

// for some reason mysql didn't release, we exit after 5s
setTimeout(() => {
	process.exit();
}, 5000);

})();
/**
 * Update arrival estimation of a route listed from database
 * usage  : nodejs kmb_updateeta.js config.json route bound
 * example: nodejs kmb_updateeta.js config.json 12A 1
 */
 
'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB  = require('./datasrc/kmb');

var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();

function update_eta(datasrc,route,bound) {
	db.busstop_list(route,bound,(stops) => {
		stops.forEach((stop) => {
			console.log("Route: " + route + ", Bound: " + bound + "Index: " + stop["index"] + ", BSI: " + stop["bsicode"]);
			datasrc.get_eta(route,bound,stop["index"],stop["bsicode"],(eta) => {
				var eta_list = eta.join(",");
				db.busstop_seteta(route,bound,stop["index"],eta_list);
				console.log("ETA: "+stop["bsicode"]+": "+eta_list);
			}); // datasrc.get_eta
		}); // stops.forEach
	}); // db.busstop_list
}

function update_route(datasrc,route) {
	jobs ++;
	datasrc.get_bounds(route, (bounds) => {
		for (var bound of bounds) {
			console.log("Route " + route + ", bound: " + bound);
			datasrc.get_stops(route, bound, (route) => {
				console.log(route['basicInfo']);
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
						update_eta(datasrc,stop['Route'],stop['Bound'],stop['Seq'],stop['BSICode']);
					}); // hk80.get_latlon
				});	// route['routeStops'].forEach
			});	// datasrc.get_route
		}
		jobs --;
	}); // datasrc.get_bounds
}

update_eta(kmb, process.argv[3], process.argv[4]);

// for some reason mysql didn't release, we exit after 5s
setTimeout(() => {
	process.exit();
}, 5000);

})();
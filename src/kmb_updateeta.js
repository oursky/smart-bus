/**
 * Update arrival estimation of a route listed from database
 * usage  : nodejs kmb_updateeta.js route bound
 * example: nodejs kmb_updateeta.js 12A 1
 */
 
'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB  = require('./datasrc/kmb');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();

function update_eta(datasrc,route,bound) {
	db.busstop_list(route,bound,(stops) => {
		stops.forEach((stop) => {
			console.log("Route: " + route + ", Bound: " + bound + "Seq: " + stop.seq + ", BSI: " + stop.bsicode);
			datasrc.get_eta(route,bound,stop.seq,stop.bsicode,(eta) => {
				var eta_list = eta.join(",");
				db.busstop_seteta(route,bound,stop.seq,eta_list);
				console.log("ETA: " + stop.bsicode + ": " + eta_list);
			}); // datasrc.get_eta
		}); // stops.forEach
	}); // db.busstop_list
}

update_eta(kmb, process.argv[2], process.argv[3]);

})();
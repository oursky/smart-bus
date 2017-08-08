'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB = require('./grabber/kmb');

var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();
var jobs = 0;

function update_eta(grabber,route,bound,index,bsicode) {
    jobs++;
	grabber.get_eta(route,bound,index,bsicode,(eta) => {
		var eta_list = '';
		for (var item of eta['response']) {
			eta_list += item['ex'] + ",";
		}
		jobs ++;
		db.busstop_seteta(route,bound,index,eta_list, ()=>jobs--);

		jobs --;
		console.log("ETA: "+bsicode+": "+eta_list);
	});
}

function update_route(grabber,route) {
	jobs ++;
	grabber.get_bounds(route, (bounds) => {
		for (var bound of bounds) {
			console.log("Route " + route + ", bound: " + bound);
			grabber.get_stops(route, bound, (route) => {
				console.log(route['basicInfo']);
				route['routeStops'].forEach((stop)=> {
				jobs++;
  				db.busstop_set(
	    				stop['Route'], stop['Bound'], stop['Seq'], stop['BSICode'],
						// stop['EName'], stop['CName'], stop['SCName'],
						// stop['ELocation'], stop['CLocation'], stop['SCLocation'],
						stop['EName'], '',  '',
						stop['ELocation'], '', '',
						stop['X'], stop['Y'],
						stop['AirFare'],
						0, 0, ()=>jobs--);

					var bsicode = stop['BSICode'].replace(/-/g, '');
					update_eta(grabber,stop['Route'],stop['Bound'],stop['Seq'],bsicode);

				});	// route['routeStops'].forEach
			});	// grabber.get_route
		}
		jobs --;
	}); // grabber.get_bounds
}

update_route(kmb, '12A');

// Exit if finished all jobs
setTimeout(() => {
	if (jobs==0) process.exit();
}, 1000);

})();
'use strict';
(function(){

const fs = require('fs');
const Database = require('./datastore/database');
const KMB = require('./grabber/kmb');

var config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var db = new Database(config['database']);
var kmb = new KMB();

kmb.get_route('12A', '1', (route) => {
	console.log(route['basicInfo']);
	route['routeStops'].forEach((stop)=> {
    	db.busstop_set(stop['Route'], stop['Bound'], stop['Seq'], stop['BSICode'],
			// stop['EName'], stop['CName'], stop['SCName'],
			// stop['ELocation'], stop['CLocation'], stop['SCLocation'],
			stop['EName'], '',  '',
			stop['ELocation'], '', '',
			stop['X'], stop['Y'],
			stop['AirFare'],
			0, 0);
			
		var bsicode = stop['BSICode'].replace(/-/g, '');
		kmb.get_eta(stop['Route'], stop['Bound'], stop['Seq'], bsicode, (eta) => {
			var eta_list = '';
			for (var item of eta['response']) {
				eta_list += item['ex'] + ",";
			}
			db.busstop_seteta(stop['Route'], stop['Bound'], stop['Seq'], eta_list);
			// console.log(eta);
			console.log("R:"+bsicode+":"+eta_list);
		});
	});
});

})();
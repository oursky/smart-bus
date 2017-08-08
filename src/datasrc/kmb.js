/**
 * Fetch data from KMB
 *
 * https://http://search.kmb.hk/KMBWebSite/
 */
module.exports = (function(){
const http = require('http');

class KMBGrabber {
	constructor() {
	}
    /**
     * Get bounds of a route
     * @public
     * @param {!string} route    Route Id, e.g. 12A
     * @param {!function(Array<number>)} cb void callback(bounds)
     * @return {undefined} No return value
     */
     get_bounds(route, cb) {
	    return http.get({
    	    hostname: 'search.kmb.hk',
        	path: '/KMBWebSite/Function/FunctionRequest.ashx?action=getroutebound&route=' + route
    	}, (response) => {
        	var body = '';
        	response.on('data', (d) => { body += d;} );
	        response.on('end', () => {
	        	var json = JSON.parse(body);
	        	var list = [];
	        	if (json['result']) {
					for (var item of json['data']) {
						list.push(parseInt(item['BOUND']));
					}
				}
				cb(list);
        	});
	    });
	}
    /**
     * Get bus-stops of a route
     * @public
     * @param {!string} route     Route Id, e.g. 12A
     * @param {!number} bound     1 for forward, 2 for reverse
     * @param {!function(Object,Array<Object>)} cb void callback(basic,stops)
     * @return {undefined} No return value
     */
	get_stops(route, bound, cb) {
	    return http.get({
    	    hostname: 'search.kmb.hk',
        	path: '/KMBWebSite/Function/FunctionRequest.ashx?action=getstops&route=' + route + '&bound=' + bound + '&serviceType=1'
    	}, (response) => {
        	var body = '';
        	response.on('data', (d) => { body += d;} );
	        response.on('end', () => {
	        	var json = JSON.parse(body);
	        	var jbasic = json['data']['basicInfo'];
	        	var basic = {
	        		origin_en : jbasic['OriEName'],
	        		origin_tc : jbasic['OriCName'],
	        		origin_sc : jbasic['OriSCName'],
	        		dest_en   : jbasic['DestEName'],
	        		dest_tc   : jbasic['DestCName'],
	        		dest_sc   : jbasic['DestSCName'],
	        		racecourse: (jbasic['Racecourse']=='Y'),
	        		special   : (jbasic['Special']=='Y'),
	        		overnight : (jbasic['Overnight']=='Y'),
	        		airport   : (jbasic['Airport']=='Y'),
	        	};
	        	var stops = [];
	        	for (var stop of json['data']['routeStops']) {
	        		stops.push({
	        			route: stop['Route'],
	        			bound: stop['Bound'],
	        			seq  : stop['Seq'],
	        			bsicode: stop['BSICode'],
	        			name_en: stop['EName'],
	        			name_tc: stop['CName'],
	        			name_sc: stop['SCName'],
	        			location_en: stop['ELocation'],
	        			location_tc: stop['CLocation'],
	        			location_sc: stop['SCLocation'],
	        			x          : stop['X'],
	        			y          : stop['Y'],
	        			fare       : stop['AirFare'],
	        		});
	        	}
	        	cb(basic, stops);
        	});
	    });
	}
    /**
     * Get arrival estimation of a route for a specific bus stop
     * @public
     * @param {!string} route     Route Id, e.g. 12A
     * @param {!number} bound     1 for forward, 2 for reverse
     * @param {!number} seq       sequence of bus stop from get_stops() entry
     * @param {!string} bsicode   BSIcode from get_stops() entry. in format X0000-X-000-1
     * @param {!function(Array<string>)} cb void callback(timeStrings)
     * @return {undefined} No return value
     */
	get_eta(route, bound, seq, bsicode, cb) {
		bsicode = bsicode.replace(/-/g, '');	// chop - characters

		var now = new Date();
		var utc = now.getTime();
		var ms = utc % 100;
		var timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '')+'.'+ms+'.';
		
		var sep = "--31" + timestamp + "13--";
		var token = route + sep + bound + sep + "1" + sep + bsicode + sep + seq + sep + utc;
		var token64 = "EA" + new Buffer(token).toString('base64');
		var postData = "token="+encodeURIComponent(token64)+"&t="+encodeURIComponent(timestamp);
		
		var options = {
    	    hostname: 'search.kmb.hk',
        	path: '/KMBWebSite/Function/FunctionRequest.ashx/?action=get_ETA&lang=1',
		    method: 'POST',
    		headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(postData)
			},
			form: {
				'token': token64,
				't': timestamp
			}
		};
	    var req = http.request(options, (response) => {
        	var body = '';
        	response.on('data', (d) => { body += d;} );
	        response.on('end', () => {
	        	var json = JSON.parse(body);
	        	var list = [];
       			for (var item of json['data']['response']) {
					list.push(item['ex']);
				}
	        	cb(list);
        	});
	    });
	    req.write(postData);
		req.end();
	}
}

// EXPORTS
// ------------------------------------------------
return KMBGrabber;
}());   

module.exports = (function(){
const http = require('http');

class KMBGrabber {
	constructor() {
	}
	get_route(route, bound, cb) {
	    return http.get({
    	    hostname: 'search.kmb.hk',
        	path: '/KMBWebSite/Function/FunctionRequest.ashx?action=getstops&route=' + route + '&bound=' + bound + '&serviceType=1'
    	}, (response) => {
        	var body = '';
        	response.on('data', (d) => { body += d;} );
	        response.on('end', () => {
	        	var json = JSON.parse(body);
	        	cb(json['data']);
        	});
	    });
	}
	get_eta(route, bound, index, bsicode, cb) {
		var now = new Date();
		var utc = now.getTime();
		var ms = utc % 100;
		var timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '')+'.'+ms+'.';
		
		var sep = "--31" + timestamp + "13--";
		var token = route + sep + bound + sep + "1" + sep + bsicode + sep + index + sep + utc;
		var token64 = "EA" + new Buffer(token).toString('base64');
		var postData = "token="+encodeURIComponent(token64)+"&t="+encodeURIComponent(timestamp);
		
		console.log("Time: " + timestamp + ", utc: " + utc);
		console.log("Token: " + token);
		console.log("Token: " + token64);
		console.log("Post: " + postData);
	
		
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
	        	cb(json['data']);
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

/**
 * Convert HK80 x,y to lat,lon
 *
 * https://www.geodetic.gov.hk/smo/gsi/programs/en/GSS/grid/transformation.htm
 * http://www.geodetic.gov.hk/transform/tformAPI_manual.pdf
 */ 
module.exports = (function(){
const http = require('http');

class HK80Convertor {
	constructor() {
	}
    /**
     * Set Bus-stop Information
     * @public
     * @param {!string} route_id Route Id, e.g. 12A
     * @param {!number} x        x coordinate in HK80
     * @param {!number} y	     y coordinate in HK80
     * @param {!function(number,number)} cb void callback(lat,lon)
     * @return {undefined} No return value
     */
	get_latlon(x,y,cb) {
		// TODO: handle error
	    return http.get({
    	    hostname: 'www.geodetic.gov.hk',
        	path: '/transform/tformAPI.aspx?ver=1&hke='+x+'&hkn='+y
    	}, (response) => {
        	var body = '';
        	response.on('data', (d) => { body += d;} );
	        response.on('end', () => {
	        	var latlon = body.split(","); 
				cb(latlon[0],latlon[1]);
        	});
	    });
	}
}

// EXPORTS
// ------------------------------------------------
return HK80Convertor;
}());   

module.exports = (function(){
const distance = require('../../util/distance.js');
/**
 * @api {post} /bus_list List bus
 * @apiName bus_list
 * @apiGroup bus
 * @apiDescription List bus for a route.
 *
 * @apiParam {String} route Bus Route
 * @apiExample {json} Example
 *     {
 *       "route": "12A"
 *     }
 *
 * @apiSuccessExample {json} SUCCESS
 *     HTTP/1.1 200 OK
 *     {
 *     }
 *
 * @apiError INVALID_PARAM Invalid parameter
 * @apiErrorExample {json} INVALID_PARAM
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "INVALID_PARAM"
 *     }
 * @apiError FAIL Failed
 * @apiErrorExample {json} FAIL
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "FAIL"
 *     }
 */
function handler(req,res) {
    if (!("route" in req.body)) {
        res.status(403).json({"error":"INVALID_PARAM"});
        return;
    }
    var route = req.body["route"];
    var bound = parseInt(req.body["bound"]);
    var now = new Date();
    this._db.busstop_list(route,(stops) => {
        var buses = [];
        for (var stopIndex=0; stopIndex<stops.length-1; stopIndex++) {
            var fromstop = stops[stopIndex];
            var tostop = stops[stopIndex+1];
            if (fromstop.bound!=tostop.bound) continue;
            
            fromstop.path.push([tostop.lat, tostop.lng]);
            
            var total_distance = 0;
            for (var i=0; i<fromstop.path.length-1; i++) {
                var d = distance(fromstop.path[i][0], fromstop.path[i][1], fromstop.path[i+1][0], fromstop.path[i+1][1]);
                fromstop.path[i].distance = d;
                total_distance += d;
            }

            for (var eta of tostop.eta.split(',')) {
                var T = new Date(eta.replace(/-/g, '/'));
                var dT = T.getTime() - now.getTime();
                
                // assume 15 minutes schedule
                // TODO: fetch schedule table from KMB
                var schedule_time = 15*60*1000;
                if (dT <0 || dT> schedule_time) continue;
                var progress = (schedule_time-dT) / schedule_time;
                var busPosition = { lat: fromstop.path[0].lat, lng: fromstop.path[0].lng };
                
                var travelled = total_distance * progress;
                for (var i=0; i<fromstop.path.length-1; i++) {
                    if (travelled < fromstop.path[i].distance) {
                        busPosition.lat = fromstop.path[i][0] + (fromstop.path[i+1][0] - fromstop.path[i][0]) * travelled/fromstop.path[i].distance;
                        busPosition.lng = fromstop.path[i][1] + (fromstop.path[i+1][1] - fromstop.path[i][1]) * travelled/fromstop.path[i].distance;
                        break;
                    } else {
                        travelled -= fromstop.path[i].distance;
                    }
                }
                buses.push({
                    bound: tostop.bound,
                    eta: eta,
                    dT : parseInt(dT/1000),
                    progress: progress,
                    lat: busPosition.lat,
                    lng: busPosition.lng
                });
            }
        }
        res.json({
                    route: route,
                    buses: buses
                });
    });
}
// EXPORTS
// -----------------------------------------------------------------
return {
    handler: handler
};
}());

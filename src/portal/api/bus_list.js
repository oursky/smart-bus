module.exports = (function(){
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
        for (var i=0; i<stops.length-1; i++) {
            var fromstop = stops[i];
            var tostop = stops[i+1];
            if (fromstop.bound!=tostop.bound) continue;
            if (fromstop.seq==0) continue;
            
            for (var eta of tostop.eta.split(',')) {
                var T = new Date(eta.replace(/-/g, '/'));
                var dT = T.getTime() - now.getTime();
                
                // assume 15 minutes schedule
                // TODO: fetch schedule table from KMB
                var schedule_time = 15*60*1000;
                if (dT <0 || dT> schedule_time) continue;
                var progress = dT / schedule_time;

                buses.push({
                    bound: tostop.bound,
                    eta: eta,
                    dT : parseInt(dT/1000),
                    progress: progress,
                    lat: fromstop.lat + (tostop.lat - fromstop.lat) * progress,
                    lon: fromstop.lon + (tostop.lon - fromstop.lon) * progress
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

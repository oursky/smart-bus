module.exports = (function(){
/**
 * @api {post} /bus_stop_list List bus stops
 * @apiName bus_stop_list
 * @apiGroup bus
 * @apiDescription List bus stop for a route.
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
    this._db.busstop_list(route,(stops) => {
        if (stops) {
            res.json({
                        route: route,
                        stops: stops
                    });
        } else {
            res.status(403).json({"error":"FAIL"});
        }
    });
}
// EXPORTS
// -----------------------------------------------------------------
return {
    handler: handler
};
}());

module.exports = (function(){
const mysql = require('mysql');

class Database {
	constructor(config) {
		this._pool = mysql.createPool(config);
	}
	
    /**
     * Set Bus-stop Information
     * @public
     * @param {!string} route_id Route Id, e.g. 12A
     * @param {!number} bound    Bound type, 1: normal, 2: reverse
     * @param {!number} index    Index of bus stop, start from 0
     * @param {!string} bsicode  BSICode
     * @param {!string} name_en  Name of bus stop (English)
     * @param {!string} name_tc  Name of bus stop (Trad Chinese)
     * @param {!string} name_sc  Name of bus stop (Simplified Chinese)
     * @param {!string} location_en  Location of bus stop (English)
     * @param {!string} location_tc  Location of bus stop (Trad Chinese)
     * @param {!string} location_sc  Location of bus stop (Simplified Chinese)
     * @param {!number} x            Location of bus stop
     * @param {!number} y            Location of bus stop
     * @param {!number} fare         Fare
     * @param {!number} bound_time1  Bound time
     * @param {!number} bound_time2  Bound time
     * @param {!function(boolean)} cb void callback(success)
     * @return {undefined} No return value
     */
     busstop_set(route_id, bound, index, bsicode,
				name_en, name_tc, name_sc,
				location_en, location_tc, location_sc,
				x, y,
				fare,
				bound_time1, bound_time2, cb) {
        var sql = "CALL sp_busstop_set(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var param = [route_id, parseInt(bound), parseInt(index), bsicode,
						name_en, name_tc, name_sc,
						location_en, location_tc, location_sc,
						x, y,
						fare,
						bound_time1, bound_time2];
        this._pool.query(sql, param, (err,rows,fields) => {
            if (err) {
                console.log(sql + param + err);
                if (cb) cb(false);
            } else {
                if (cb) cb(true);
            }
        });
    }
    /**
     * Set Bus-stop ETA
     * @public
     * @param {!string} route_id Route Id, e.g. 12A
     * @param {!number} bound    Bound type, 1: normal, 2: reverse
     * @param {!number} index    Index of bus stop, start from 0
     * @param {!string} eta      Comma separated eta, in minute
     * @param {!function(boolean)} cb void callback(success)
     * @return {undefined} No return value
     */
     busstop_seteta(route_id, bound, index, eta, cb) {
        var sql = "CALL sp_busstop_seteta(?,?,?,?)";
        var param = [route_id, parseInt(bound), parseInt(index), eta];
        this._pool.query(sql, param, (err,rows,fields) => {
            if (err) {
                console.log(sql + param + err);
                if (cb) cb(false);
            } else {
                if (cb) cb(true);
            }
        });
    }
};

// EXPORTS
// ------------------------------------------------
return Database;
}());   

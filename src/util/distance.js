module.exports = (function(){
function distance(lat1, lng1, lat2, lng2) {
    var x1 = lat1 * 3.1415926 / 180;
    var y1 = lng1 * 3.1415926 / 180;
    var x2 = lat2 * 3.1415926 / 180;
    var y2 = lng2 * 3.1415926 / 180;
    var t1 = Math.sin(y1) * Math.sin(y2);
    var t2 = Math.cos(y1) * Math.cos(y2);
    var t3 = Math.cos(x1 - x2);
    var t4 = t2 * t3;
    var t5 = t1 + t4;
    var rad_dist = Math.atan(-t5/Math.sqrt(-t5 * t5 +1)) + 2 * Math.atan(1.0);
    var mile = rad_dist * 3437.74677 * 1.1508;
    var meter = mile * 1609.3470878864446;
    return meter;
}
// EXPORTS
// -----------------------------------------------------------------
return distance;
}());

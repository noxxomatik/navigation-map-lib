/**
 * Created by Sven Otte on 02.01.2017.
 */

// calculated pose of the ROV
function Pose() {
    // position in world space of visualization
    this.x;
    this.y;
    this.z;
    // depth for accuracy checks
    this.depth;
    // orientation from navdata
    this.roll;  // roll around x-axis in radians
    this.pitch; // pitch around y-axis in radians
    this.yaw;   // yaw around z-axis in radians
    // calculated translation along the axis
    this.transX;
    this.transY;
    this.transZ;
    // calculated velocity
    this.veloX;
    this.veloY;
    this.veloZ;
    // timestamp
    this.timestamp;
    // clone function
    this.clone = function() {
        var pose = new Pose();
        pose.x = this.x;
        pose.y = this.y;
        pose.z = this.z;
        pose.depth = this.depth;
        pose.roll = this.roll;
        pose.pitch = this.pitch;
        pose.yaw = this.yaw;
        pose.transX = this.transX;
        pose.transY = this.transY;
        pose.transZ = this.transZ;
        pose.veloX = this.veloX;
        pose.veloY = this.veloY;
        pose.veloZ = this.veloZ;
        pose.timestamp = this.timestamp;
        return pose;
    }
}

// OpenROV navdata object
function Navdata(roll, pitch, yaw, thrust, depth, heading, acclx, accly, acclz, magx, magy, magz, gyrox, gyroy, gyroz, lacclx, laccly, lacclz, gravx, gravy, gravz, timestamp) {
    this.roll = roll;
    this.pitch = pitch;
    this.yaw = yaw;
    this.thrust = thrust;
    this.depth = depth;
    this.heading = heading;
    this.acclx = acclx;
    this.accly = accly;
    this.acclz = acclz;
    this.magx = magx;
    this.magy = magy;
    this.magz = magz;
    this.gyrox = gyrox;
    this.gyroy = gyroy;
    this.gyroz = gyroz;
    this.lacclx = lacclx;
    this.laccly = laccly;
    this.lacclz = lacclz;
    this.gravx = gravx;
    this.gravy = gravy;
    this.gravz = gravz;
    this.timestamp = timestamp
}

// buoy position
function Buoy() {
    this.coordinates = {
        lat: null,
        lon: null,
        // accuracy of signal in meters
        accuracy: null
    };
    this.position = {
        x: null,
        y: null,
        // distance in m
        distance: null,
        // bearing in radians (counterclockwise from north)
        bearing: null
    };
    this.clone = function() {
        var buoy = new Buoy();
        buoy.coordinates.lat = this.coordinates.lat;
        buoy.coordinates.lon = this.coordinates.lon;
        buoy.coordinates.accuracy = this.coordinates.accuracy;
        buoy.position.x = this.position.x;
        buoy.position.y = this.position.y;
        buoy.position.distance = this.position.distance;
        buoy.position.bearing = this.position.bearing;
        return buoy;
    }
}

function NavMapCalc(integrationMethod) {
    this.integrationMethod = integrationMethod != undefined ? integrationMethod : new NoFilter(false, null, null);
    this.calculateNextPose = this.integrationMethod.calculateNextPose;
    this.calculateNextBuoyPosition = this.integrationMethod.calculateNextBuoyPosition;
}

/* filter for GPS/INS integration */
// no filter (default)
function NoFilter() {
    var pose = new Pose();
    var dataHistory = [];
    var buoy = new Buoy();
    var buoyHistory = [];

    // calculate the next pose from navdata
    this.calculateNextPose = function(navdata, callback) {
        var newPose = new Pose();

        // first pose
        if (dataHistory.length < 1) {
            // pass the depth if it is given
            newPose.depth = navdata.depth != null ? navdata.depth : 0;

            // orientation
            newPose.roll = navdata.roll * (Math.PI / 180);
            newPose.pitch = - (navdata.pitch * (Math.PI / 180));
            newPose.yaw = - (navdata.yaw * (Math.PI / 180));      // clockwise

            // translation (not calculable because of missing time reference)
            newPose.transX = 0;
            newPose.transY = 0;
            newPose.transZ = 0;

            // velocity
            newPose.veloX = 0;
            newPose.veloY = 0;
            newPose.veloZ = 0;

            // timestamp
            newPose.timestamp = navdata.timestamp;
        }
        // calculate the next pose
        else {
            // get last pose
            var oldPose = dataHistory[dataHistory.length - 1];

            // timestamp
            newPose.timestamp = navdata.timestamp;

            // elapsed time in seconds
            var t = (newPose.timestamp - oldPose.timestamp) / 1000;

            // pass the depth if it is given
            newPose.depth = navdata.depth != null ? navdata.depth : 0;

            // orientation
            newPose.roll = navdata.roll * (Math.PI / 180);
            newPose.pitch = - (navdata.pitch * (Math.PI / 180));
            newPose.yaw = - (navdata.yaw * (Math.PI / 180));

            // translation ((a * Math.pow(t)) / 2 + vo * t)
            newPose.transX = (navdata.lacclx * Math.pow(t, 2)) / 2 + oldPose.veloX * t;
            newPose.transY = (navdata.laccly * Math.pow(t, 2)) / 2 + oldPose.veloY * t;
            newPose.transZ = -((navdata.lacclz * Math.pow(t, 2)) / 2 + oldPose.veloZ * t); // z is facing down

            // velocity (a * t + v0)
            newPose.veloX = navdata.lacclx * t + oldPose.veloX;
            newPose.veloY = navdata.laccly * t + oldPose.veloY;
            newPose.veloZ = navdata.lacclz * t + oldPose.veloZ;
        }
        // save in data history
        dataHistory.push(newPose.clone());

        return newPose.clone();
    };

    // calculates the next buoy position from coordinates
    this.calculateNextBuoyPosition = function(lat, lon, accuracy, callback) {
        // first position
        if (buoyHistory.length < 1) {
            buoy.coordinates.lat = parseFloat(lat);
            buoy.coordinates.lon = parseFloat(lon);
            buoy.coordinates.accuracy = parseFloat(accuracy);

            buoy.position.x = 0;
            buoy.position.y = 0;
        }
        else {
            buoy.coordinates.lat = parseFloat(lat);
            buoy.coordinates.lon = parseFloat(lon);
            buoy.coordinates.accuracy = parseFloat(accuracy);

            // get distance an bearing
            var firstLatLon = new LatLon(buoyHistory[0].coordinates.lat, buoyHistory[0].coordinates.lon);
            var newLatLon = new LatLon(parseFloat(lat), parseFloat(lon));
            buoy.position.distance = firstLatLon.distanceTo(newLatLon);
            buoy.position.bearing = firstLatLon.finalBearingTo(newLatLon) * (Math.PI / 180);
        }
        // save in history
        buoyHistory.push(buoy.clone());

        return buoy.clone();
    };

    // calculate the next virtual buoy coordinates from the ROV pose
    this.calculateNextBuoyCoordinates = function(pose) {
        var distance = Math.sqrt(Math.pow(pose.x, 2) + Math.pow(pose.y, 2));
        var bearing = pose.yaw;
        var firstLatLon = new LatLon(buoyHistory[0].coordinates.lat, buoyHistory[0].coordinates.lon);
        var newLatLon = firstLatLon.destinationPoint(distance, bearing);
        var buoy = new Buoy();
        buoy.coordinates.lat = newLatLon.lat;
        buoy.coordinates.lon = newLatLon.lon;
        // save in history
        buoyHistory.push(buoy.clone());
    };

    this.getBuoyHistory = function() {
        return buoyHistory;
    };
}
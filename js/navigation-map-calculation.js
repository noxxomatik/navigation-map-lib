/**
 * All required calculation objects of the navigation-map-lib framework.
 * @author Sven Otte
 * @module navigation-map-calculation
 */

/**
 * This object represents the calculated pose of the ROV
 * @constructor
 */
function Pose() {
    /** Position x in world space of visualization.*/
    this.x;
    /** Position y in world space of visualization.*/
    this.y;
    /** Position z in world space of visualization.*/
    this.z;
    /** Depth of ROV for accuracy checks.*/
    this.depth;
    /** Roll around the x-axis in radians.*/
    this.roll;
    /** Pitch around the y-axis in radians.*/
    this.pitch;
    /** Yaw around the z-axis in radians.*/
    this.yaw;
    /** Calculated translation along the x-axis.*/
    this.transX;
    /** Calculated translation along the y-axis.*/
    this.transY;
    /** Calculated translation along the z-axis.*/
    this.transZ;
    /** Calculated velocity along the x-axis.*/
    this.veloX;
    /** Calculated velocity along the y-axis.*/
    this.veloY;
    /** Calculated velocity along the z-axis.*/
    this.veloZ;
    /** timestamp of measured values.*/
    this.timestamp;
    /**
     * Clones the object.
     * @returns {Pose} The cloned ROV pose object.
     */
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

/**
 * This object represents all measured sensor data at a current timestamp.
 * @param roll
 * @param pitch
 * @param yaw
 * @param thrust
 * @param depth
 * @param hdgd
 * @param acclx
 * @param accly
 * @param acclz
 * @param magx
 * @param magy
 * @param magz
 * @param gyrox
 * @param gyroy
 * @param gyroz
 * @param lacclx
 * @param laccly
 * @param lacclz
 * @param gravx
 * @param gravy
 * @param gravz
 * @param timestamp
 * @constructor
 */
function Navdata(roll, pitch, yaw, thrust, depth, hdgd, acclx, accly, acclz, magx, magy, magz, gyrox, gyroy, gyroz, lacclx, laccly, lacclz, gravx, gravy, gravz, timestamp) {
    this.roll = roll;
    this.pitch = pitch;
    this.yaw = yaw;
    this.thrust = thrust;
    this.depth = depth;
    this.hdgd = hdgd;
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

/**
 * This object represents the calculated or measured buoy position.
 * @constructor
 */
function Buoy() {
    /**
     * The coordinates of the buoy in latitude and longitude.
     */
    this.coordinates = {
        lat: null,
        lon: null,
        // accuracy of signal in meters
        accuracy: null
    };
    /**
     * The position of the buoy in the visualisation.
     */
    this.position = {
        x: null,
        y: null,
        // distance in m
        distance: null,
        // bearing in radians (counterclockwise from north)
        bearing: null
    };
    /**
     * Clones the object.
     * @returns {Buoy} Cloned buoy object.
     */
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

/**
 * Gathers all available sensor data and calculates the pose of the ROV.
 * @param integrationMethod - The chosen integration method to calculate the pose.
 * @constructor
 */
function NavMapCalc(integrationMethod) {
    /**
     * The chosen integration method. Default is NoFilter.
     */
    this.integrationMethod = integrationMethod != undefined ? integrationMethod : new NoFilter(false, null, null);
    /**
     * Calculates the next ROV pose.
     */
    this.calculateNextPose = this.integrationMethod.calculateNextPose;
    /**
     * Calculates the next buoy position.
     */
    this.calculateNextBuoyPosition = this.integrationMethod.calculateNextBuoyPosition;
}

/* filter for GPS/INS integration */
/**
 * Default integration method with unfiltered sensor values. Can be used as template for other integration methods.
 * @constructor
 */
function NoFilter() {
    /**
     * Last calculated pose.
     * @type {Pose}
     */
    var pose = new Pose();
    /**
     * All past navdata objects.
     * @type {Array}
     */
    var dataHistory = [];
    /**
     * Last buoy position.
     * @type {Buoy}
     */
    var buoy = new Buoy();
    /**
     * All past buoy positions.
     * @type {Array}
     */
    var buoyHistory = [];

    /**
     * Calculates the next ROV pose from the gathered sensor data.
     * @param {Navdata} navdata - The navdata object from the event loop.
     * @param callback - Callback function.
     */
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

    /**
     * Calculates the next buoy position from given coordinates.
     * @param lat - Latitude.
     * @param lon - Longitude.
     * @param accuracy - Accuracy of GPS receiver.
     * @param callback - Callback function.
     * @returns {Buoy} Calculated buoy position.
     */
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

    /**
     * Calculates virtual buoy coordinates from last known coordinates, ROV pose, bearing and travelled distance.
     * Saves the new buoy object to the history.
     * @param {Pose} pose - Current ROV pose.
     */
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

    /**
     * Returns the complete history of gathered buoy positions.
     * @returns {Array} All gathered buoy positions.
     */
    this.getBuoyHistory = function() {
        return buoyHistory;
    };
}
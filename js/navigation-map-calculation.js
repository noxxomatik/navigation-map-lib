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

function NavMapCalc() {
    var pose = new Pose();
    var dataHistory = [];

    // calculate the next pose
    this.calculateNextPose = function(navdata, filter) {
        /* mock values */
        //navdata.lacclx = 1;
        //navdata.laccly = 0;
        //navdata.lacclz = 0;

        var newPose = new Pose();

        // first pose
        if (dataHistory.length < 1) {
            // pass the depth if it is given
            newPose.depth = navdata.depth != null ? navdata.depth : 0;

            // orientation
            newPose.roll = navdata.roll * (Math.PI / 180);
            newPose.pitch = navdata.pitch * (Math.PI / 180);
            newPose.yaw = navdata.yaw * (Math.PI / 180);

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
        // no filter
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
            newPose.pitch = navdata.pitch * (Math.PI / 180);
            newPose.yaw = navdata.yaw * (Math.PI / 180);

            // translation ((a * Math.pow(t)) / 2 + vo * t)
            newPose.transX = (navdata.lacclx * Math.pow(t, 2)) / 2 + oldPose.veloX * t;
            newPose.transY = (navdata.laccly * Math.pow(t, 2)) / 2 + oldPose.veloY * t;
            newPose.transZ = (navdata.lacclz * Math.pow(t, 2)) / 2 + oldPose.veloZ * t;

            // velocity (a * t + v0)
            newPose.veloX = navdata.lacclx * t + oldPose.veloX;
            newPose.veloY = navdata.laccly * t + oldPose.veloY;
            newPose.veloZ = navdata.lacclz * t + oldPose.veloZ;
        }
        // save in data history
        dataHistory.push(newPose.clone());
        return newPose;
    };

    // returns pose of the ROV
    this.getNextPose = function() {
        return pose;
    }
}
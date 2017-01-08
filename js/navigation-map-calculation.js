/**
 * Created by Sven Otte on 02.01.2017.
 */

// calculated pose of the ROV
function Pose(x, y, z, roll, pitch, yaw) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.roll = roll;   // roll around x-axis in radians
    this.pitch = pitch; // pitch around y-axis in radians
    this.yaw = yaw;     // yaw around z-axis in radians
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
    var pose = new Pose(0, 0, 0, 0, 0, 0);
    var dataHistory = [];

    // calculate the next pose
    this.calculateNextPose = function(navdata, filter) {
        var newPose = new Pose(0, 0, 0, 0, 0, 0);
        // first pose
        if (dataHistory.length < 1) {            
            // position
            newPose.x = 0;
            newPose.y = 0;
            newPose.z = navdata.depth != null ? navdata.depth : 0;

            // orientation
            newPose.roll = navdata.roll * (Math.PI / 180);
            newPose.pitch = navdata.pitch * (Math.PI / 180);
            newPose.yaw = navdata.yaw * (Math.PI / 180);
        }
        else {
            // TODO: position and save last velocity
            // position
            newPose.x = 0;
            newPose.y = 0;
            newPose.z = navdata.depth != null ? navdata.depth : 0;

            // orientation
            newPose.roll = navdata.roll * (Math.PI / 180);
            newPose.pitch = navdata.pitch * (Math.PI / 180);
            newPose.yaw = navdata.yaw * (Math.PI / 180);
        }
        // save in data history
        dataHistory.push(new Pose(newPose.x, newPose.y, newPose.z, newPose.roll, newPose.pitch, newPose.yaw));
        pose = newPose;
        return pose;
    };

    // returns pose of the ROV
    this.getNextPose = function() {
        return pose;
    }
}
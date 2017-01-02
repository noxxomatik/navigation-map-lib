/**
 * Created by Sven Otte on 02.01.2017.
 */
var data;
var pose = new Pose(0, 0, 0, 0, 0, 0);

// calculated pose of the ROV
function Pose(x, y, z, roll, pitch, yaw) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.roll = roll;
    this.pitch = pitch;
    this.yaw = yaw;
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

// calculate the next pose
function calculateNextPose(navdata, filter) {
    data = navdata;

    pose.x = 0;
    pose.y = 0;
    pose.z = 0;
    pose.roll = navdata.roll;
    pose.pitch = navdata.pitch;
    pose.yaw = navdata.yaw;
}

// returns pose of the ROV
function getNextPose() {
    return pose;
}
/**
 * Created by Sven Otte on 02.01.2017.
 */
function NavMapVis() {
    var scene;
    var camera;
    var renderer;
    var poseHistory = [];
    var buoyHistory = [];
    var zoom = 1;

    // ROV size in meters
    var rovLength = 2;
    var rovWidth = 1;

    // ROV representation
    var rovMesh;

    this.init = function(rendererSelector) {
        // scene dimensions
        width = $(rendererSelector).width();
        height = $(rendererSelector).height();
        dim = width < height ? width : height;

        // scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(1, 1, 1);
        this.createWater();
        this.createROV();

        // camera
        camera = new THREE.PerspectiveCamera(75, 1.0, 1, 10000);
        camera.position.y = -50;
        camera.position.z = 50;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // compilation
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(dim, dim);

        // append renderer
        $(rendererSelector).append(renderer.domElement);
    };

    this.animate = function() {

        //requestAnimationFrame( animate );

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;
        renderer.render(scene, camera);

    };

    // adds the current ROV pose to the scene
    this.addROVPose = function(pose) {
        // create a ghost pose of the old pose and add it to the history
        if (poseHistory.length > 0) {
            var ghostPose = poseHistory[poseHistory.length - 1];
            this.createGhostROV(ghostPose);

            // draw a line to new pose
            var lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(new THREE.Vector3(ghostPose.x, ghostPose.y, ghostPose.z));
            lineGeometry.vertices.push(new THREE.Vector3(pose.x, pose.y, pose.z));
            var line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
        }
        // add the ROV mesh
        else {
            scene.add(rovMesh);
        }

        poseHistory.push(new Pose(pose.x, pose.y, pose.z, pose.roll, pose.pitch, pose.yaw));

        // set rov to the new pose
        rovMesh.matrix.setPosition(new THREE.Vector3(pose.x, pose.y, pose.z));
        rovMesh.setRotationFromEuler(new THREE.Euler(pose.roll, pose.pitch, pose.yaw, "XYZ"));
        rovMesh.matrixAutoUpdate = false;

        // set camaera to follow the ROV
        //camera.lookAt(rovMesh);

        renderer.render(scene, camera);
    };

    // create the water surface
    this.createWater = function() {
        var waterGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        var waterMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff, side: THREE.DoubleSide, transparent: true, opacity: 0.2});
        var water = new THREE.Mesh(waterGeometry, waterMaterial);
        scene.add(water);
    };

    // create the ROV representation
    this.createROV = function() {
        var geometry = new THREE.ConeGeometry(rovWidth, rovLength, 10);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});
        rovMesh = new THREE.Mesh(geometry, material);
    };

    // create a ghost ROV pose
    this.createGhostROV = function(pose) {
        var ghostGeometry = new THREE.ConeGeometry(rovWidth, rovLength, 10);
        var ghostMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.2});
        var ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
        ghost.matrix.setPosition(new THREE.Vector3(pose.x, pose.y, pose.z));
        ghost.setRotationFromEuler(new THREE.Euler(pose.roll, pose.pitch, pose.yaw));
        ghost.matrixAutoUpdate = false;
        scene.add(ghost);
    }

    this.zoomIn = function() {
        zoom += 0.1;
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    };

    this.zoomOut = function() {
        zoom -= 0.1;
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    };
}

/**
 * Created by Sven Otte on 02.01.2017.
 */
function NavMapVis() {
    var scene;
    var camera;
    var renderer;
    var geometry;
    var material;
    var mesh;

    this.init = function(rendererSelector) {
        width = $(rendererSelector).width();
        height = $(rendererSelector).height();

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
        camera.position.z = 1000;

        //geometry = new THREE.BoxGeometry( 200, 200, 200 );
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        //mesh = new THREE.Mesh( geometry, material );
        //scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );

        $(rendererSelector).append(renderer.domElement);
    };

    this.animate = function() {

        //requestAnimationFrame( animate );

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    };

    this.addROVPose = function() {
        var geometry = new THREE.ConeGeometry(5, 20, 32);
        var material = new THREE.MeshBasicMaterial({color: 0xffff00});
        var mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
        renderer.render( scene, camera );
    }
}

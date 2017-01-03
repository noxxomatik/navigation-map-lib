/**
 * Created by Sven Otte on 02.01.2017.
 */
function NavMapVis() {
    this.scene;
    this.camera;
    this.renderer;
    this.geometry;
    this.material;
    this.mesh;

    this.init = function(rendererSelector) {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        $(rendererSelector).append(renderer.domElement);
    };

    this.animate = function() {

        requestAnimationFrame( this.animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    };
}

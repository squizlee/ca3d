/* global THREE, scene, renderer, camera */
var ambientlight;
var cameralight;

function createCube(r, color){
    var material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(color);
    material.wireframe = false;
    var geometry_cube = new THREE.BoxGeometry(r, r, r);
    var cube = new THREE.Mesh(geometry_cube, material);
    return cube;
}

function addLight() {
    cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.3);
    cameralight.castShadow = true;
    ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1);
    camera.add(cameralight);

    scene.add(ambientlight);
    //var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    //scene.add( spotLightHelper );
}

function addShapes() {
    scene.add(grid);
}
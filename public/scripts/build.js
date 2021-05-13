/* global THREE, scene, renderer, camera */

function createCube(r, color){
    var material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(color);
    material.wireframe = false;
    var geometry_cube = new THREE.BoxGeometry(r, r, r);
    var cube = new THREE.Mesh(geometry_cube, material);
    return cube;
}

function addShapes() {
    scene.add(grid);
}
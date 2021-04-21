/* global THREE, scene, renderer, camera */

var grid = new THREE.Group();

function createCube(r, color){
    var material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(color);
    material.wireframe = false;
    var geometry_cube = new THREE.BoxGeometry(r, r, r);
    var cube = new THREE.Mesh(geometry_cube, material);
    return cube;
}

// Creates a new grid with x and y
function createGrid(x, y, z, r){
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++){
            for (let k = 0; k < z; k++){
                var cube = createCube(r, 0xffffff);
                cube.position.x = i * r;
                cube.position.y = j * r;
                cube.position.z = k * r;
                grid.add(cube);
            }
            
        }   
    }
}

function addShapes() {
    scene.add(grid);
}
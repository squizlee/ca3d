/* global THREE */
//Declare Systen Variables and boilerplate

let scene;
let camera;
let renderer;
let controls;
let raycaster;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	raycaster = new THREE.Raycaster();

	scene = new THREE.Scene();
	var ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
	//camera.lookAt(0, 5, 0);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0.0,0.0,20);
    console.log("Check out the position", camera);
}

//Resize the scene and update the camera aspect to the screen ration
var resizeScene = function () {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.render(scene, camera);
};

function createBufferCube() {
	// let's just worry about positioning of the vertices
	const geometry = new THREE.BufferGeometry();

    // this just generates a single triangle for now
    const vertices = new Float32Array( [
        // front 
        -1, 1, 1,
        1, 1, 1,
        -1, -1, 1,
    ]);
    //BUG: The positioning of the mesh and camera are weird like wtf????

    // TODO: Index redundant vertices to reduce memory load

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    const mesh = new THREE.Mesh(geometry, material);
    console.log(mesh);
    scene.add(mesh);
    mesh.position.set(0, 0, 10);
}

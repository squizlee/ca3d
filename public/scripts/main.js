import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";

let scene;
let camera;
let renderer;
let controls;

// STATE MANAGEMENT
// State colors to be rendered
const STATE = {
	DEAD: {
		color: 0xff0000, // red
	},
	ALIVE: {
		color: 0x00ff00, // green
	},
};

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	scene = new THREE.Scene();
	let ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(0.0, 0.0, 20);

	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);
}

function createCube(){
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({wireframe: true});
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
}

function animate() {
	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

function main() {
	setScene();
	createCube();
	animate();
}
main();

//Resize the scene and update the camera aspect to the screen ration
var resizeScene = function () {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.render(scene, camera);
};
window.addEventListener("resize", resizeScene);

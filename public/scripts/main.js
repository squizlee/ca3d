import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RandomState, getChunk } from "./state.js";

let scene;
let camera;
let renderer;
let controls;
let visualGrid; // contains all cubes on the screen

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	scene = new THREE.Scene();
	let ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 200);
	renderer = new THREE.WebGLRenderer({powerPreference: "high-performance"});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(0.0, 0.0, 20);
	visualGrid = new THREE.Group(); 

	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);

	scene.add(visualGrid);
}

// position is a vector3
function createCube(position) {
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ wireframe: false});
	const cube = new THREE.Mesh(geometry, material);
	cube.matrixAutoUpdate = false; // experimental: the cubes do not change position/rotation/quarternion/scale
	visualGrid.add(cube);
	if (position) {
		cube.position.set(position.x, position.y, position.z);
		cube.updateMatrix();
	}

	if(position.x == 0 && position.y == 0 && position.z == 0){
		cube.material.color.setHex(0xff0000);
	}

	if(position.x == 0 && position.y == 1 && position.z == 0){
		cube.material.color.setHex(0x00ff00);
	}
	if(position.x == 0 && position.y == 0 && position.z == 1){
		cube.material.color.setHex(0x00ff00);
	}
}

function animate() {
	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

function main() {
	setScene();
	const GRID = RandomState(5, 5, 5);
	renderGridHack(GRID);
	animate();
}
main();

function renderGridHack(GRID) {
	let position = new THREE.Vector3();
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rowNum) => {
			row.forEach((columnEntry, index) => {
				if(columnEntry.state !== 0){
					position.set(index, rowNum, chunkLayer);
					createCube(position);
				}
			});
		});
	});
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
window.addEventListener("resize", resizeScene);

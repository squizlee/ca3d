import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RandomState, STATE, getChunk } from "./state.js";
import { GUI } from "../lib/dat.gui.module.js";

let scene;
let camera;
let renderer;
let controls;

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	scene = new THREE.Scene();
	let ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 200);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(0.0, 0.0, 20);

	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);
}

// position is a vector3
function createCube(position) {
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ wireframe: true});
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	if (position) {
		cube.position.set(position.x, position.y, position.z);
	}
}

function animate() {
	renderer.render(scene, camera);
	controls.update();

	requestAnimationFrame(animate);
}

function main() {
	setScene();
	const GRID = RandomState(20, 20, 20);
	renderGridHack(GRID);
	animate();
}
main();

const gui = new GUI()
const gridfolder = gui.addFolder("Grid")
//gridfolder.add(main().GRID.rotation, "x", 0, Math.PI * 2, 0.01)

function renderGridHack(GRID) {
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rowNum) => {
			row.forEach((columnEntry, index) => {
				if(columnEntry !== 0)
					createCube(new THREE.Vector3(index, rowNum, chunkLayer));
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

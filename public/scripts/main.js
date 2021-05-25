import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RandomState, getChunk} from "./state.js";
import { GUI } from "../lib/dat.gui.module.js";

let scene;
let camera;
let renderer;
let controls;
let visualGrid; // contains all cubes on the screen
let clock;

const RULES = {
	numSurvive: 2,
	numBorn: 1,
};

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

	clock = new THREE.Clock(false);
	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);

	scene.add(visualGrid);
}

// position is a vector3
function createCube(position, parameters) {
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ wireframe: true});
	const cube = new THREE.Mesh(geometry, material);
	cube.matrixAutoUpdate = false; // experimental: the cubes do not change position/rotation/quarternion/scale
	visualGrid.add(cube);
	if (position) {
		cube.position.set(position.x, position.y, position.z);
		cube.updateMatrix();
	}

	if(parameters.display === false) {
		cube.visible = false;
	}

	if(position.x == 0 && position.y == 0 && position.z == 0){
		cube.material.color.setHex(0xff0000);
	}

}

function animate() {
	renderer.render(scene, camera);
	controls.update();
	const updateTime = 1; // how often to update in seconds
	if(clock.getElapsedTime() >= updateTime) {
		changeState();
		clock.stop();
		clock.start();
	}
	requestAnimationFrame(animate);
}

function main() {
	setScene();
	const GRID = RandomState(23, 23, 23);
	renderGridHack(GRID);
	clock.start(); // start the clock before animating/changing state
	animate();
}
main();

function changeState() {
	// for each entry in the grid 
	//  	check neighbors: update
	// if dead deincrement all neighboring cubes
	// if born increment all neighboring cubes
	// if surviving do nothing
}

function renderGridHack(GRID) {
	let position = new THREE.Vector3();
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rowNum) => {
			row.forEach((columnEntry, index) => {
				position.set(index, rowNum, chunkLayer);
				if(columnEntry.state === 0 || columnEntry.num_neighbors === 6){
					createCube(position, {display: false});
				}else 
					createCube(position, {});
			});
		});
	});
}

const gui = new GUI()
const ruleFolder = gui.addFolder("Rule")
ruleFolder.add(RULES, "numBorn", -1, 6, 1)
ruleFolder.add(RULES, "numSurvive", -1, 6, 1)
ruleFolder.open()

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

import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RandomState, getChunk, mutateNeighbours } from "./state.js";
import { GUI } from "../lib/dat.gui.module.js";

let scene;
let camera;
let renderer;
let controls;
let visualGrid; // contains all cubes on the screen
let GRID; // contains the state for the entire automata
let clock;
let boundaryBox;
let boundaryEdge; // boundaryBox

const RULES = {
	numSurvive: 2,
	numBorn: 1,
};

const GRIDDIMENSIONS = {
	x: 10,
	y: 10,
	z: 10,
}

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	scene = new THREE.Scene();
	let ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 200);
	renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance" });
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

	createBoundaryBox();
	scene.add(boundaryEdge);
}

function createBoundaryBox() {
	// draw bounding box
	var geoBoundBox = new THREE.BoxGeometry(1, 1, 1);
	var matWire = new THREE.MeshBasicMaterial({
		color: 0x444444
	});
	boundaryBox = new THREE.Mesh(geoBoundBox, matWire);
	boundaryEdge = new THREE.BoxHelper(boundaryBox, 0x444444);
}

function resetBoundaryBox() {
	boundaryBox.scale.x = GRIDDIMENSIONS.x;
	boundaryBox.scale.y = GRIDDIMENSIONS.y;
	boundaryBox.scale.z = GRIDDIMENSIONS.z;
	boundaryEdge.update();
}

// position is a vector3
function createCube(position, parameters) {
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ wireframe: false });
	const cube = new THREE.Mesh(geometry, material);
	cube.matrixAutoUpdate = false; // experimental: the cubes do not change position/rotation/quarternion/scale
	visualGrid.add(cube);
	if (position) {
		cube.position.set(position.x, position.y, position.z);
		cube.updateMatrix();
	}

	if (parameters.display === false) {
		cube.visible = false;
	}

	if (position.x == 0 && position.y == 0 && position.z == 0) {
		cube.material.color.setHex(0xff0000);
	}

}

function animate() {
	renderer.render(scene, camera);
	controls.update();
	const updateTime = 1; // how often to update in seconds
	let updateQueue = []; // this queue will maintain a list of cubes to update visually (flip the visibility flag)
	if (clock.getElapsedTime() >= updateTime) {
		changeState(GRID, RULES, updateQueue);
		updateVisualGrid(updateQueue);
		clock.stop();
		clock.start();
	}
	requestAnimationFrame(animate);
}

function updateVisualGrid(updateQueue) {
	updateQueue.forEach((cube) => {
		visualGrid.children[cube.vGridIndex].visible = !visualGrid.children[cube.vGridIndex].visible;
	});
	updateQueue = [];
}

function main() {
	setScene();
	resetGrid();
	clock.start(); // start the clock before animating/changing state
	animate();
}

function resetGrid() {
	visualGrid.clear();
	resetBoundaryBox();
	GRID = RandomState(GRIDDIMENSIONS.x, GRIDDIMENSIONS.y, GRIDDIMENSIONS.z);
	renderGridHack(GRID);
}
main();

// TODO: Implement change state
// Loops through the grid and changes the cubes' state depending on the ruleset
// Creates a queue for the visual grid to update the cube's visibility
function changeState(GRID, RULES, updateQueue) {
	const { numSurvive, numBorn } = RULES;
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rindex) => {
			row.forEach((cube, index) => {
				// survive?
				if (cube.state === 1) {
					if (cube.num_neighbors < numSurvive) {
						updateQueue.push(cube); // push it to queue to flip the state
						mutateNeighbours(GRID, -1); // deincrement surrounding neighbor count
					}
					// birth?
				} else {
					if (cube.num_neighbors >= numBorn) {
						updateQueue.push(cube); // push to the queue to flip the state
						mutateNeighbours(GRID, 1); // increment the surrounding neighbor count
					}
				}
			});
		});
	});

	// for each entry in the grid 
	//  	check neighbors: update
	// if dead deincrement all neighboring cubes
	// if born increment all neighboring cubes
	// if surviving do nothing
}

function renderGridHack(GRID) {
	let position = new THREE.Vector3();
	let numRendered = 0;
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rowNum) => {
			row.forEach((columnEntry, index) => {
				position.set(index, rowNum, chunkLayer);
				if (columnEntry.state === 0 || columnEntry.num_neighbors === 6) {
					createCube(position, { display: false });
				} else
					createCube(position, {});
				columnEntry.vGridIndex = numRendered++; // each cube has to maintain the index inside the visual grid to update
			});
		});
	});
	console.log("VISUAL GRID", visualGrid);
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

var obj = {
	resetGrid: function () {
		resetGrid();
	}
}
const gui = new GUI()
const ruleFolder = gui.addFolder("Rule")
ruleFolder.add(RULES, "numBorn", -1, 6, 1)
ruleFolder.add(RULES, "numSurvive", -1, 6, 1)
ruleFolder.open()
const gridFolder = gui.addFolder("Grid")
gridFolder.add(GRIDDIMENSIONS, "x", 0, 50, 1)
gridFolder.add(GRIDDIMENSIONS, "y", 0, 50, 1)
gridFolder.add(GRIDDIMENSIONS, "z", 0, 50, 1)
gridFolder.add(obj, 'resetGrid')
gridFolder.open()


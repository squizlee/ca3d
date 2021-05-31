//import * as THREE from "../lib/three.module.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127/build/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";
import { RandomState, getChunk, mutateNeighbours } from "./state.js";
import { GUI } from "../lib/dat.gui.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/postprocessing/SSAOPass.js";

let scene;
let camera;
let cameralight, ambientlight;
let renderer;
let controls;
let visualGrid; // contains all cubes on the screen
let GRID; // contains the state for the entire automata
let clock;
let boundaryBox;
let boundaryEdge; // boundaryBox
let composer;

const RULES = {
	numSurvive: 6,
	numBorn: 2,
};

const GRIDDIMENSIONS = {
	x: 8,
	y: 8,
	z: 8,
}

const MISC = {
	randColor: false,
	posColor: false,
	UPDATE_TIME: 1,
}

//Setup the 3 main components: scene, camera, renderer
function setScene() {
	scene = new THREE.Scene();
	let ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 200);
	addLight();
	renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(0.0, 0.0, 20);
	visualGrid = new THREE.Group();

	// Effect and Render passes
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	var SSAO = new SSAOPass(scene, camera, 512, 512);
	composer.addPass(SSAO);

	scene.add(camera);
	clock = new THREE.Clock(false);
	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);
	scene.add(visualGrid);

	// Boundary Box
	createBoundaryBox();
	scene.add(boundaryEdge);
}

function addLight() {
	cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.7);
	cameralight.castShadow = true;
	ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.3);
	camera.add(cameralight);
	scene.add(ambientlight);
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

// Resets the bounding box to be scaled to the grid size
function resetBoundaryBox() {
	boundaryBox.scale.x = GRIDDIMENSIONS.x;
	boundaryBox.scale.y = GRIDDIMENSIONS.y;
	boundaryBox.scale.z = GRIDDIMENSIONS.z;
	boundaryEdge.update();
}

// position is a vector3
function createCube(position, parameters) {
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshPhongMaterial({ wireframe: false });
	const cube = new THREE.Mesh(geometry, material);
	cube.matrixAutoUpdate = false; // experimental: the cubes do not change position/rotation/quarternion/scale
	visualGrid.add(cube);
	if (position) {
		cube.position.set(position.x - GRIDDIMENSIONS.x * 0.5 + 0.5, position.y - GRIDDIMENSIONS.y * 0.5 + 0.5, position.z - GRIDDIMENSIONS.z * 0.5 + 0.5);
		cube.updateMatrix();
	}

	if (parameters.display === false) {
		cube.visible = false;
	}
	
	// if (position.x == 0 && position.y == 0 && position.z == 0) {
	// 	cube.material.color.setHex(0xff0000);
	// } 
	
}

// Called every frame
function animate() {
	composer.render(); // Replaces renderer.render()
	controls.update();
	const updateTime = MISC.UPDATE_TIME; // how often to update in seconds
	let updateQueue = []; // this queue will maintain a list of cubes to update visually (flip the visibility flag)
	if (clock.getElapsedTime() >= updateTime) {
		changeState(GRID, RULES, updateQueue);
		updateVisualGrid(updateQueue);
		// reset clock for timer
		clock.stop();
		clock.start();
	}

	requestAnimationFrame(animate);
}

function updateVisualGrid(updateQueue) {
	updateQueue.forEach((cube) => {
		//visualGrid.children[cube.vGridIndex].visible = !visualGrid.children[cube.vGridIndex].visible;
		let isVisible = visualGrid.children[cube.vGridIndex].visible ;
		visualGrid.children[cube.vGridIndex].visible = isVisible ? false : true;
		// if alive & neighbours >= 6 (but in this case it can't be > 6) invis
		// if dead invis
		// if alive & neighbours < 6 visible
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
	updateCubeColour();
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
						//var input = {cube: cube, neighbors: cube.num_neighbors, state: cube.state, vGridIndex: cube.vGridIndex};
						updateQueue.push(cube); // push it to queue to flip the state
						cube.state = 0;
						mutateNeighbours(GRID, -1, chunkLayer, rindex, index); // deincrement surrounding neighbor count

						// if (cube.state === 1 && cube.neighbors < 6) {
						// 	visualGrid.children[cube.vGridIndex].visible = true;
						// } else if (cube.state === 0 || cube.state === 1 && cube.neighbors === 6) {
						// 	visualGrid.children[cube.vGridIndex].visible = false;
						// }
					}
					// birth?
				} else if (cube.state === 0) {
					if (cube.num_neighbors >= numBorn) {
						updateQueue.push(cube); // push to the queue to flip the state
						cube.state = 1;
						mutateNeighbours(GRID, 1, chunkLayer, rindex, index); // increment the surrounding neighbor count
					}
				}
			});
		});
	});
}

function renderGridHack(GRID) {
	let position = new THREE.Vector3();
	let numRendered = 0;
	GRID.forEach((chunk, chunkLayer) => {
		chunk.forEach((row, rowNum) => {
			row.forEach((columnEntry, index) => {
				position.set(index, rowNum, chunkLayer);
				if (columnEntry.state === 0) {
					createCube(position, { display: false });
				} else
					createCube(position, {});
				columnEntry.vGridIndex = numRendered++; // each cube has to maintain the index inside the visual grid to update
			});
		});
	});
}

function updateCubeColour() {
	if(MISC.posColor){
		visualGrid.children.forEach(cube => cube.material.color.setRGB(cube.position.x / GRIDDIMENSIONS.x, cube.position.y / GRIDDIMENSIONS.y, cube.position.z / GRIDDIMENSIONS.z));
	} else{
		visualGrid.children.forEach((cube, index) => cube.material.color.setHex(index * 0xfffff));
	}
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

// Reset grid button
var obj = {
	resetGrid: function () {
		resetGrid();
	}
}

// --- UI elements ---
const gui = new GUI()
const ruleFolder = gui.addFolder("Rule")
ruleFolder.add(RULES, "numBorn", -1, 6, 1)
ruleFolder.add(RULES, "numSurvive", -1, 6, 1)
ruleFolder.open()

const miscFolder = gui.addFolder("Misc");
// miscFolder.add(MISC, "randColor");
miscFolder.add(MISC, "posColor").onChange(updateCubeColour);
miscFolder.add(MISC, "UPDATE_TIME", 0.1, 1, 0.01);
miscFolder.open(MISC, "color");

const gridFolder = gui.addFolder("Grid")
gridFolder.add(GRIDDIMENSIONS, "x", 0, 50, 1)
gridFolder.add(GRIDDIMENSIONS, "y", 0, 50, 1)
gridFolder.add(GRIDDIMENSIONS, "z", 0, 50, 1)
gridFolder.add(obj, 'resetGrid')
gridFolder.open()

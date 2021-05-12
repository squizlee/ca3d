/* global THREE */
//Declare Systen Variables and boilerplate

let scene;
let camera;
let renderer;
let controls;
let raycaster;

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
	raycaster = new THREE.Raycaster();

	scene = new THREE.Scene();
	var ratio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
	//camera.lookAt(0, 5, 0);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set(0.0, 0.0, 20);

	// HELPER
	const axesHelper = new THREE.AxesHelper(8);
	scene.add(axesHelper);
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
	const vertices = [
		// front
		{ pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] },
		{ pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
		{ pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },

		{ pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] },
		{ pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] },
		{ pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] },

		// right
		{ pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] },
		{ pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
		{ pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },

		{ pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] },
		{ pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] },
		{ pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] },
		// back
		{ pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] },
		{ pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
		{ pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },

		{ pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] },
		{ pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] },
		{ pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] },
		// left
		{ pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] },
		{ pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
		{ pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },

		{ pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] },
		{ pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] },
		{ pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] },
		// top
		{ pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] },
		{ pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
		{ pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },

		{ pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] },
		{ pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] },
		{ pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] },
		// bottom
		{ pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] },
		{ pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
		{ pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },

		{ pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] },
		{ pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] },
		{ pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] },
	];

	let positions = [];
	let normals = [];
    let uvs = [];
	for (const v of vertices) {
		positions.push(...v.pos);
		normals.push(...v.norm);
        uvs.push(...v.uv);
	}

	// TODO: Index redundant vertices to reduce memory load

	geometry.setAttribute(
		"position",
		new THREE.BufferAttribute(new Float32Array(positions), 3)
	);
	geometry.setAttribute(
		"normal",
		new THREE.BufferAttribute(new Float32Array(normals), 3)
	);
	geometry.setAttribute(
		"uv",
		new THREE.BufferAttribute(new Float32Array(uvs), 2)
	);
	const material = new THREE.MeshBasicMaterial({
		color: 0xbebebe, // grey
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	mesh.position.set(0, 0, 0);
}

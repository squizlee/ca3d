// STATE MANAGEMENT

function createCubeState(num_neighbors = 0, state = 0) {
	const CUBE = {
		num_neighbors: num_neighbors, // no neighbors by default
		state: state, // dead by default
	};
	
	return CUBE;
}

/**
 * Return a 3D array with the state of the entire automata
 * @param {Number} row number of rows
 * @param {Number} column number of columns
 * @param {Number} depth depth of grid
 */
function RandomState(row = 2, column = 2, depth = 2) {
	let GRID = [];

	// use these to randomly create state for the cubes 
	let getRandomValues = (max, length) => {
		let randomStates = [];
		for(let i = 0; i < length; ++i){
			let num = Math.floor(Math.random() * max) % 2;
			randomStates.push(num)
		}

		return randomStates;
	}

	let createRandomRow = () => {
		let arr = [];
		let randomVals = getRandomValues(255, column);
		for(let i = 0; i < column; ++i){
			let cube = createCubeState();
			cube.state = randomVals[i];
			arr.push(cube);
		}
		return arr;
	};

	let createChunk = () => {
		let chunk = [];
		for (let i = 0; i < row; ++i) {
			chunk.push(createRandomRow());
		}
		return chunk;
	};

	for (let i = 0; i < depth; ++i) {
		let chunk = createChunk();
		GRID.push(chunk);
	}

	return GRID;
}

/**
 * return the chunk by memory
 * @param {Array} GRID the state management grid
 * @param {Number} chunk n-chunk to grab
 * @returns {2D Array} of 1 and 0s
 */
function getChunk(GRID, chunk) {
	return GRID[chunk];
}

export { RandomState, getChunk };

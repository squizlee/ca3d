// STATE MANAGEMENT

function createCubeState(num_neighbors = 0, state = 0) {
	const CUBE = {
		num_neighbors: num_neighbors, // no neighbors by default
		state: state, // dead by default, 0 == dead, > 0 == alive
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

	updateNumNeighbors(GRID);

	return GRID;
}

/**
 * update the number of neighbours for each cube in preparation for state
 * @param {Array} GRID 3 - Dimensional array for each element count 
 */
function updateNumNeighbors(GRID){
	// ONLY CHECKING FOR THE 6 DIRECT NEIGHBOURS
	const depthNum = GRID.length;
	const rowNum  = GRID[0].length;
	const colNum  = GRID[0][0].length;

	GRID.forEach((chunk, cindex) => {
		chunk.forEach((row, rindex) => {
			row.forEach((col, index) => {
				let num = 0;

				// check left 
				if(index != 0)
				{
					if(row[index - 1].state == 1) ++num;
				}
				// check right
				if(index != colNum - 1){
					if(row[index + 1].state == 1) ++num;
				}

				// check top
				if(rindex != rowNum - 1) {
					if(chunk[rindex + 1][index].state == 1) ++num;
				}
				// check bottom
				if(rindex != 0) {
					if(chunk[rindex - 1][index].state == 1) ++num;
				}
				// check front
				if(cindex != depthNum - 1) {
					if(GRID[cindex + 1][rindex][index].state == 1) ++num;
				}
				// check back
				if(cindex != 0) {
					if(GRID[cindex - 1][rindex][index].state == 1) ++num;
				}

				if(num === 6){
					console.log("Don't render me!");
				}

				// update
				col.num_neighbors = num;
			});
		});
	});

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

export { RandomState, getChunk};

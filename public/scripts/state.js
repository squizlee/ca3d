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

/**
 * Return a 3D array with the state of the entire automata
 * @param {Number} row number of rows
 * @param {Number} column number of columns
 * @param {Number} depth depth of grid
 */
function RandomState(row, column, depth){
	let GRID = [];

	let createRandomRow = () => {
		let arr = new Uint8Array(column);
		crypto.getRandomValues(arr);
		arr.forEach((el, index) => {
			el > (255 / 2) ? arr[index] = 1 : arr[index] = 0;
		});
		return arr;
	}

	let createChunk = () => {
		let chunk = [];
		for(let i = 0; i < row; ++i){
			chunk.push(createRandomRow());
		}
		return chunk;
	}


	for(let i = 0; i < depth; ++i){
		let chunk = createChunk();
		GRID.push(chunk);
	}

	return GRID;
}

export {RandomState, STATE};
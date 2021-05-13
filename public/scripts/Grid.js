var grid = new THREE.Group();
var numX, numY, numZ, cellSize;
var cells, rule;
var cubeGeo;
var iterations;

// Can be moved to build instead
function initVars() {
    rule = [4, 4, 5, "M"];
    numX = 10;
    numY = 10;
    numZ = 10;
    cellSize = 1;
    iterations = 0;

    cells = new CellularAutomata;
    cubeGeo = new THREE.BoxBufferGeometry(cellSize, cellSize, cellSize);
}


function loadBoundary() {
    var boundX = numX * cellSize;
    var boundY = numY * cellSize;
    var boundZ = numZ * cellSize;
    var axes = new THREE.AxesHelper(1);
    // scene.add(axes);
    // draw bounding box
    var geoBoundBox = new THREE.BoxGeometry(boundX, boundY, boundZ);
    var matWire = new THREE.MeshBasicMaterial({
        color: 0x444444
    });
    var BoundaryBox = new THREE.Mesh(geoBoundBox, matWire);
    var BoundaryEdge = new THREE.BoxHelper(BoundaryBox, 0x444444);
    BoundaryEdge.position.x = 0;
    BoundaryEdge.position.y = 0;
    BoundaryEdge.position.z = 0;
    scene.add(BoundaryEdge);
}

// positive modulo function
function mod(n, m) {
    return ((n % m) + m) % m;
};

function getCellState() {
    // count neighbours
    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            for (let k = 0; k < numZ; k++) {
                getAliveNeighboursImproved(i, j, k, cells[i][j][k]._neighbours);
            }
        }
    }
    // set next state and reset neighbour count
    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            for (let k = 0; k < numZ; k++) {
                setNextState(i, j, k, cells[i][j][k]._neighbours);
                cells[i][j][k]._neighbours = 0;
            }
        }
    }
}
// sets nextState of cell depending on rules
function setNextState(i, j, k, aliveCount) {
    // condition to stay alive if cell is currently alive
    if (cells[i][j][k]._state) {
        if (aliveCount >= rule[0] && aliveCount <= rule[1]) {
            cells[i][j][k]._nextState = true;
        } else {
            cells[i][j][k]._nextState = false;
        }
        // condition to become alive if cell is currently dead
    } else {
        if (aliveCount >= rule[2] && aliveCount <= rule[3]) {
            cells[i][j][k]._nextState = true;
        } else {
            cells[i][j][k]._nextState = false;
        }
    }
}

// Creates a new grid with x and y
function createGrid() {
    //cubeGeo = new THREE(cellSize, cellSize, cellSize);
    //loadBoundary(x, y, z, cellSize);
    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            for (let k = 0; k < numZ; k++) {
                var cube = new CellularAutomata(i, j, k, cubeGeo);
                cube._mesh.position.x = i - numX * 0.5 + cellSize * 0.5;
                cube._mesh.position.y = j - numY * 0.5 + cellSize * 0.5;
                cube._mesh.position.z = k - numZ * 0.5 + cellSize * 0.5;
                grid.add(cube._mesh);
            }

        }
    }
}
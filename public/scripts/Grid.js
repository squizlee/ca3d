var grid = new THREE.Group();
var numX, numY, numZ, cellSize;
var cells, rules;
var cubeGeo;
var iterations;

// Inits variables
function initVars() {
    rules = [9, 7, 2, "M"]; // Survive, born, states till death, "Neighboring type"
    numX = 30;
    numY = 30;
    numZ = 30;
    cellSize = 1;
    iterations = 0;

    cells = new CellularAutomata;
    cubeGeo = new THREE.BoxBufferGeometry(cellSize, cellSize, cellSize);
}

// instantiate nested array of CA class objects
function initCells() {
    cells = new Array(numX);
    for (let i = 0; i < numX; i++) {
        cells[i] = new Array(numY);
        for (let j = 0; j < numY; j++) {
            cells[i][j] = new Array(numZ);
            for (let k = 0; k < numZ; k++) {
                cells[i][j][k] = new CellularAutomata(i, j, k, cubeGeo);
                // turn random cells on
                cells[i][j][k]._state = (Math.random() < 0.1) ? rules[2] : 0;
                //cells[i][j][k]._state = rules[2];
            }
        }
    }
    console.log(cells);
}

function loadBoundary() {
    var boundX = numX * cellSize;
    var boundY = numY * cellSize;
    var boundZ = numZ * cellSize;

    // draw bounding box
    var geoBoundBox = new THREE.BoxGeometry(boundX, boundY, boundZ);
    var matWire = new THREE.MeshBasicMaterial({
        color: 0x444444
    });
    var BoundaryBox = new THREE.Mesh(geoBoundBox, matWire);
    var BoundaryEdge = new THREE.BoxHelper(BoundaryBox, 0x444444);
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
                getAliveNeighbours(i, j, k, cells[i][j][k]._neighbours);
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
    if (cells[i][j][k]._state > 0) {
        if (aliveCount >= rules[0]) {
            cells[i][j][k]._state = rules[2]; // Set to max state if alive
        } else {
            if (cells[i][j][k]._state > 0)
                cells[i][j][k]._state--;
        }
        // condition to become alive if cell is currently dead
    } else {
        if (aliveCount >= rules[1]) {
            cells[i][j][k]._state = rules[2];
        }
    }
}

// // Creates a new grid with x and y
// function createGrid() {
//     //cubeGeo = new THREE(cellSize, cellSize, cellSize);
//     //loadBoundary(x, y, z, cellSize);
//     for (let i = 0; i < numX; i++) {
//         for (let j = 0; j < numY; j++) {
//             for (let k = 0; k < numZ; k++) {
//                 var cube = new CellularAutomata(i, j, k, cubeGeo);
//                 cube._mesh.position.x = i - numX * 0.5 + cellSize * 0.5;
//                 cube._mesh.position.y = j - numY * 0.5 + cellSize * 0.5;
//                 cube._mesh.position.z = k - numZ * 0.5 + cellSize * 0.5;
//                 //grid.add(cube._mesh);
//             }

//         }
//     }
// }

function getAliveNeighbours(i, j, k) {
    // if THIS cell is on, set adjacent neighbour count +1
    if (cells[i][j][k]._state > 0) {
        for (let ni = -1; ni <= 1; ni++) {
            for (let nj = -1; nj <= 1; nj++) {
                for (let nk = -1; nk <= 1; nk++) {
                    // Create if statements to find VN neighbours or create a new function for it
                    if (!(ni === 0 && nj === 0 && nk === 0)) { // Center i.e. itself
                        cells[mod(i + ni, numX)][mod(j + nj, numY)][mod(k + nk, numZ)]._neighbours++;
                    }
                }
            }
        }
    }
    return;
}

/* draws cells and assigns nextState to state */
function drawCells() {
    // Loop over all cells and draw them if state = true
    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            for (let k = 0; k < numZ; k++) {
                let mesh = cells[i][j][k]._mesh;
                mesh.position.x = i - numX * 0.5 + cellSize * 0.5;
                mesh.position.y = j - numY * 0.5 + cellSize * 0.5;
                mesh.position.z = k - numZ * 0.5 + cellSize * 0.5;
                if (cells[i][j][k]._state > 0) {
                    // if (cells[i][j][k]._tweenOut != null) {
                    //   cells[i][j][k]._tweenOut.stop();
                    //   cells[i][j][k]._tweenOut = null;
                    mesh.material.opacity = 1.0;
                    // }
                    scene.add(mesh);
                } else if (cells[i][j][k]._state <= 0) {
                    // cells[i][j][k]._tweenOut = new TWEEN.Tween(mesh.material)
                    //   .to({
                    //     opacity: 0
                    //   }, fadeOut)
                    //   .onComplete(function () {
                    //     scene.remove(mesh);
                    //     mesh.receiveShadow = true;
                    //     mesh.castShadow = true;
                    //   })
                    //   .start();
                    mesh.receiveShadow = false;
                    mesh.castShadow = false;
                    scene.remove(mesh);
                }
            }
        }
    }
    // // assign nextState to state
    // for (let i = 0; i < numX; i++) {
    //   for (let j = 0; j < numY; j++) {
    //     for (let k = 0; k < numZ; k++) {
    //       cells[i][j][k]._laststate = cells[i][j][k]._state;
    //       cells[i][j][k]._state = cells[i][j][k]._nextState;
    //     }
    //   }
    // }
    iterations++;
    
}
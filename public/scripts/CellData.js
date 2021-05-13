// Either have it like this or have a 3d array with
/**
 * var myArr = new Array();
myArr[0] = new Array();
myArr[0][0] = new Array()
myArr[0][0][0] = "Howdy";
myArr[0][0][1] = "pardner";

alert(myArr[0][0][1]);

or var arr = [[[]]];
var [0][0][0] = 0;
 */
class CellularAutomata{
  constructor(x,y,z,geometry){
    this.posX = x;
    this.posY = y;
    this.posZ = z;

    this._lastState = false;
    this._state = false;
    this._nextState = false;
    this._neighbours = 0;
    this._tweenOut = null;

    this._cellColor = new THREE.Color(x / numX, y / numY, z / numZ);
    // lambert material has bug with shadows
    // this._material = new THREE.MeshLambertMaterial({ color: this._cellColor, transparent: true});
    this._material = new THREE.MeshPhongMaterial({
      color: this._cellColor,
      transparent: true,
      specular: 0x222222,
      shininess: 100
    });
    this._mesh = new THREE.Mesh(geometry, this._material);
    this._mesh.castShadow = true;
    this._mesh.receiveShadow = true;
    this._mesh.opacity = 1;
    //scene.add(this._mesh);
    //console.log(this._mesh);
  }
}

// var neighbours = [
//     0,0,0, // Top back
//     0,0,0, // Top mid
//     0,0,0, // Top front

//     0,0,0,
//     0,0,0,
//     0,0,0,

//     0,0,0,
//     0,0,0,
//     0,0,0,
// ];

// Todo: add neighbour array, process function, states, depending on state change colour add a constructor
// Maybe give it positions
// function createCube(r, color){
//     var material = new THREE.MeshBasicMaterial();
//     material.color = new THREE.Color(color);
//     material.wireframe = true;
//     var geometry_cube = new THREE.BoxGeometry(r, r, r);
//     var cube = new THREE.Mesh(geometry_cube, material);
//     return cube;
// }

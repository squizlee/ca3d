class CellularAutomata{
  constructor(x,y,z,geometry){
    this.posX = x;
    this.posY = y;
    this.posZ = z;

    //this._lastState = false; // Maybe leave out
    this._state = 0; // Set this to int? 0 == dead, > 0 == alive
   // this._nextState = false; // Maybe leave out
    this._mNeighbours = 0;
    this._VNNeighbours = 0;
    //this._tweenOut = null; // Tween stuff, could leave out

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

// Todo: add neighbour array, process function, states, depending on state change colour add a constructor
// Maybe give it positions
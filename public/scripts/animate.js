var speed2 = 0.005;

//Animate a sphere to rotate around x axis and transform along y, z axis
function animate_sphere() {
    sphere.rotation.y += speed2;

    // renderer.render(scene, camera);
    // requestAnimationFrame(animate_sphere);
}

function rotate(object) {
    object.rotation.z += speed2;
}

var counter= 0;
var colour = new THREE.Color(1,0.5,0);
function animate() {
    renderer.render(scene, camera);
    controls.update();

    // if(counter >= 10){
    //     grid.children.forEach(o => o.material.color.set(colour));
    //     if (counter >= 20){
    //         counter = 0;
    //     }
    // } else {
    //     grid.children.forEach(o => o.material.color.set(new THREE.Color(0.1,0.5,0.8)));
    // }
    // counter++;
    requestAnimationFrame(animate);
}
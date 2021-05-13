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
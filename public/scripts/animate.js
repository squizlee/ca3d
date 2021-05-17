var counter= 0;
var colour = new THREE.Color(1,0.5,0);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    getCellState();
    drawCells();
    // if(counter >= 10){
    //     grid.children.forEach(o => o.material.color.set(colour));
    //     if (counter >= 20){
    //         counter = 0;
    //     }
    // } else {
    //     grid.children.forEach(o => o.material.color.set(new THREE.Color(0.1,0.5,0.8)));
    // }
    // counter++;
    renderer.render(scene, camera);
}
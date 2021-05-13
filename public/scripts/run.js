setScene();

// Radius min, max, hlines and vlines min, max, equal hvlines
//paramSphere(1, 2, 1, 20, true, true);
initVars();
createGrid();
loadBoundary();
// Creates rings, numRings, isMobius
//createRings(6);
addShapes();
addLight();
//animate_sphere();
animate();
//renderer.render(scene, camera);

window.addEventListener('resize', resizeScene);
setScene();

initVars();
loadBoundary();
initCells();
drawCells();
//createGrid();

addShapes();
addLight();
animate();

window.addEventListener('resize', resizeScene);
# CA3D 
3D Cellular Automata powered by THREE.JS. Developed by a group of three students. 

# What is an Automata 
Providing state and some rules, simulate the change. For this 3D cellular automata we change state based on the number of neighbors a 'cell' or cube has. The initial state of the grid is randomized on initial start.

For more information please refer to:

- [2D Cellular Automata](https://softologyblog.wordpress.com/2018/12/06/cellular-automata-explained-part-1/)
- [3D Cellular Automata](https://softologyblog.wordpress.com/2019/12/28/3d-cellular-automata-3/)

# How to run 
- Install NodeJS (>=V14.16.0)
- In the terminal: 
	- `npm install`
	- `npm run start`

# Project Structure
- server/ : defunct server code for image upload 
- public/ : main javascript and THREE.JS Code
- public/lib : THREE.JS, Dat GUI, Orbit Controls, Ambient Occlusion
- public/scripts : main.js and state.js

`state.js` is responsible for creating the GRID's state and mutating it
`main.js` is responsible for rendering, logic, and UI code
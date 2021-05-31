# CA3D 
3D Cellular Automata

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
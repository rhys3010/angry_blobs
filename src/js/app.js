/**
  * app.js
  * Main JS file to bootstrap all of the app's modules.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 25/10/2018
*/

$(document).ready(function(){
  // Set initial state
  Game.changeState(STATE.START);
  // Create Three.js scene
  ThreeComponents.create();
  // Render three.js scene
  ThreeComponents.render();
  // Initialize user input module
  UserInput.init();
});

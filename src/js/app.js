/**
  * app.js
  * Main JS file to bootstrap all of the app's modules.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 25/10/2018
*/

$(document).ready(function(){
  Game.changeState(STATE.START);
  UserInput.initialize();
});

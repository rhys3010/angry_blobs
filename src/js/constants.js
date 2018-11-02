/**
  * constants.js
  * Declare all of the game's constants for global access
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

// State Enum Type
const STATE = {
  START: 0,
  PLAY: 1,
  END: 2,
};

// Screens
const SCREEN = {
  START_SCREEN: document.getElementById('start-container'),
  GAME_SCREEN: document.getElementById('game-container'),
  END_SCREEN: document.getElementById('end-container'),
};

// Three.js Scene Constants
const CAMERA_DIST = 350;

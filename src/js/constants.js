/**
  * constants.js
  * Declare all of the game's constants for global access
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

// State Enum Type
const STATE = {
  INVALID: -1,
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

// Game Constants
SEC_TO_POWER_CONSTANT = 40;
MIN_POWER = 0;
MAX_POWER = 50;

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

// Block Orientation Constants
const BLOCK_EMPTY = 0;
const BLOCK_VERTICAL = 1;
const BLOCK_HORIZONTAL = 2;

// Game Constants
const SEC_TO_POWER_CONSTANT = 40;
const MIN_POWER = 0;
const MAX_POWER = 50;
// Width, Height and Depth of individual bricks within structure
const BRICK_W = 2;
const BRICK_H = 6;
const BRICK_D = 2;

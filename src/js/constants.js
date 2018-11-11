/**
  * constants.js
  * Declare all of the game's constants for global access
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.1
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
const SEC_TO_POWER_CONSTANT = 40;
const MIN_POWER = 0;
const MAX_POWER = 50;
const MAX_ROUNDS = 3;
// The maximum amount of time a turn can last before it is automatically ended (ms)
const MAX_TURN_LENGTH = 20000;
// The amount of time the structure should be still for before ending
const STRUCTURE_STATIC_LENGTH = 2000;
const PROJECTILE_STATIC_LENGTH = 2000;
const SHOULD_TURN_END_INTERVAL = 100;
const SCORE_MULTIPLIER = 10;

// Object Constants
const PROJECTILE_MASS = 0.5;
const PROJECTILE_RADIUS = 0.75;
const PROJECTILE_FRICTION = 0;
const PROJECTILE_RESTITUTION = 0;

const GROUND_FRICTION = 0;
const GROUND_RESTITUTION = 0;

// Brick Constants
const BRICK_MASS = 3.5;
// Orientation
const BRICK_EMPTY = 0;
const BRICK_VERTICAL = 1;
const BRICK_HORIZONTAL = 2;
// Width, Height and Depth of individual bricks within structure
const BRICK_W = 1.25;
const BRICK_H = 6;
const BRICK_D = 1.25;

// Opponent Constants
// Tweak this value to change the opponent's 'difficulty'
const OPPONENT_ERROR = 0.5;
const STRUCTURE_TALL_LAYERS = 5;

/**
  * Definitions for the available structure layouts
  * Structures are drawn right -> left, bottom->top.
  * Therefore the first element in the array is the bottom right block in the structure
  * For example the following array: [1, 2, 2]. Would generate the below structure:
  * _ _|
*/
const STRUCTURES = [
  // Structure #1
  [
    [1, 1, 1, 1],
    [2, 0, 2, 0],
    [0, 2, 0, 0],
    [0, 1, 1, 0],
    [0, 2, 0, 0]
  ],
  // Structure #2
  [
    [1, 1],
    [2, 0],
    [1, 1]
  ],
  // Structure #3
  [
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [0, 2, 0, 0],
    [0, 1, 2, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0]
  ],
  // Structure #4
  [
    [1, 1],
    [2, 0],
    [1, 1],
    [2, 0],
    [1, 1],
    [2, 0]
  ],
  // Structure #5
  [
    [1, 1, 1],
    [2, 0, 0],
    [0, 1, 1],
    [0, 2, 0]
  ],
  // Structure #6
  [
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [0, 2, 0 ,0]
  ],
  // Structure #7
  [
    [1, 1, 1, 1],
    [2, 0, 2, 0],
    [1, 1, 1, 1],
    [2, 0, 2, 0]
  ],
  // Structure #8
  [
    [2, 0, 0],
    [2, 0, 0],
    [1, 1, 1],
    [0, 2, 0],
    [1, 0, 0],
    [1, 0, 0]
  ],
  // Structure #9
  [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 2, 0, 1],
    [0, 1, 2, 0, 1, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 2, 0, 0, 0]
  ]
];

/**
  * game.js
  * Handle all the game logic, including screen changing etc.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

/**
  * Create game module
*/
var Game = (function(){

  'use strict';

  // Store the current state of the game (initialize as invalid)
  var currentState = STATE.INVALID;
  // Boolean value to store wether it is valid for the user to take a turn
  var canTakeTurn = true;
  // Store the currently used structure for both player and bot turn
  var currentStructure;


  /* ===== PRIVATE METHODS ===== */

  /**
    * Initialize the game state to ensure the game is ready for a new turn
  */
  function initGameState(){
    // Choose a new (random) structure
    // TODO: Only choose new structure if new turn
    currentStructure = STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)];

    // Initialize Scene ready for next turn
    ThreeComponents.initScene(currentStructure);
    canTakeTurn = true;
  }


  /* ===== PUBLIC METHODS ===== */

  /**
    * Changes the current state of the game
    * @param newState
  */
  function changeState(newState){

    // If current state is the same as new state, return
    if(Game.getState() === newState){
      return;
    }

    currentState = newState;

    // Update screen to represent new state
    switch(newState){
      case STATE.START:
        Util.changeScreen(SCREEN.START_SCREEN);
        break;
      case STATE.PLAY:
        Util.changeScreen(SCREEN.GAME_SCREEN);
        break;
      case STATE.END:
        Util.changeScreen(SCREEN.END_SCREEN);
        break;
      case STATE_INVALID:
        console.error("Invalid State: Please Restart.");
        break;
    }
  }

  /**
    * Gets the current state of the game
    * @returns currentState
  */
  function getState(){
    return currentState;
  }
  /**
    * Gets the current state of the game
    * @returns currentState
  */
  function getState(){
    return currentState;
  }
  /**
    * Start the game by initializing components and updating the state machine.
  */
  function startGame(){
    changeState(STATE.PLAY);
    initGameState();
  }

  /**
    * End the game by switching to end screen.
  */
  function endGame(){
    changeState(STATE.END);
  }

  /**
    * Take a turn by launching the projectile using the ThreeComponents module.
    * @param power (5-50) - The power to apply to the launch
  */
  function takeTurn(power){
    if(canTakeTurn){
      ThreeComponents.launchProjectile(power);
    }
    canTakeTurn = false;
  }

  /**
    * Gets wether or not the user can take a turn
  */
  function getCanTakeTurn(){
    return canTakeTurn;
  }



  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    changeState: changeState,
    getState: getState,
    startGame: startGame,
    endGame: endGame,
    takeTurn: takeTurn,
    getCanTakeTurn: getCanTakeTurn,
  };
}());

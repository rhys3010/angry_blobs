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


  /* ===== PRIVATE METHODS ===== */

  /**
    * Change the currently displayed screen by hiding/showing various DOM Elements. Screen is bound to current state
    * @param newScreen
  */
  function changeScreen(newScreen){
    var info = document.getElementById('info');

    // Hide all Screens
    $(SCREEN.START_SCREEN).hide();
    $(SCREEN.GAME_SCREEN).hide();
    $(SCREEN.END_SCREEN).hide();

    // Show newScreen
    switch(newScreen){
      case SCREEN.START_SCREEN:
        $(SCREEN.START_SCREEN).show();
        $(SCREEN.START_SCREEN).removeAttr("hidden");
        // Show info
        $(info).show();
        break;
      case SCREEN.GAME_SCREEN:
        $(SCREEN.GAME_SCREEN).show();
        $(SCREEN.GAME_SCREEN).removeAttr("hidden");
        // Hide info
        $(info).hide();
        break;
      case SCREEN.END_SCREEN:
        $(SCREEN.END_SCREEN).show();
        $(SCREEN.END_SCREEN).removeAttr("hidden");
        // Show info
        $(info).show();
        break;
      default:
        $(SCREEN.START_SCREEN).show();
    }
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
        changeScreen(SCREEN.START_SCREEN);
        break;
      case STATE.PLAY:
        changeScreen(SCREEN.GAME_SCREEN);
        break;
      case STATE.END:
        changeScreen(SCREEN.END_SCREEN);
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
    ThreeComponents.initScene();
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


  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    changeState: changeState,
    getState: getState,
    startGame: startGame,
    endGame: endGame,
    takeTurn: takeTurn,
  };
}());

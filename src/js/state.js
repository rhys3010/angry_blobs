/**
  * state.js
  * Manage the game's main state machine to drive behaviour.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

/**
  * Create state module
*/
var State = (function(){

  'use strict';

  // Store the current state of the game (initialize as start)
  var currentState = STATE.START;

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
    * Gets the current state of the game
    * @returns currentState
  */
  function getState(){
    return currentState;
  }

  /**
    * Changes the current state of the game
    * @param newState
  */
  function changeState(newState){
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
    }
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    getState: getState,
    changeState: changeState
  };

}());

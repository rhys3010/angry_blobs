/**
  * game.js
  * Handle all the game behaviour, including screen changing etc.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

/**
  * Create game module
*/
var Game = (function(){

  'use strict';

  /* ===== PRIVATE METHODS ===== */


  /* ===== PUBLIC METHODS ===== */

  /**
    * Start the game by initializing components and updating the state machine.
  */
  function startGame(){
    State.changeState(STATE.PLAY);
  }


  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    startGame: startGame,
  };

}());

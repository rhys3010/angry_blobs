/**
  * userInput.js
  * Handle all user input, (button clicks, movmenet etc)
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

/**
  * Create user input module
*/
var UserInput = (function(){

  'use strict';

  // Declare all buttons
  var startButton = document.getElementById('start-button');

  /* ===== PRIVATE METHODS ===== */

  /**
    * Handle mouse movement to control firing angle when in game screen
  */
  function mouseMove(event){
    if(State.getState() === STATE.PLAY){
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the arrow direction given the mouse's new position
      ThreeComponents.updateArrowDir(mouseX, mouseY);
    }
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Initialize user input module by binding all onclick events etc.
  */
  function initialize(){
    // Bind start button event
    startButton.onclick = function(){
      Game.startGame();
    };

    // Bind mousemove event
    $(document).on("mousemove", mouseMove);
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    initialize: initialize,
  };

}());

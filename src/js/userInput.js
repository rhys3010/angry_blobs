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
  var restartButton = document.getElementById('restart-button');

  // Mouse press/release variables to measure power
  var mousePressed;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Handle mouse movement to control firing angle when in game screen
  */
  function mouseMove(event){
    if(Game.getState() === STATE.PLAY){
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the arrow direction given the mouse's new position
      ThreeComponents.updateArrowDir(mouseX, mouseY);
    }
  }

  /**
    * Handle mouse click to begin timer
  */
  function mouseDown(){
    // Verify that the correct state is selected
    if(Game.getState() === STATE.PLAY){
      mousePressed = new Date();
    }
  }

  /**
    * Handle mouse click to end timer and calculate power
    * Minimum Power: 5 (200ms) | Maximum Power: 50 (2000ms)
  */
  function mouseUp(){
    // Verify that the correct state is selected
    if(Game.getState() === STATE.PLAY){
      // The power factor
      var power = 0;
      // Calculate how long the mouse was pressed for
      var heldTime = new Date() - mousePressed;

      // If mouse was held for less than 200ms apply minimum power
      if(heldTime <= 200){
        power = MIN_POWER;
        // If mouse was held for longer than 2000ms apply maximum power
      } else if(heldTime >= 2000){
        power = MAX_POWER;
        // If power was between 200 - 2000 work out using sec -> power constant
      } else{
        power = heldTime / SEC_TO_POWER_CONSTANT;
      }

      // Pass power to game logic module
      Game.takeTurn(power);
    }
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Initialize user input module by binding all onclick events etc.
  */
  function init(){
    // Bind start button event
    startButton.onclick = function(){
      Game.startGame();
    };

    // Bind Restart button event
    restartButton.onclick = function(){
      Game.startGame();
    }

    // Bind mousemove event
    $(document).on("mousemove", mouseMove);

    // Bind mouseclick events
    $(document).on("mousedown", mouseDown);
    $(document).on("mouseup", mouseUp);
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    init: init,
  };

}());

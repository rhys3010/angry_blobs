/**
  * userInput.js
  * Handle all user input, (button clicks, movmenet etc)
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.1
*/

/**
  * Create user input module
*/
var UserInput = (function(){

  'use strict';

  // Declare all HTML button elements
  var startButton = document.getElementById('start-button');
  var restartButton = document.getElementById('restart-button');
  var menuButton = document.getElementById('menu-button');

  // Mouse press/release variable to measure power
  var mousePressed;
  // Mouse down interval counter to track power in real time
  var mouseDownInterval = -1;
  // Store current power + direction
  var power = 0;
  var direction;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Handle mouse movement to control firing angle when in game screen
  */
  function mouseMove(event){
    if(Game.getState() === STATE.PLAY && Game.isPlayerTurn() && !Game.isTurnInProgress()){
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the arrow direction given the mouse's new position
      direction = ThreeComponents.updateArrowDir(mouseX, mouseY);

      // Update power indicator position if mouse is held down
      if(mouseDownInterval != -1){
        Ui.updateToolTipPosition(event.pageX, event.pageY);
      }
    }
  }

  /**
    * Handle mouse click to begin timer
  */
  function mouseDown(event){
    // Prevent tooltip from showing when clicking buttons
    if(event.target.tagName != "A" && event.target.tagName != "BUTTON"){
      // Verify that the correct state is selected
      if(Game.getState() === STATE.PLAY && Game.isPlayerTurn() && !Game.isTurnInProgress()){
        mousePressed = new Date();

        // Show power indicator and update position
        Ui.showPowerToolTip();
        Ui.updateToolTipPosition(event.pageX, event.pageY);

        // Get current power and display on indicator
        if(mouseDownInterval === -1){
          mouseDownInterval = setInterval(function(){
            power = Math.floor((new Date() - mousePressed) / SEC_TO_POWER_CONSTANT) % MAX_POWER;
            Ui.updateToolTipValue(power);
          }, 10);
        }
      }
    }
  }

  /**
    * Handle mouse click to end timer and calculate power
    * Maximum Power: 50 (2000ms)
  */
  function mouseUp(){
    // If a mouseDownInterval was active, stop it
    if(mouseDownInterval != -1){
      clearInterval(mouseDownInterval);
      mouseDownInterval = -1;
    }
    // Hide power indicator
    Ui.hidePowerToolTip();

    // Verify mouse was not hovering over a button
    if(event.target.tagName != "A" && event.target.tagName != "BUTTON"){
      // Verify that the correct state is selected
      // and that it is valid for user to take turn
      if(Game.getState() === STATE.PLAY && Game.isPlayerTurn() && !Game.isTurnInProgress()){
        // Pass power and direction to game logic module
        Game.takeTurn(direction, power);
        // Reset power
        power = 0;
      }
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
      Game.endGame();
      Game.startGame();
    }

    // Bind Menu Button event
    menuButton.onclick = function(){
      Game.changeState(STATE.START);
    }

    // Bind End Button event
    document.getElementById('end-button').onclick = function(){
      Game.endGame();
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

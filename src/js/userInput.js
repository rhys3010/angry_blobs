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

  // Declare all HTML elements
  var startButton = document.getElementById('start-button');
  var restartButton = document.getElementById('restart-button');
  var menuButton = document.getElementById('menu-button');
  var powerTooltip = document.getElementById('power-tooltip');

  // Mouse press/release variable to measure power
  var mousePressed;
  // Mouse down interval counter to track power in real time
  var mouseDownInterval = -1;
  // Store current power
  var power = 0;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Handle mouse movement to control firing angle when in game screen
  */
  function mouseMove(event){
    if(Game.getState() === STATE.PLAY && Game.isPlayerTurn()){
      var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the arrow direction given the mouse's new position
      ThreeComponents.updateArrowDir(mouseX, mouseY);

      // Update power indicator position if mouse is held down
      if(mouseDownInterval != -1){
        powerTooltip.style.top = (event.pageY + 20) + 'px';
        powerTooltip.style.left = (event.pageX - 30) + 'px';
      }
    }
  }

  /**
    * Handle mouse click to begin timer
  */
  function mouseDown(event){
    // Prevent tooltip from showing when clicking buttons
    if(event.target.tagName != "A" || event.target.tagName != "BUTTON"){
      // Verify that the correct state is selected
      if(Game.getState() === STATE.PLAY && Game.isPlayerTurn()){
        mousePressed = new Date();

        // Show power indicator next to mouse
        powerTooltip.style.display = 'block';
        powerTooltip.style.top = (event.pageY + 20) + 'px';
        powerTooltip.style.left = (event.pageX - 30) + 'px';

        // Get current power and display on indicator
        if(mouseDownInterval === -1){
          mouseDownInterval = setInterval(function(){
            power = Math.floor((new Date() - mousePressed) / SEC_TO_POWER_CONSTANT) % MAX_POWER;
            powerTooltip.innerHTML = "Power: " + Math.floor((power / MAX_POWER) * 100) + "%";
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

    // Verify that the correct state is selected
    // and that it is valid for user to take turn
    if(Game.getState() === STATE.PLAY && Game.isPlayerTurn()){
      // Hide power indicator
      powerTooltip.style.display = 'none';
      // Pass power to game logic module
      Game.takeTurn(power);
      // Reset power
      power = 0;
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

    // TEMP Re-init button
    document.getElementById('reinit-button').onclick = function(){
      Game.endGame();
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

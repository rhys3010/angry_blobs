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

  // Declare all buttons
  var startButton = document.getElementById('start-button');

  /* ===== PRIVATE METHODS ===== */

  /* ===== PUBLIC METHODS ===== */

  /**
    * Initialize user input module by binding all onclick events etc.
  */
  function initialize(){
    startButton.onclick = function(){
      Game.startGame();
    };
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    initialize: initialize,
  };

}());

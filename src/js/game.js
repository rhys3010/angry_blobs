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
  // Keep track of the round number
  var roundNo;
  // Boolean value to store wether it's the player's turn or not
  var playerTurn;
  // Timeout to enforce the delay before the AI takes their turn
  var botTurnDelay;
  // Store the currently used structure for both player and bot turn
  var currentStructure;
  // Keep track of scores
  var playerScore;
  var botScore;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Initialize the game state to ensure the game is ready for a new turn
    * @param newRound - Whether or not the game has entered a new round
  */
  function initGameState(newRound){

    // If game has entered a new round, choose a new (random) structure
    if(newRound){
      currentStructure = STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)];
    }

    // Initialize Scene ready for next turn
    ThreeComponents.initScene(currentStructure);
  }

  /**
    * Perform the necessary checks to decide if a given turn should end
    * @param turnStartTime - The time the turn started
    * @returns true/false depending on if turn should end
  */
  function shouldTurnEnd(turnStartTime){

    // Turn should end if any of the following conditions are met
    // > Projectile collides with boundary (wait 5 secs)
    // > Projectile has been static for 5 seconds
    // > Turn has lasted more than 20? Seconds

    return (new Date() - turnStartTime) > 5000;
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
    * Start the game by initializing components and updating the state machine.
  */
  function startGame(){
    changeState(STATE.PLAY);
    initGameState(true);
    playerTurn = true;
    roundNo = 1;
    playerScore = 0;
    botScore = 0;
  }

  /**
    * End the game by switching to end screen.
  */
  function endGame(){
    // Change state
    changeState(STATE.END);
    // Cancel all timeouts
    if(botTurnDelay){
      clearTimeout(botTurnDelay);
      botTurnDelay = null;
    }
  }

  /**
    * Take a turn by launching the projectile using the ThreeComponents module.
    * @param power (5-50) - The power to apply to the launch
  */
  function takeTurn(power){
    // The time that the turn started
    var turnStartTime = new Date();
    // Launch the projectile
    ThreeComponents.launchProjectile(power);
    // Move to next turn
    playerTurn = !playerTurn;

    // Continously check if the turn should end
    var shouldTurnEndInterval = setInterval(function(){
      if(shouldTurnEnd(turnStartTime)){
        endTurn();
        // Clear self
        clearInterval(shouldTurnEndInterval);
      }
    }, 100);
  }

  /**
   * End a turn by changing to bot/player and incrementing round if needed
  */
  function endTurn(){
    // Store whether or not the game has entered a new round
    var newRound = false;
    // If it was a bot's turn
    if(playerTurn){
      // After bot takes turn round must increment
      roundNo++;
      newRound = true;
    }

    // If game is finished
    if(roundNo > MAX_ROUNDS){
      endGame();
    }else{
      // Get the game scene ready
      initGameState(newRound);
      // If next turn is bot's take the turn
      if(!playerTurn){
        // Wait 1 sec before bot launches
        botTurnDelay = setTimeout(takeTurn, 2000, 40);
      }
    }
  }

  /**
    * Gets wether or not its the player's turn
  */
  function isPlayerTurn(){
    return playerTurn;
  }

  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    changeState: changeState,
    getState: getState,
    startGame: startGame,
    endGame: endGame,
    takeTurn: takeTurn,
    isPlayerTurn: isPlayerTurn,
    endTurn: endTurn,
  };
}());

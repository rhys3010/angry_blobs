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
  // The two timeouts that manage turn rotation and delays when the AI takes its turn
  var botTurnDelay;
  var endTurnTimeout;
  // Store the currently used structure for both player and bot turn
  var currentStructure;
  // Keep track of scores
  var playerScore;
  var botScore;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Initialize the game state to ensure the game is ready for a new turn
  */
  function initGameState(){
    // Choose a new (random) structure
    // TODO: Only choose new structure if a new round
    currentStructure = STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)];

    // Initialize Scene ready for next turn
    ThreeComponents.initScene(currentStructure);
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
    initGameState();
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
    if(endTurnTimeout){
      clearTimeout(endTurnTimeout);
      endTurnTimeout = null;
      clearTimeout(botTurnDelay);
      botTurnDelay = null;
    }
  }

  /**
    * Take a turn by launching the projectile using the ThreeComponents module.
    * @param power (5-50) - The power to apply to the launch
  */
  function takeTurn(power){
    // Launch the projectile
    ThreeComponents.launchProjectile(power);
    // Move to next turn
    playerTurn = !playerTurn;
    // Wait 5secs until turn is over...
    endTurnTimeout = setTimeout(endTurn, 5000);
  }

  /**
   * End a turn by changing to bot/player and incrementing round if needed
  */
  function endTurn(){
    // If it was a bot's turn
    if(playerTurn){
      // After bot takes turn round must increment
      roundNo++;
    }

    // If game is finished
    if(roundNo > MAX_ROUNDS){
      endGame();
    }else{
      // Get the game scene ready
      initGameState();
      // If next turn is bot's take the turn
      if(!playerTurn){
        // Wait 1 sec before bot launches
        botTurnDelay = setTimeout(function(){
          // TODO: Replace with intelligent behaviour
          takeTurn(40);
        }, 1000);
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

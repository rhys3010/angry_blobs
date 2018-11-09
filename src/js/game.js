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
  // Store whether there is a turn in progress
  var turnInProgress;

  // Timeout to enforce the delay before the AI takes their turn
  var botTurnDelay;
  // Interval to continuously check if turn should end
  var shouldTurnEndInterval;
  // Timeout to enforce a delay before the turn ends
  var turnEndDelay;

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
    // > Projectile collides with boundary (handled by collision system)
    // > Projectile is static
    // > Turn has lasted more than X Seconds

    return ThreeComponents.isProjectileStatic() || (new Date() - turnStartTime) > MAX_TURN_LENGTH;
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
    * Start the game by updating the state machine and
    * Initializing all scene/game variables
  */
  function startGame(){
    changeState(STATE.PLAY);
    initGameState(true);
    playerTurn = true;
    roundNo = 1;
    playerScore = 0;
    botScore = 0;
    turnInProgress = false;
  }

  /**
    * End the game by switching to end screen.
  */
  function endGame(){
    // Change state
    changeState(STATE.END);
    turnInProgress = false;
    // Cancel all timeouts/intervals
    clearInterval(shouldTurnEndInterval);
    shouldTurnEndInterval = undefined;
    clearTimeout(botTurnDelay);
    botTurnDelay = undefined;
    clearTimeout(turnEndDelay);
    turnEndDelay = undefined;
  }

  /**
    * Take a turn by launching the projectile using the ThreeComponents module.
    * @param power (5-50) - The power to apply to the launch
  */
  function takeTurn(power){
    // The time that the turn started
    var turnStartTime = new Date();
    turnInProgress = true;
    ThreeComponents.launchProjectile(power);
    // continuously check if the turn should end
    shouldTurnEndInterval = setInterval(function(){
      // If turn should end, wait X seconds and end turn
      if(shouldTurnEnd(turnStartTime)){
        endTurn();
      }
    }, 100);
  }

  /**
   * End a turn by changing to bot/player and incrementing round if needed
  */
  function endTurn(){
    // Clear shouldTurnEnd Interval
    clearInterval(shouldTurnEndInterval);
    shouldTurnEndInterval = undefined;
    // Ensure that all below code is only ran if there are no active delays
    if(!turnEndDelay){
      // Wait X seconds before ending turn
      turnEndDelay = setTimeout(function(){
        // Store whether or not the game has entered a new round
        var newRound = false;
        // If it was a bot's turn
        if(!playerTurn){
          // After bot takes turn round must increment
          roundNo++;
          newRound = true;
        }
        // If game is finished
        if(roundNo > MAX_ROUNDS){
          endGame();
        }else{
          // Move to next turn
          playerTurn = !playerTurn;
          turnInProgress = false;
          // Get the game scene ready
          initGameState(newRound);
          // If next turn is bot's take the turn
          if(!playerTurn){
            // TODO: Move to own function? Make more intelligent 
            // Wait 1 sec before bot launches
            botTurnDelay = setTimeout(takeTurn, 2000, 40);
          }
        }
        // Clear End Turn delay
        clearTimeout(turnEndDelay);
        turnEndDelay = undefined;
      }, TURN_END_DELAY);
    }
  }

  /**
    * Handle all projectile collisions
    * @param other_object
  */
  function handleProjectileCollision(other_object){
    // If projectile has collided with outer boundary, end the turn
    if(other_object.name === "BOUNDARY" && isTurnInProgress){
      endTurn();
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
    * Gets wether or not its the player's turn
  */
  function isPlayerTurn(){
    return playerTurn;
  }

  /**
    * Gets wether or not there is a turn in progress
  */
  function isTurnInProgress(){
    return turnInProgress;
  }

  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    changeState: changeState,
    startGame: startGame,
    endGame: endGame,
    takeTurn: takeTurn,
    endTurn: endTurn,
    handleProjectileCollision: handleProjectileCollision,
    getState: getState,
    isPlayerTurn: isPlayerTurn,
    isTurnInProgress: isTurnInProgress,
  };
}());

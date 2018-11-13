/**
  * game.js
  * Handle all the game logic, including screen changing etc.
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.1
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
  // Count how long the structure and projectile has been static for
  var structureStaticCount;
  var projectileStaticCount;
  var hasBallHitStructure;

  // A list of available structures to use
  var structurePool;
  // Store the currently used structure for both player and bot turn
  var currentStructure;
  // Store the bricks that make up the structure to calculate score
  var initialBricks;
  // Keep track of scores
  var playerScore;
  var botScore;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Initialize the game state to ensure the game is ready for a new turn
    * @param newRound - Whether or not the game has entered a new round
  */
  function initGameState(newRound){
    // Update Game Info UI
    Ui.updateGameInfo();

    // If game has entered a new round, choose a new (random) structure
    if(newRound){
      var randomIndex = Math.floor(Math.random() * STRUCTURES.length);
      currentStructure = STRUCTURES[randomIndex];

      // Remove current structure from the structure pool to prevent repeating
      structurePool = structurePool.filter(function(structure){
        return structure !== structurePool[randomIndex];
      });
    }

    // Initialize Scene ready for next turn
    ThreeComponents.initScene(currentStructure);
  }

  /**
    * Perform the necessary checks to decide if a given turn should end:
    * Turn should end if any of the following conditions are met
    * > Projectile has been static for X seconds and has not collided with structure
    * > All bricks within structure have been 'static' for X seconds
    *   (a brick is counted as static if it has fallen out of bounds) AND ball has collided with structure
    * > Ball is out of bounds and has not collided with structure (handled by collision system)
    * > Turn has lasted more than maximum allowed time
    * @param turnStartTime - The time the turn started
    * @returns true/false depending on if turn should end
  */
  function shouldTurnEnd(turnStartTime){
    // Count how long structure has been static for
    if(ThreeComponents.isStructureStatic() && hasBallHitStructure){
      structureStaticCount += SHOULD_TURN_END_INTERVAL;
    }else{
      structureStaticCount = 0;
    }

    // Count how long projectile has been static for
    if(ThreeComponents.isProjectileStatic() && !hasBallHitStructure){
      projectileStaticCount += SHOULD_TURN_END_INTERVAL;
    }else{
      projectileStaticCount = 0;
    }

    // Check if structure has been static for correct time OR if max turn length is reached OR if projectile is out of bounds
    return (ThreeComponents.getProjectilePosition().y < OUT_OF_BOUNDS_Y) && !hasBallHitStructure ||
           projectileStaticCount >= PROJECTILE_STATIC_LENGTH ||
           structureStaticCount >= STRUCTURE_STATIC_LENGTH ||
           (new Date() - turnStartTime) >= MAX_TURN_LENGTH;
  }

  /**
    * Calculate score and award to correct player
    * The score awarded for a given turn is:
    * The change in distance of EACH block, divided by the number of blocks in the structure
    * and multiplied by a set multiplier.
  */
  function awardScore(){
    var score = 0;
    var finalBricks = ThreeComponents.getBricksPosition();

    // Iterate through list of bricks within the structure
    // and compare each brick's initial position with its current position
    for(var i = 0; i < initialBricks.length; i++){
      // Convert brick position to 2D Vectors (ignore Z axis)
      var initialPos2d = new THREE.Vector2(initialBricks[i].x, initialBricks[i].y);
      var finalPos2d = new THREE.Vector2(finalBricks[i].x, finalBricks[i].y);

      // If the final y-position of a brick is 'out of bounds'. Cap it at that level.
      if(finalPos2d.y < OUT_OF_BOUNDS_Y){
        finalPos2d.y = OUT_OF_BOUNDS_Y;
      }

      // Increment score by distance between the two vectors
      score += Math.floor(initialPos2d.distanceTo(finalPos2d));
    }

    // Divide score by amount of bricks to ensure consistent scoring for different sized structures
    score = Math.floor((score / initialBricks.length) * SCORE_MULTIPLIER);

    // Award score to either bot or player
    if(playerTurn){
      playerScore += score;
    }else{
      botScore += score;
    }
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Changes the current state of the game
    * @param newState    console.log(structurePool);
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
        Ui.changeScreen(SCREEN.START_SCREEN);
        break;
      case STATE.PLAY:
        Ui.changeScreen(SCREEN.GAME_SCREEN);
        break;
      case STATE.END:
        Ui.changeScreen(SCREEN.END_SCREEN);
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
    // Initialize Structure Pool
    structurePool = STRUCTURES;
    playerTurn = true;
    roundNo = 1;
    playerScore = 0;
    botScore = 0;
    turnInProgress = false;
    structureStaticCount = 0;
    projectileStaticCount = 0;
    hasBallHitStructure = false;
    initGameState(true);
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
    // Update Scores
    Ui.updateGameInfo();
  }

  /**
    * Take a turn by launching the projectile using the ThreeComponents module.
    * @param power (5-50) - The power to apply to the launch
  */
  function takeTurn(direction, power){
    // The time that the turn started
    var turnStartTime = new Date();
    // Save all brick positions before turn is taken
    initialBricks = ThreeComponents.getBricksPosition();
    turnInProgress = true;
    ThreeComponents.launchProjectile(direction, power);
    // Check every second if the turn should end
    shouldTurnEndInterval = setInterval(function(){
      // If turn should end, end it
      if(shouldTurnEnd(turnStartTime)){
        endTurn();
      }
    }, SHOULD_TURN_END_INTERVAL);
  }

  /**
   * End a turn by changing to bot/player and incrementing round if needed
  */
  function endTurn(){
    // Only end a turn if the game is in PLAY state
    if(currentState === STATE.PLAY){
      // Clear shouldTurnEnd Interval
      clearInterval(shouldTurnEndInterval);
      shouldTurnEndInterval = undefined;
      // Reset structure static count
      structureStaticCount = 0;
      projectileStaticCount = 0;
      hasBallHitStructure = false;

      // Calculate score and award to correct player
      awardScore();
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
        // If next turn is bot's - have it take the turn
        if(!playerTurn){
          botTurnDelay = setTimeout(Opponent.takeTurn, 2000, currentStructure);
        }
      }
    }
  }

  /**
    * Handle all collisions that involve the projectile
    * @param other_obect - The object that the projectile collided with
  */
  function handleProjectileCollision(other_object){
    // If collided with brick, set correct flag
    if(other_object.name === "BRICK"){
      hasBallHitStructure = true;
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

  /**
    * Gets the player's score
  */
  function getPlayerScore(){
    return playerScore;
  }

  /**
    * Gets the bot's score
  */
  function getBotScore(){
    return botScore;
  }

  /**
    * Returns the game's current round number
  */
  function getRoundNo(){
    return roundNo;
  }

  /* ===== EXPORT PUBLIC METHODS ===== */

  return{
    changeState: changeState,
    startGame: startGame,
    endGame: endGame,
    takeTurn: takeTurn,
    handleProjectileCollision: handleProjectileCollision,
    endTurn: endTurn,
    getState: getState,
    isPlayerTurn: isPlayerTurn,
    isTurnInProgress: isTurnInProgress,
    getRoundNo: getRoundNo,
    getPlayerScore: getPlayerScore,
    getBotScore: getBotScore,
  };
}());

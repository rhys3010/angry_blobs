/**
  * opponent.js
  * Perform the necessary evaluation of the current structure and have the AI opponent
  * take its turn.
  * The AI will always attempt to apply full power but will have its power 'error-fied'
  * The AI will have 2 primary strategies:
  *   1. Aim for the structure's center
  *   2. Aim for the structure's foundation
  * (Both of these strategies will have an error chance)
  * These strategies will be decided based on the height of the structure:
  *   > If the structure is tall - aim for foundation
  *   > If the structure isnt tall - aim for center
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.3
*/

/**
  * Create opponent module
*/
var Opponent = (function(){

  // The error applied to the BOT's decisions
  // based on difficulty
  var opponentError;

  /* ===== PRIVATE METHODS ===== */

  /**
    * Evaluates the current structure to decide if tall or not:
    * "tall" is defined as a structure of atleast X layers,
    * with atlest 50% of layers containing a vertical brick
  */
  function isStructureTall(structure){
    // Decide if structure meets height requirements to be classified as 'tall'
    if(structure.length >= STRUCTURE_TALL_LAYERS){
      var verticalLayerCount = 0;

      // Check each layer and count the number of layers with a vertical brick
      for(var i = 0; i < structure.length; i++){
        layer:
        for(var j = 0; j < structure[i].length; j++){
          if(structure[i][j] === BRICK_VERTICAL){
            verticalLayerCount++;
            // Jump to next layer as soon as a vertical brick is found
            break layer;
          }
        }
      }

      // If atleast half of the layer contain a vertical brick
      if(verticalLayerCount >= (structure.length / 2)){
        return true;
      }
    }

    return false;
  }

  /**
    * Returns the position of the structure's foundation
    * The foundation of the structure will be the first brick of the structure
  */
  function getFoundationPos(structure){
    var origin = ThreeComponents.getProjectilePosition();
    // The first brick in the list
    return ThreeComponents.getBricksPosition()[0];
  }

  /**
    * Returns the position of the structure's center
  */
  function getCenterPos(structure){
    // Find the structure's centermost layer
    // (if even number of layers, round down)
    var centerLayer = Math.floor((structure.length - 1) / 2);
    // The index we use to search the internal list of bricks
    var brickIndex = 0;
    // The origin of the directional vector
    var origin = ThreeComponents.getProjectilePosition();
    // The center brick position (destination) of directional vector
    var bricksPos;

    // Convert the center brick's index to an index valid for
    // our internal list of bricks by counting how many bricks have
    // appeared before
    for(var i = 0; i < centerLayer; i++){
      for(var j = 0; j < structure[i].length; j++){
        if(structure[i][j] != BRICK_EMPTY){
          brickIndex++;
        }
      }
    }

    // Get the center brick's world co-ordinates
    return ThreeComponents.getBricksPosition()[brickIndex];
  }

  /**
    * Choose the power to apply to the turn based on a random selection within
    * the top X% of the range (depending on set error)
  */
  function choosePower(){
    // Set the minimum power to be the bottom of the random range
    var minPower = MAX_POWER - (MAX_POWER * opponentError);

    // Choose a random power within the top X% of the range
    return Math.floor(Math.random() * (MAX_POWER - minPower + 1)) + minPower;
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Take the turn by deciding which strategy to take, decided on optimum launch angle to hit target
    * and applying error to the direction of the shot
  */
  function takeTurn(structure){
    // The target position
    var targetPos;
    // The original vector between the projectile origin and the target
    var directionToTarget;
    var power = choosePower();

    // If structure is tall, launch projectile towards foundation of structure
    if(isStructureTall(structure)){
      targetPos = getFoundationPos(structure);
      // If structure isn't tall, launch projectile towards center of structure
    }else{
      targetPos = getCenterPos(structure);
    }

    // The vector from the projectile's origin to the target position (needed to 'work out' velocity)
    directionToTarget = new THREE.Vector3().subVectors(targetPos, ThreeComponents.getProjectilePosition()).normalize();

    // Work out the optimum launch angle needed to hit the target position
    // https://wikimedia.org/api/rest_v1/media/math/render/svg/4db61cb4c3140b763d9480e51f90050967288397
    // The above equation only works if the projectile's origin is 0,0,
    // Therefore we have to alter the target's x and y position to account for the offset
    // Once we have the optimum angle in radians we can convert it to a direcitonal vector
    var x = targetPos.x - ThreeComponents.getProjectilePosition().x;
    var y = targetPos.y - ThreeComponents.getProjectilePosition().y;
    // Change in Velocity = Impulse / Mass
    // Velocity needed some bodging so is not 100% mathematically correct :(
    // It is however very accurate and looks correct in-game.
    var v = ((directionToTarget.multiplyScalar(power).lengthSq()) / PROJECTILE_MASS) * 2;
    var g = 9.81;
    var sqrt = Math.pow(v, 4) - (g * (g * (x * x) + 2 * y * (v * v)));

    // The optimum launch angle (in radians)
    var angle = Math.atan2(((v * v) - Math.sqrt(sqrt)), g * x);

    // Convert the optimum angle to a directional vector towards the target
    direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle));

    // Apply error to y-direction of the shot
    // e.g. if y value is 0.6 and error value is 20%
    // y value can be any random value between 0.54 and 0.66
    var maxDirection = direction.y + (direction.y * opponentError);
    var minDirection = direction.y - (direction.y * opponentError);
    direction.setY(Math.random() * (maxDirection - minDirection) + minDirection);

    Game.takeTurn(direction, power);
  }

  /**
    * Set the error of the BOT based on difficulty
  */
  function setOpponentError(error){
    opponentError = error;
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    takeTurn: takeTurn,
    setOpponentError: setOpponentError,
  };

}());

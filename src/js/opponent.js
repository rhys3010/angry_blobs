/**
  * opponent.js
  * Perform the necessary evaluation of the current structure and have the AI opponent
  * take its turn.
  * The AI will always attempt to apply full power but will have its power selected
  * randomly within a high range (always 100% is too good)
  * The AI will have 2 primary strategies:
  *   1. Aim for the structure's center
  *   2. Aim for the structure's foundation
  * (Both of these strategies will have an error chance)
  * These strategies will be decided based on the height of the structure:
  *   > If the structure is tall - aim for foundation
  *   > If the structure isnt tall - aim for center
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.1
*/

/**
  * Create opponent module
*/
var Opponent = (function(){

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
    * Returns the direction of the structure's foundation
    * The foundation of the structure will be the first brick of the structure
  */
  function getFoundationVector(structure){
    var origin = ThreeComponents.getProjectilePosition();
    // The first brick in the list
    var brickPos = ThreeComponents.getBricksPosition()[0];

    // Return the directional vector between the origin and the brick
    return new THREE.Vector3().subVectors(brickPos, origin).normalize()
  }

  /**
    * Returns the vector of the structure's center
  */
  function getCenterVector(structure){
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

    brickPos = ThreeComponents.getBricksPosition()[brickIndex];

    // Return the directional vector between the origin and the brick
    return new THREE.Vector3().subVectors(brickPos, origin).normalize()
  }

  /**
    * Choose the power to apply to the turn based on a random selection within
    * the top 20% of the range (40-50)
  */
  function choosePower(){
    // Set the minimum power to be the bottom of the random range
    var minPower = MAX_POWER - (MAX_POWER * 0.20);

    // Choose a random power within the top 20% of the range
    return Math.floor(Math.random() * (MAX_POWER - minPower + 1) + minPower);;
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Take the turn
  */
  function takeTurn(structure){
    // If structure is tall, launch projectile towards foundation of structure
    if(isStructureTall(structure)){
      direction = getFoundationVector(structure);
      // If structure isn't tall, launch projectile towards center of structure
    }else{
      direction = getCenterVector(structure);
    }

    Game.takeTurn(direction, choosePower());
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    takeTurn: takeTurn,
  };

}());

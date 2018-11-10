/**
  * opponent.js
  * Perform the necessary evaluation of the current structure and have the AI opponent
  * take its turn.
  * The AI will always attempt to apply full power but will have its power selected
  * randomly within a high range (always 100% is too good)
  * The AI will have 2 primary strategies:
  *   1. Aim for the structure's center of gravity
  *   2. Aim for the structure's foundation
  * (Both of these strategies will have an error chance)
  * These strategies will be decided based on the height of the structure:
  *   > If the structure is tall - aim for foundation
  *   > If the structure isnt tall - aim for COG
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
    * Evaluates the current structure to decide which strategy to choose:
    * If the structure is "tall" - Use strategy 2.
    * If the structure isnt "tall" - Use strategy 1.
    * "tall" is defined as a structure of atleast X layers,
    * with X% of layers containing a vertical brick
  */
  function chooseStrategy(structure){
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


      Game.takeTurn(new THREE.Vector3(0.5, 0.1, 0), choosePower());
    }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    takeTurn: takeTurn,
  };

}());

/**
  * utility.js
  * Store all utility functions
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 04/11/2018
*/

/**
  * Create util module
*/
var Util = (function(){

  'use strict';

  /* ===== PUBLIC METHODS ===== */

  /**
    * Utility method to work out the vertical spacing required for a brick being placed
  */
  function calculateVerticalBrickSpacing(structure, indexX, indexY){
    var spacing = 0;

    // If indexY = 0, brick is on the bottom layer and therefore doesnt need spacing
    if(indexY === BRICK_EMPTY){
      return 0;
    }

    // Iterate through the structure until the brick's layer is reached and
    // increment the required spacing based on the orientation of the bricks below the subject brick
    for(var i = 0; i < indexY; i++){
      // If slot contains vertical block
      if(structure[i][indexX] === BRICK_VERTICAL){
        // Increment spacing by HEIGHT of brick
        spacing += BRICK_H;
      }
      // If slot contains horizontal block
      // (or if slot immediately to the left contains horizontal block) ...
      // blocks are always laid leftwards from position and occupy two slots
      if(structure[i][indexX] === BRICK_HORIZONTAL || structure[i][indexX-1] === BRICK_HORIZONTAL){
        // Increment spacing by WIDTH of brick
        spacing += BRICK_W;
      }
    }
    return spacing;
  }



  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    calculateVerticalBrickSpacing: calculateVerticalBrickSpacing,
  };

}());

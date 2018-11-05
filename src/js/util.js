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
    * Change the currently displayed screen by hiding/showing various DOM Elements. Screen is bound to current state
    * @param newScreen
  */
  function changeScreen(newScreen){
    var info = document.getElementById('info');

    // Hide all Screens
    $(SCREEN.START_SCREEN).hide();
    $(SCREEN.GAME_SCREEN).hide();
    $(SCREEN.END_SCREEN).hide();

    // Show newScreen
    switch(newScreen){
      case SCREEN.START_SCREEN:
        $(SCREEN.START_SCREEN).show();
        $(SCREEN.START_SCREEN).removeAttr("hidden");
        // Show info
        $(info).show();
        break;
      case SCREEN.GAME_SCREEN:
        $(SCREEN.GAME_SCREEN).show();
        $(SCREEN.GAME_SCREEN).removeAttr("hidden");
        // Hide info
        $(info).hide();
        break;
      case SCREEN.END_SCREEN:
        $(SCREEN.END_SCREEN).show();
        $(SCREEN.END_SCREEN).removeAttr("hidden");
        // Show info
        $(info).show();
        break;
      default:
        $(SCREEN.START_SCREEN).show();
    }
  }

  /**
    * Utility method to work out the vertical spacing required for a brick being placed
  */
  function calculateVerticalBrickSpacing(structure, indexX, indexY){
    var spacing = 0;

    // If indexY = 0, brick is on the bottom layer and therefore doesnt need spacing
    if(indexY === BLOCK_EMPTY){
      return 0;
    }

    // Iterate through the structure until the brick's layer is reached and
    // increment the required spacing based on the orientation of the bricks below the subject brick
    for(var i = 0; i < indexY; i++){
      // If slot contains vertical block
      if(structure[i][indexX] === BLOCK_VERTICAL){
        // Increment spacing by HEIGHT of brick
        spacing += BRICK_H;
      }
      // If slot contains horizontal block
      // (or if slot immediately to the left contains horizontal block) ...
      // blocks are always laid leftwards from position and occupy two slots
      if(structure[i][indexX] === BLOCK_HORIZONTAL || structure[i][indexX-1] === BLOCK_HORIZONTAL){
        // Increment spacing by WIDTH of brick
        spacing += BRICK_W;
      }
    }
    return spacing;
  }



  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    calculateVerticalBrickSpacing: calculateVerticalBrickSpacing,
    changeScreen: changeScreen,
  };

}());

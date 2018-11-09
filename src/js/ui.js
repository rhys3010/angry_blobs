/**
  * ui.js
  * Handle all of the game's UI components
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 9/11/2018
*/

/**
  * Create ui module
*/
var Ui = (function(){

  'use strict';

  var powerTooltip = document.getElementById('power-tooltip');

  /* ===== PRIVATE METHODS ===== */

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
    * Update the position of the power tool tip
  */
  function updateToolTipPosition(x, y){
    powerTooltip.style.top = (y + 20) + 'px';
    powerTooltip.style.left = (x - 30) + 'px';
  }

  /**
    * Update the value shown on the power tool tip
  */
  function updateToolTipValue(power){
    powerTooltip.innerHTML = "Power: " + Math.floor((power / MAX_POWER) * 100) + "%";
  }

  function showPowerToolTip(){
    powerTooltip.style.display = 'block';
  }

  function hidePowerToolTip(){
    powerTooltip.style.display = 'none';
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    changeScreen: changeScreen,
    updateToolTipPosition: updateToolTipPosition,
    updateToolTipValue: updateToolTipValue,
    showPowerToolTip: showPowerToolTip,
    hidePowerToolTip: hidePowerToolTip,
  };

}());

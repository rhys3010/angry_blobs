/**
  * ui.js
  * Handle all of the game's UI components
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 0.1
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
    powerTooltip.style.left = (x - 60) + 'px';
  }

  /**
    * Update the value shown on the power tool tip
  */
  function updateToolTipValue(power){
    var powerPercent = Math.floor((power / MAX_POWER) * 100);

    // Update progressbar + value
    $('#power-progress-bar').attr('aria-valuenow', powerPercent).css('width', powerPercent + '%');
    document.getElementById('power-label').innerHTML = powerPercent + '%';
  }

  function showPowerToolTip(){
    powerTooltip.style.display = 'block';
  }

  function hidePowerToolTip(){
    powerTooltip.style.display = 'none';
  }

  /**
    * Update on-screen displays (scores, round number, turn)
  */
  function updateGameInfo(){
    var roundLabel = document.getElementById('round-label');
    var outcomeLabel = document.getElementById('outcome-label');
    var playerScoreLabel;
    var botScoreLabel;

    // Update label according to game's state
    if(Game.getState() === STATE.PLAY){
      playerScoreLabel = document.getElementById('game-player-score-label');
      botScoreLabel = document.getElementById('game-bot-score-label');

      // Update label content
      roundLabel.innerHTML = "Round: " + Game.getRoundNo() + "/" + MAX_ROUNDS;
      playerScoreLabel.innerHTML = "You: " + Game.getPlayerScore();
      botScoreLabel.innerHTML = "BOT: " + Game.getBotScore();

      // Update turn indication
      if(Game.isPlayerTurn()){
        playerScoreLabel.style.color = 'yellow';
        botScoreLabel.style.color = 'white';
        SCREEN.GAME_SCREEN.style.cursor = 'crosshair';
      }else{
        playerScoreLabel.style.color = 'white';
        botScoreLabel.style.color = 'yellow';
        SCREEN.GAME_SCREEN.style.cursor = 'not-allowed';
      }
    }

    if(Game.getState() === STATE.END){
      playerScoreLabel = document.getElementById('end-player-score-label');
      botScoreLabel = document.getElementById('end-bot-score-label');

      if(Game.getPlayerScore() > Game.getBotScore()){
        outcomeLabel.innerHTML = "You Won!";
      }else if(Game.getPlayerScore() < Game.getBotScore()){
        outcomeLabel.innerHTML = "You Lost!";
      }else{
        outcomeLabel.innerHTML = "Draw!";
      }

      playerScoreLabel.innerHTML = "You - - - " + Game.getPlayerScore();
      botScoreLabel.innerHTML = "BOT - - - " + Game.getBotScore();
    }
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    changeScreen: changeScreen,
    updateToolTipPosition: updateToolTipPosition,
    updateToolTipValue: updateToolTipValue,
    showPowerToolTip: showPowerToolTip,
    hidePowerToolTip: hidePowerToolTip,
    updateGameInfo: updateGameInfo,
  };

}());

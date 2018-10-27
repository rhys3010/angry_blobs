/**
  * tests.js
  * qUnit tests to run on game logic. Will not work for UI tests
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 26/10/2018
*/

/**
  * Test that the state machine changes state value correctly
*/
QUnit.test("Test State Changes", function(assert){
  State.changeState(STATE.START);
  assert.equal(State.getState(), STATE.START, "Expected Sate: Start");

  State.changeState(STATE.PLAY);
  assert.equal(State.getState(), STATE.PLAY, "Expected Sate: Play");

  State.changeState(STATE.END);
  assert.equal(State.getState(), STATE.END, "Expected Sate: End");
});

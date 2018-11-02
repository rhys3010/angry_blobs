/**
  * threeComponents.js
  * Manage all Three.js scene components
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 02/11/2018
*/

/**
  * Create threeComponents module
*/
var ThreeComponents = (function(){

  // Three.js scene variables
  var camera, scene, renderer;

  // Scene/Game objects
  var ground, launcher, projectile, block, structure;


  /* ===== PRIVATE METHODS ===== */

  /**
    * Create the geometry, materials and meshes for each of the scene's objects
  */


  /**
    * Point Camera in correct direction and render scene
  */
  function render(){
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Initialize Three.js scene by adding camera, lights and initializing renderer
  */
  function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    // Move the camera away on the Z-axis to see the whole scene
    camera.position.set(0, 0, CAMERA_DIST);

    // Add Camera and Light(s) to scene
    scene.add(camera);

    // Initialize PhysiJs
    Physijs.scripts.worker = "../../vendor/physijs/physijs_worker.js";
    Physijs.scripts.ammo = "../../vendor/physijs/ammo.js";

    // Initialize renderer and add to DOM
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    SCREEN.GAME_SCREEN.appendChild(renderer.domElement);
  }

  /**
    * Animate the scene
  */
  function animate(){
    requestAnimationFrame(animate);
    render();
  }


  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    init: init,
    animate: animate,
  };

}());

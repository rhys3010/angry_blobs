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
    * Handle Window Resizing
  */
  function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
    * Create the geometry, materials and meshes for each of the scene's objects
  */
  function initObjects(){
    // Create and position ground
    var groundGeometry = new THREE.BoxGeometry(window.innerWidth, window.innerHeight/8, 100);
    var groundMaterial = new THREE.MeshBasicMaterial({color: 0x228B22});
    ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
    ground.position.set(0, -(window.innerHeight/2 - window.innerHeight/8), 0)

    // Create and position projectile mesh
    var projectileGeometry = new THREE.SphereGeometry(40, 32, 32);
    var projectileMaterial = new THREE.MeshBasicMaterial({color: 0x3342FF});
    projectile = new Physijs.SphereMesh(projectileGeometry, projectileMaterial, PROJECTILE_WEIGHT);


    scene.add(ground);
    scene.add(projectile);
  }

  /**
    * Point Camera in correct direction and render scene
  */
  function render(){
    // Physijs simulatoins
    scene.simulate();

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  /* ===== PUBLIC METHODS ===== */

  /**
    * Initialize Physijs scene by adding camera, lights and initializing renderer
  */
  function init(){
    // Initialize PhysiJs
    Physijs.scripts.worker = "../../vendor/physijs/physijs_worker.js";
    Physijs.scripts.ammo = "../../vendor/physijs/ammo.js";

    scene = new Physijs.Scene();
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    // Move the camera away on the Z-axis to see the whole scene
    camera.position.set(0, 0, CAMERA_DIST);

    // Add Camera and Light(s) to scene
    scene.add(camera);

    // Add objects
    initObjects();

    // Initialize renderer and add to DOM
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    SCREEN.GAME_SCREEN.appendChild(renderer.domElement);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
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

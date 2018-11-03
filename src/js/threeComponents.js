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
  var ground, projectile, block, structure, arrow;
  // The origin and direction  of the guiding arrow
  var arrowOrigin, arrowDirection;


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

    // Create and position the ground mesh
    var groundGeometry = new THREE.BoxGeometry(70, 5, 10);
    var groundMaterial = new THREE.MeshBasicMaterial({color: 0x228B22});
    ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
    // Set the ground to occupy 1/8th of the screen at the bottom
    ground.position.set(0, -15, 0)
    ground.__dirtyPosition = true;

    // Create and position projectile mesh
    var projectileGeometry = new THREE.SphereGeometry(1, 10, 10);
    var projectileMaterial = new THREE.MeshBasicMaterial({color: 0x3342FF});
    projectile = new Physijs.SphereMesh(projectileGeometry, projectileMaterial, 1);
    // Set the initial position of the projectile
    projectile.position.set(-30, -11.5, 0);
    projectile.__dirtyPosition = true;

    // Add Ground and Projectile to scene
    scene.add(ground);
    scene.add(projectile);
    scene.updateMatrixWorld(true);

    // Create Arrow and Add to scene
    var projectilePosition = new THREE.Vector3();
    arrowOrigin = projectilePosition.setFromMatrixPosition(projectile.matrixWorld);
    // Face arrow forwards by default
    arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), arrowOrigin, 3, 0xffffff, 0.6, 0.3);

    scene.add(arrow);
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
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1000);
    // Move the camera away on the Z-axis to see the whole scene
    camera.position.set(0, 0, 10);
    camera.zoom = 30;
    camera.updateProjectionMatrix();

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
    render();
    requestAnimationFrame(animate);
  }

  /**
    * Update the direction of the arrow given the current mouse co-ordinates
    * @param mouseX
    * @param mouseY
  */
  function updateArrowDir(mouseX, mouseY){
    // Plane to map mouse position onto using the raycaster
    var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    var raycaster = new THREE.Raycaster();
    // Mouse position vector
    var mouse = new THREE.Vector2();
    var intersect = new THREE.Vector3();

    // Occupy mouse vector from parameters
    mouse.x = mouseX;
    mouse.y = mouseY;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersect);

    arrowDirection = new THREE.Vector3().subVectors(intersect, arrowOrigin).normalize()

    // Face the arrow towards the intersect point
    arrow.setDirection(arrowDirection);
  }


  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    init: init,
    animate: animate,
    updateArrowDir: updateArrowDir,
  };
}());

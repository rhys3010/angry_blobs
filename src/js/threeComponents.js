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
  var ground, projectile, arrow;
  // The origin and direction  of the guiding arrow
  var arrowOrigin, arrowDirection;
  // Initialize empty bricks list to store threejs meshes
  var bricks = [];


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
    * Create the structure of bricks that the player will aim for
    * @param structure - a 2D Array representing the structure
  */
  function createStructure(structure){
    // Create ThreeJS Geometry and material for the bricks
    var brickGeometry = new THREE.BoxGeometry(BRICK_W, BRICK_H, BRICK_D);
    var brickMaterial = new THREE.MeshBasicMaterial({color: 0xcccc00});

    // Iterate through the structure array. Create and position the bricks accordingly
    // Start right->left, bottom->top
    // If brick is vertical, the gap between each brick should be 4 (width of brick - height)
    // If brick is horizontal, the gap between each brick should be 2 (the height of the brick)
    for(var i = 0; i < structure.length; i++){
      var layer = structure[i];
      for(var j = 0; j < layer.length; j++){
        // Create brick mesh
        var brick = new Physijs.BoxMesh(brickGeometry, brickMaterial, 1);

        // The horizontal space between bricks
        var BRICK_SPACING_X;

        // If there is no brick in the layer's slot skip to next iteration
        if(layer[j] != BLOCK_EMPTY){
          // Vertical
          if(layer[j] === BLOCK_VERTICAL){
            // Set the space between the bricks:
            BRICK_SPACING_X = BRICK_H - BRICK_W;
            // Work out X position for brick by placing at the far right of the screen (30 + spacing),
            // then move further away from the edge for each brick after
            var posX = (30 + BRICK_SPACING_X) - (BRICK_SPACING_X * (j+1));
            // Work out the Y position for brick by placing on the ground (-9.5), then move upwards depending on the bricks below it
            // The brick's vertical spacing will vary depending on the orientation of the bricks below it
            var posY = -9.5 + Util.calculateVerticalBrickSpacing(structure, j, i);
            // Position brick accordingly
            brick.position.set(posX, posY, 0);
          }

          // Horizontal
          if(layer[j] === BLOCK_HORIZONTAL){
            // Set the space between the bricks:
            BRICK_SPACING_X = BRICK_W;
            // Rotate brick 90 degrees across z-axis to make flat
            brick.rotation.z = Math.PI / 2;
            // Work out X position for brick by placing at the far right of the screen (30 + spacing),
            // then move further away from the edge for each brick after
            var posX = (30 + BRICK_SPACING_X) - ((BRICK_H - BRICK_W) * (j+1));
            // Work out the Y position for brick by placing on the ground (-9.5), then move upwards depending on the bricks below it
            // The brick's vertical spacing will vary depending on the orientation of the bricks below it
            var posY = (-9.5 - BRICK_W) + Util.calculateVerticalBrickSpacing(structure, j, i);

            // Position brick accordingly
            brick.position.set(posX, posY, 0);
          }

          // Mark brick pos as dirty and add to scene
          brick.__dirtyPosition = true;
          scene.add(brick);
          // Add to bricks list
          bricks.push(brick);
        }
      }
    }
  }


  /**
    * Create the geometry, materials and meshes for each of the scene's objects
  */
  function createObjects(){

    // Create and position the ground mesh
    var groundGeometry = new THREE.BoxGeometry(70, 5, 60);
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

    // (Re)create Arrow and Add to scene
    var projectilePosition = new THREE.Vector3();
    arrowOrigin = projectilePosition.setFromMatrixPosition(projectile.matrixWorld);
    // Face arrow forwards by default
    arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), arrowOrigin, 3, 0xffffff, 0.6, 0.3);

    scene.add(arrow);
  }

  /**
    * Remove the current structure from the scene to allow the
    * generation of another.
  */
  function removeStructure(){
    for(var i = 0; i < bricks.length; i++){
      // Completely remove object from scene
      scene.remove(bricks[i]);
      bricks[i].geometry.dispose();
      bricks[i].material.dispose();
    }
    // Empty the bricks list
    bricks = [];
  }


  /* ===== PUBLIC METHODS ===== */

  /**
    * Create the scene by adding camera, lights, renderer and objects
  */
  function create(){
    // Initialize PhysiJs
    Physijs.scripts.worker = "../../vendor/physijs/physijs_worker.js";
    Physijs.scripts.ammo = "../../vendor/physijs/ammo.js";

    scene = new Physijs.Scene();
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1000);
    // Move the camera away on the Z-axis to see the whole scene
    camera.position.set(0, 0, 50);
    camera.zoom = 30;
    camera.updateProjectionMatrix();

    // Add Camera and Light(s) to scene
    scene.add(camera);

    // Add objects
    createObjects();

    // Initialize renderer and add to DOM
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Assign ID to renderer's dom element - for reference in userInput module
    renderer.domElement.id = 'game-canvas';
    SCREEN.GAME_SCREEN.appendChild(renderer.domElement);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
  }

  /**
    * Render the scene
  */
  function render(){
    // Physijs simulatoins
    scene.simulate();
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  /**
    * Initialize the scene by placing all objects in their default positions
    * and placing new structure.
    * @param structure - the definintion for the structure to be displayed
  */
  function initScene(structure){
    // Reset projectile velocity
    projectile.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    projectile.setAngularVelocity(new THREE.Vector3(0, 0, 0));

    // Set reusable Object positions to default
    ground.position.set(0, -15, 0)
    ground.__dirtyPosition = true;
    projectile.position.set(-30, -11.5, 0);
    projectile.__dirtyPosition = true;

    // Show arrow
    arrow.visible = true;

    // Remove Previous Structure
    removeStructure();

    // Generate the provided structure
    createStructure(structure);

    // update scene
    scene.updateMatrixWorld(true);
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

  /**
    * Launch the projectile:
    * Set the direction of the launch to that of the guide arrow
    * Multiply the directional vector by a scalar (5-50) depending on power chosen
    * @param power
  */
  function launchProjectile(power){
    projectile.setLinearVelocity(arrowDirection.multiplyScalar(power));
    // Hide arrow
    arrow.visible = false;
  }


  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    create: create,
    render: render,
    updateArrowDir: updateArrowDir,
    launchProjectile: launchProjectile,
    initScene: initScene,
  };
}());

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
  var ground, projectile, arrow, boundary;
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
        var brick = new Physijs.BoxMesh(brickGeometry, brickMaterial, BRICK_MASS);
        brick.name = "BRICK";
        // The horizontal space between bricks so that there is room for horizontal bridge above
        var BRICK_SPACING_X = BRICK_H - BRICK_W;

        // If there is no brick in the layer's slot skip to next iteration
        if(layer[j] != BRICK_EMPTY){
          // Vertical
          if(layer[j] === BRICK_VERTICAL){
            // Set the X position of the brick so that it stands with the correct spacing (multiplied depending on number of bricks in row)
            var posX = (30 + BRICK_SPACING_X) - (BRICK_SPACING_X * (j + 1));
            // Set the Y position of the brick to stand on the ground (this will be relative to the brick's height)
            // Then increment the y position depending on the blocks that lay below it (util function)
            var posY = (ground.position.y + ground.geometry.parameters.height / 2) + (BRICK_H - BRICK_H / 2) + Util.calculateVerticalBrickSpacing(structure, j, i);
            // Position brick accordingly
            brick.position.set(posX, posY, 0);
          }

          // Horizontal
          if(layer[j] === BRICK_HORIZONTAL){
            // Rotate brick 90 degrees across z-axis to make flat
            brick.rotation.z = Math.PI / 2;
            brick.__dirtyRotation = true;
            // Position the horizontal brick such that it's rightmost point is equal to a vertical brick's
            var posX = (30 + BRICK_SPACING_X) - (BRICK_H / 2 - BRICK_W / 2) - (BRICK_SPACING_X * (j + 1));
            // Set the Y position of the brick to stand on the ground (this will be relative to the brick's width)
            // Then increment the y position depending on the blocks that lay below it (util function)
            var posY = (ground.position.y + ground.geometry.parameters.height / 2) + (BRICK_W - BRICK_W / 2) + Util.calculateVerticalBrickSpacing(structure, j, i);

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
    // Create invisible scene boundary to detect projectile collisions
    var boundaryGeometry = new THREE.BoxGeometry(1000, 0.5, 100);
    var boundaryMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

    // Place boundary below the scene and make invisible
    boundary = new Physijs.BoxMesh(boundaryGeometry, boundaryMaterial, 0);
    boundary.name = "BOUNDARY";
    boundary.position.set(0, -13, 0);
    boundary.__dirtyPosition = true;
    boundary.visible = false;

    // Create and position the ground mesh
    var groundGeometry = new THREE.BoxGeometry(70, 5, 60);
    var groundMaterial = new THREE.MeshBasicMaterial({color: 0x228B22});
    ground = new Physijs.BoxMesh(groundGeometry, groundMaterial, 0);
    ground.name = "GROUND";
    // Set the ground to occupy 1/8th of the screen at the bottom
    ground.position.set(0, -15, 0)
    ground.__dirtyPosition = true;

    // Create and position projectile mesh
    var projectileGeometry = new THREE.SphereGeometry(PROJECTILE_RADIUS, 20, 20);
    var projectileMaterial = new THREE.MeshBasicMaterial({color: 0x3342FF});
    projectile = new Physijs.SphereMesh(projectileGeometry, projectileMaterial, PROJECTILE_MASS);
    projectile.name = "PROJECTILE";
    // Set the initial position of the projectile
    projectile.position.set(-30, (ground.position.y + ground.geometry.parameters.height / 2) + PROJECTILE_RADIUS, 0);
    projectile.__dirtyPosition = true;
    // Bind collision handling
    projectile.addEventListener('collision', Game.handleProjectileCollision);

    // Add boundary and game objects to scene
    scene.add(boundary);
    scene.add(ground);
    scene.add(projectile);
    scene.updateMatrixWorld(true);

    // (Re)create Arrow and Add to scene
    var projectilePosition = new THREE.Vector3();
    arrowOrigin = projectilePosition.setFromMatrixPosition(projectile.matrixWorld);
    // Face arrow forwards by default
    arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), arrowOrigin, 3, 0xffffff, 0.6, 0.3);
    arrow.name = "ARROW";
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
    // Bind scene.simulate() to run independently of scene rendering
    scene.addEventListener(
      'update',
      function(){
        scene.simulate();
      }
    );
    scene.simulate();

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
    projectile.position.set(-30, (ground.position.y + ground.geometry.parameters.height / 2) + PROJECTILE_RADIUS, 0);
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
    // Multiply arrow direction vector by power
    projectile.applyCentralImpulse(arrowDirection.multiplyScalar(power));
    // Reset Arrow Direction to default position
    arrowDirection = new THREE.Vector3(0.5, 0.3, 0);
    // Hide arrow
    arrow.visible = false;
  }

  /**
    * Returns whether or not the projectile is moving
  */
  function isProjectileStatic(){
    // Approximation as velocity might never reach 0
    var zero = 0.0001;
    return (projectile.getLinearVelocity().lengthSq() < zero && projectile.getAngularVelocity().lengthSq() < zero);
  }

  /**
    * Returns an ordered list of brick positions
    * @returns bricksPos - A list of all brick positions
  */
  function getBricksPosition(){
    var bricksPos = [];
    for(var i = 0; i < bricks.length; i++){
      var position = new THREE.Vector3().setFromMatrixPosition(bricks[i].matrixWorld);
      bricksPos.push(position)
    }

    return bricksPos;
  }


  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    create: create,
    render: render,
    updateArrowDir: updateArrowDir,
    launchProjectile: launchProjectile,
    initScene: initScene,
    isProjectileStatic: isProjectileStatic,
    getBricksPosition: getBricksPosition,
  };
}());

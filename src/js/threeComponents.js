/**
  * threeComponents.js
  * Manage all Three.js scene components
  *
  * @author Rhys Evans (rhe24@aber.ac.uk)
  * @version 1.0
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
  var textureLoader = new THREE.TextureLoader();
  // Initialize empty bricks list to store threejs meshes
  var bricks = [];


  /* ===== PRIVATE METHODS ===== */

  /**
    * Handle Window Resizing
  */
  function onWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  /**
    * Create the geometry, materials and meshes for each of the scene's objects
  */
  function createObjects(){

    // Create Skybox and set as scene background
    // Skybox from: https://reije081.home.xs4all.nl/skyboxes/
    // License: https://creativecommons.org/licenses/by-nc-sa/3.0/
    var skyboxMaterials = [
      './src/assets/textures/skybox/px.bmp',
      './src/assets/textures/skybox/nx.bmp',
      './src/assets/textures/skybox/py.bmp',
      './src/assets/textures/skybox/ny.bmp',
      './src/assets/textures/skybox/pz.bmp',
      './src/assets/textures/skybox/nz.bmp',
    ];
    var skyboxTexture = new THREE.CubeTextureLoader().load(skyboxMaterials);

    scene.background = skyboxTexture;

    // Create and position the ground mesh
    var groundGeometry = new THREE.BoxGeometry(70, 1, 20);
    // Load Marble texture for ground
    // Texture from: https://pixabay.com/en/white-background-pattern-tile-2398946/
    // Resized to 1024x1024
    // License: https://pixabay.com/en/service/terms/#usage
    var groundTexture = textureLoader.load('./src/assets/textures/marble.jpg', function(map){
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.aniosotropy = 4;
      map.repeat.set(5, 1);
    });
    var groundMaterial = new THREE.MeshPhongMaterial({map: groundTexture});
    ground = new Physijs.BoxMesh(groundGeometry, Physijs.createMaterial(groundMaterial, GROUND_FRICTION, GROUND_RESTITUTION), 0);
    ground.name = "GROUND";
    // Set the ground to occupy 1/8th of the screen at the bottom
    ground.position.set(0, -15, 0)
    ground.__dirtyPosition = true;
    ground.receiveShadow = true;

    // Create Projectile
    var projectileGeometry = new THREE.SphereGeometry(PROJECTILE_RADIUS, 50, 50);
    var projectileMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});

    projectile = new Physijs.SphereMesh(projectileGeometry, Physijs.createMaterial(projectileMaterial, PROJECTILE_FRICTION, PROJECTILE_RESTITUTION), PROJECTILE_MASS);
    projectile.name = "PROJECTILE";
    // Set the initial position of the projectile
    projectile.position.set(-30, (ground.position.y + ground.geometry.parameters.height / 2) + PROJECTILE_RADIUS, 0);
    projectile.__dirtyPosition = true;
    projectile.castShadow = true;
    // Bind collision handling
    projectile.addEventListener('collision', Game.handleProjectileCollision);

    // Add game objects to scene
    scene.add(ground);
    scene.add(projectile);
    scene.updateMatrixWorld(true);

    // (Re)create Arrow and Add to scene
    var projectilePosition = new THREE.Vector3();
    arrowOrigin = projectilePosition.setFromMatrixPosition(projectile.matrixWorld);
    // Face arrow forwards by default
    arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), arrowOrigin, 5, 0xffffff, 1, 0.5);
    arrow.name = "ARROW";

    scene.add(arrow);
  }

  /**
    * Create the structure of bricks that the player will aim for
    * @param structure - a 2D Array representing the structure
  */
  function createStructure(structure){
    // Create ThreeJS Geometry and material for the bricks
    var brickGeometry = new THREE.BoxGeometry(BRICK_W, BRICK_H, BRICK_D);
    // Texte from: https://freestocktextures.com/texture/closeup-wood-grain-plank,315.html
    // Resized to 2048x2048
    // License: https://freestocktextures.com/license/
    var brickTexture = textureLoader.load('./src/assets/textures/wood.jpg', function(map){
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.aniosotropy = 4;
      map.repeat.set(2, 1, 0);
    });
    var brickMaterial = new THREE.MeshPhongMaterial({map: brickTexture});

    // Iterate through the structure array. Create and position the bricks accordingly
    // Start right->left, bottom->top
    // If brick is vertical, the gap between each brick should be 4 (width of brick - height)
    // If brick is horizontal, the gap between each brick should be 2 (the height of the brick)
    for(var i = 0; i < structure.length; i++){
      var layer = structure[i];
      for(var j = 0; j < layer.length; j++){
        // Create brick mesh
        var brick = new Physijs.BoxMesh(brickGeometry, Physijs.createMaterial(brickMaterial, BRICK_FRICTION, BRICK_RESTITUTION), BRICK_MASS);
        brick.name = "BRICK";
        brick.receiveShadow = true;
        brick.castShadow = true;
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
            var posY = (ground.position.y + ground.geometry.parameters.height / 2) + (BRICK_H - BRICK_H / 2) + calculateVerticalBrickSpacing(structure, j, i);
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
            var posY = (ground.position.y + ground.geometry.parameters.height / 2) + (BRICK_W - BRICK_W / 2) + calculateVerticalBrickSpacing(structure, j, i);

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


  /* ===== PUBLIC METHODS ===== */

  /**
    * Create the scene by adding camera, lights, renderer and objects
  */
  function create(){
    // Initialize PhysiJs
    Physijs.scripts.worker = "./vendor/physijs/physijs_worker.js";
    Physijs.scripts.ammo = "./ammo.js";

    scene = new Physijs.Scene();
    // Bind scene.simulate() to run independently of scene rendering
    scene.addEventListener(
      'update',
      function(){
        scene.simulate();
      }
    );
    scene.simulate();

    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0, 1000);
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    // Move the camera away on the Z-axis to see the whole scene
    camera.position.set(0, 0, 50);

    // Add Camera and Light(s) to scene
    scene.add(camera);

    // Add objects
    createObjects();

    // Add Lighting
    var hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.2);
    scene.add(hemiLight);

    var pointLight = new THREE.PointLight(0xffffff, 1, 200, 1);
    pointLight.castShadow = true;
    pointLight.position.set(30, 30, 30);
    scene.add(pointLight);

    // Initialize renderer and add to DOM
    renderer = new THREE.WebGLRenderer({antialias: true});
    // Shadow stuff
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.soft = true;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadoMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    // Update Arrow Color and Direction
    if(Game.isPlayerTurn()){
      arrow.setColor(new THREE.Color('yellow'));
    }else{
      arrow.setColor(new THREE.Color('white'));
      arrow.setDirection(new THREE.Vector3(0.5, 0.3, 0));
    }


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
    * @returns arrowDirection
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

    return arrowDirection;
  }

  /**
    * Launch the projectile:
    * Set the direction of the launch to that of the guide arrow
    * Multiply the directional vector by a scalar (5-50) depending on power chosen
    * @param direction
    * @param power
  */
  function launchProjectile(direction, power){

    // Multiply directional vector by power
    projectile.applyCentralImpulse(direction.multiplyScalar(power));

    // Hide arrow
    arrow.visible = false;
  }

  /**
    * Returns whether or not the individual bricks that make up the structure are all static
    * A brick is counted as 'static' if it has fallen out of bounds
  */
  function isStructureStatic(){
    // Approximation as velocity might never reach absolute 0
    var epsilon = 0.0001;

    for(var i = 0; i < bricks.length; i++){
      // If any of the bricks are still moving (and still in bounds) return false
      if(bricks[i].getLinearVelocity().lengthSq() > epsilon && bricks[i].getAngularVelocity().lengthSq() > epsilon && getBricksPosition()[i].y > OUT_OF_BOUNDS_Y){
        return false;
      }
    }
    return true;
  }

  function isProjectileStatic(){
    // Approximation as velocity might never reach absolute 0
    var epsilon = 0.0001;

    return projectile.getLinearVelocity().lengthSq() < epsilon && projectile.getAngularVelocity().lengthSq() < epsilon;
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

  /**
    * Returns the world position of the projectile
  */
  function getProjectilePosition(){
    return new THREE.Vector3().setFromMatrixPosition(projectile.matrixWorld);
  }

  /* ===== EXPORT PUBLIC METHODS ===== */
  return{
    create: create,
    render: render,
    updateArrowDir: updateArrowDir,
    launchProjectile: launchProjectile,
    initScene: initScene,
    isStructureStatic: isStructureStatic,
    isProjectileStatic: isProjectileStatic,
    getBricksPosition: getBricksPosition,
    getProjectilePosition: getProjectilePosition,
  };
}());

import React, { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  AbstractMesh,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Color4,
  AssetsManager,
  MeshAssetTask,
  DirectionalLight,
  Color3,
  TransformNode,
  StandardMaterial,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";


// Grid setup
const GRID_SIZE = 25;
const TILE_SIZE = 40;
const halfGrid = GRID_SIZE / 2;
const TILE_GAP = 0.025;
const STEP = TILE_SIZE + TILE_GAP;

const tiles = {
  'wall_north': {
    meshPrefix: 'Mesh2_',
  },
  'glow_square': {
    meshPrefix: 'Mesh17',
  },
  'solid_square': {
    meshPrefix: 'Mesh27',
  },
  'default_square': {
    meshPrefix: 'Mesh19',
  },
  'vent_square': {
    meshPrefix: 'Mesh11',
  },
  'octogon_square': {
    meshPrefix: 'Mesh',
  },
}

Engine.DefaultLoadingScreenFactory = () => ({
  displayLoadingUI: () => { },
  hideLoadingUI: () => { },
  loadingUIBackgroundColor: "",
  loadingUIText: ""
});

const FactoryFloorGame = () => {
  const canvasRef = useRef(null);


  const initializeScene = () => {
    // Initialize Babylon.js
    const engine = new Engine(canvasRef.current, true);

    const scene = new Scene(engine);
    scene.collisionsEnabled = true; // 👈 Add this

    let fadeAlpha = 0; // Start fully transparent
    scene.clearColor = new Color4(0.1, 0.1, 0.15, fadeAlpha); // Your bg color + alpha

    // After assets load (in meshTask.onSuccess):
    const fadeIn = () => {
      fadeAlpha += 0.01;
      scene.clearColor.a = fadeAlpha;
      if (fadeAlpha < 1) {
        requestAnimationFrame(fadeIn);
      }
    };

    // camera controls
    const camera = new ArcRotateCamera(
      "industrialOverlordCam",
      Math.PI / 2, // Azimuth (side view)
      Math.PI / 6, // Elevation (30 degree angle)
      400, // Double the original distance (200 -> 400)
      Vector3.Zero(),
      scene
    );

    // Lock camera controls
    camera.lowerRadiusLimit = camera.upperRadiusLimit = 400; // Fixed distance
    camera.lowerBetaLimit = Math.PI / 6; // Minimum vertical angle
    camera.upperBetaLimit = Math.PI / 3; // Maximum vertical angle
    camera.inputs.attached.mousewheel.detachControl();

    // Cinematic orthographic projection
    const zoomFactor = 1; // Twice as large (0.5 = 2x zoom)
    camera.orthoTop = (GRID_SIZE * TILE_SIZE / 2) * zoomFactor; // Double the area
    camera.orthoBottom = (-GRID_SIZE * TILE_SIZE / 2) * zoomFactor;
    camera.orthoLeft = (-GRID_SIZE * TILE_SIZE / 4) * zoomFactor;
    camera.orthoRight = (GRID_SIZE * TILE_SIZE / 4) * zoomFactor;


    // Lighting
    const envLight = new HemisphericLight("envLight", new Vector3(0, 1, 0), scene);
    envLight.intensity = 0.1;
    envLight.groundColor = new Color3(0.3, 0.3, 0.4); // Cool shadows
    const sunLight = new DirectionalLight("sunLight", new Vector3(-1, -2, -1), scene);
    sunLight.intensity = 0.25;
    sunLight.shadowEnabled = true; // Optional dynamic shadows

    // Existing player placeholder setup
    const createPlayer = (scene: Scene) => {
      const container = new TransformNode("playerContainer", scene);
      // Start the container at ground level (0)
      container.position = new Vector3(0, 0, 0);

      const placeholder = MeshBuilder.CreateSphere("player_placeholder",
        { diameter: 10 }, scene);
      placeholder.isPickable = false;
      // Position the placeholder 40 units above the container
      placeholder.position = new Vector3(0, 40, 0);
      placeholder.parent = container;

      return {
        container,
        placeholder,
        model: null as AbstractMesh | null
      };
    };

    const player = createPlayer(scene);
    camera.setTarget(player.container);
    camera.lockedTarget = player.container;

    const movePlayerTo = (target: Vector3) => {
      const duration = 1000;
      let startTime = Date.now();
      const startPos = player.container.position.clone();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Move only the X and Z coordinates, keeping Y at 0 (height handled by model position)
        player.container.position = new Vector3(
          startPos.x + (target.x - startPos.x) * easeProgress,
          0, // Container stays at ground level
          startPos.z + (target.z - startPos.z) * easeProgress
        );
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    const handleTileClick = (tileGroup: TransformNode) => {
      const meshes = tileGroup.getChildMeshes(true).filter(m => m.isEnabled() && m.isVisible);

      // Calculate the true world-space center of all visible tile meshes
      let min = new Vector3(Infinity, Infinity, Infinity);
      let max = new Vector3(-Infinity, -Infinity, -Infinity);

      meshes.forEach(mesh => {
        const boundingInfo = mesh.getBoundingInfo();
        const worldMin = Vector3.TransformCoordinates(boundingInfo.boundingBox.minimum, mesh.getWorldMatrix());
        const worldMax = Vector3.TransformCoordinates(boundingInfo.boundingBox.maximum, mesh.getWorldMatrix());

        min = Vector3.Minimize(min, worldMin);
        max = Vector3.Maximize(max, worldMax);
      });

      const worldCenter = Vector3.Lerp(min, max, 0.5);
      // Move player to the calculated center
      movePlayerTo(new Vector3(
        worldCenter.x,
        0, // Player height
        worldCenter.z
      ));
    };

    // Create factor floor Function
    const createFloor = (task: MeshAssetTask) => {
      // Hide all original meshes
      task.loadedMeshes.forEach(mesh => {
        mesh.isVisible = false;
        mesh.setEnabled(false);
      });

      // Create a map of tile types to their meshes (now arrays)
      const tileMeshes: Record<string, AbstractMesh[]> = {};

      Object.entries(tiles).forEach(([tileName, tileDef]) => {
        tileMeshes[tileName] = task.loadedMeshes.filter(mesh =>
          mesh.name.includes(tileDef.meshPrefix)
        );
      });

      // ✨ NEW: Visible mesh centering function
      const getVisibleBoundingCenter = (mesh: AbstractMesh): Vector3 => {
        const allMeshes = [mesh, ...mesh.getChildMeshes()].filter(m => m.isVisible);
        if (allMeshes.length === 0) return Vector3.Zero();

        let min = new Vector3(Infinity, Infinity, Infinity);
        let max = new Vector3(-Infinity, -Infinity, -Infinity);

        allMeshes.forEach(m => {
          const boundingInfo = m.getBoundingInfo();
          // ✅ Correct method names:
          min = Vector3.Minimize(min, boundingInfo.boundingBox.minimum);
          max = Vector3.Maximize(max, boundingInfo.boundingBox.maximum);
        });

        return Vector3.Lerp(min, max, 0.5);
      };

      for (let x = 0; x < GRID_SIZE; x++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          // Create parent node for this tile
          const xPos = (x - halfGrid) * (TILE_SIZE + TILE_GAP);
          const zPos = (z - halfGrid) * (TILE_SIZE + TILE_GAP);
          const tileGroup = new TransformNode(`tile_group_${x}_${z}`, scene);
          tileGroup.position = new Vector3(
            xPos,
            0,
            zPos
          );

          // Determine which tile type to use
          const getTileType = (x: number, z: number) => {
            return (x + z) % 2 === 0 ? 'solid_square' : 'glow_square';
          }
          const tileType = getTileType(x, z);
          const sourceMeshes = tileMeshes[tileType];

          // Clone all meshes for this tile type
          sourceMeshes.forEach((sourceMesh, index) => {
            const tileClone = sourceMesh.clone(`tile_${tileType}_${index}_${x}_${z}`, null);
            if (tileClone) {
              // Reset transforms
              tileClone.isVisible = true;
              tileClone.position = Vector3.Zero();
              tileClone.rotation = Vector3.Zero();
              tileClone.scaling = Vector3.One();
              tileClone.metadata.z = z;
              tileClone.metadata.x = x;
              // center the tile
              const visibleCenter = getVisibleBoundingCenter(tileClone);
              tileClone.position.subtractInPlace(visibleCenter);
              // color the Tile
              if (tileClone.material?.name === "M_0063_GreenYellow") {
                (tileClone.material as StandardMaterial).diffuseColor = new Color3(1, 0, 0);      // Base color (red)
                (tileClone.material as StandardMaterial).emissiveColor = new Color3(0, 1, 0);     // Glow (green)
                (tileClone.material as StandardMaterial).ambientColor = new Color3(0.2, 0.2, 0.2)
              }
              tileClone.parent = tileGroup;
              tileClone.setEnabled(true);
            }
          });
        }
      }
    };

    scene.onPointerDown = (evt, pickInfo) => {
      if (pickInfo.hit) {
        let mesh = pickInfo.pickedMesh;
        while (mesh && !mesh.name.startsWith("tile_group_")) {
          mesh = mesh.parent as AbstractMesh;
        }

        if (mesh) {
          handleTileClick(mesh as TransformNode);
        }
      }
    };

    // 🌟 Modern AssetsManager approach
    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;

    // Load floor tiles (existing)
    const floorTask = assetsManager.addMeshTask(
      "load-floor",
      "",
      "/models/", // Your models directory
      "floor_tiles_parts.glb"
    );

    // NEW: Add player model loading task
    const playerTask = assetsManager.addMeshTask(
      "load-player",
      "",
      "/models/", // Same directory as floor tiles
      "cube_robot_-_animated.glb" // Your player model file
    );

    floorTask.onSuccess = (task) => {
      console.log("GLB loaded successfully");
      createFloor(task);
      fadeIn();
    };

    floorTask.onError = (task, message) => {
      console.error("GLB load failed:", message);
    };

    playerTask.onSuccess = (task) => {
      const rootMesh = task.loadedMeshes[0];
      if (rootMesh) {
        player.placeholder.setEnabled(false);
        rootMesh.parent = player.container;
        // Position the model 40 units above the container
        rootMesh.position = new Vector3(0, 40, 0);
        rootMesh.scaling = new Vector3(40, 40, 40);
        
        task.loadedMeshes.forEach(mesh => {
          mesh.isPickable = false;
        });
        
        player.model = rootMesh;
      }
    };

    playerTask.onError = (task, message) => {
      console.error("Player model failed to load:", message);
    };

    assetsManager.load();

    // Render loop
    engine.runRenderLoop(() => scene.render());

    // Cleanup
    return () => {
      engine.dispose();
    }
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    // Initialize the scene when the component mounts
    initializeScene();
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
};

export default FactoryFloorGame;


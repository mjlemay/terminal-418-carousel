import React, { use, useEffect, useRef } from 'react';
import {
  AppProviderValues,
} from '../lib/types';
import { useContext } from 'react';
import { Context } from '../lib/appContext';
import { allianceArray } from '../lib/constants';
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
  PointLight,
  Material,
  ActionManager,
  ExecuteCodeAction
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";


// Grid setup
const GRID_SIZE = 30;
const TILE_SIZE = 40;
const halfGrid = GRID_SIZE / 2;
const TILE_GAP = 0.025;
const INDICATOR_SIZE = TILE_SIZE * 0.8; // Slightly smaller than tile
const INDICATOR_HEIGHT = 5; // Height above tiles

const factionGlow = [
  {
    diffuseColor: new Color3(1, 0, 0),
    emissiveColor: new Color3(1, 0, 0),
    ambientColor: new Color3(1, 0, 0),
  },
  {
    diffuseColor: new Color3(1, 1, 0),
    emissiveColor: new Color3(1, 1, 0),
    ambientColor: new Color3(1, 1, 0),
  },
  {
    diffuseColor: new Color3(0, 1, 1),
    emissiveColor: new Color3(0, 1, 1),
    ambientColor: new Color3(0, 1, 1),
  },
  {
    diffuseColor: new Color3(0, 0, 0),
    emissiveColor: new Color3(0.25, 0.25, 0.25),
    ambientColor: new Color3(0.2, 0.2, 0.2),
  },
];

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
    meshPrefix: 'Mesh17',
  },
  'vent_square': {
    meshPrefix: 'Mesh11',
  },
  'grate_square': {
    meshPrefix: 'Mesh19',
  },
  'octogon_square': {
    meshPrefix: 'Mesh21',
  },
  'wires_square': {
    meshPrefix: 'Mesh7_',
  },
}

Engine.DefaultLoadingScreenFactory = () => ({
  displayLoadingUI: () => { },
  hideLoadingUI: () => { },
  loadingUIBackgroundColor: "",
  loadingUIText: ""
});


const FactoryFloorGame = () => {
  const {
    state,
    getTiles = () => { },
    setSelectedTile = () => { },
  }: AppProviderValues = useContext(Context);
  const { factoryTiles, selectedTile } = state;
  const tileDataHash = factoryTiles
    .map(t => `${t.tile_name}:${JSON.stringify(t.meta)}:${t.updated_at || ''}`)
    .join('|');

  // Refs
  const canvasRef = useRef(null);
  const indicatorRef = useRef<Mesh | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const tileGroupsRef = useRef<TransformNode[]>([]);

  const updateTiles = (latestTiles = factoryTiles) => {
    if (!sceneRef.current || !tileGroupsRef.current.length || !latestTiles.length) {
      return;
    }

    tileGroupsRef.current.forEach(tileGroup => {
      const tileName = tileGroup.name;
      const tileDatum = latestTiles.find(tile => tile.tile_name === tileName);
      const defaultTileMeta = {
        tileType: 'glow_square',
        poweredBy: "default",
      };
      const tileMeta = tileDatum ? JSON.parse(tileDatum.meta as string) : defaultTileMeta;
      const glowIndex = allianceArray.indexOf(tileMeta.poweredBy);
      const allianceGlow = factionGlow[glowIndex >= 0 ? glowIndex : 3];
      tileGroup.getChildMeshes(false).forEach(mesh => {
        if (mesh.material?.name.includes("M_0063") || mesh.material?.name.includes("alliance_material")) { // More flexible name check
          // Create new material for each mesh
          const newMaterial = new StandardMaterial(`tile_${tileName}_alliance_material`, sceneRef.current!);

          // Apply faction colors
          newMaterial.diffuseColor = allianceGlow.diffuseColor.clone();
          newMaterial.emissiveColor = allianceGlow.emissiveColor.clone();
          newMaterial.ambientColor = allianceGlow.ambientColor.clone();

          // Configure material properties
          newMaterial.specularColor = Color3.Black(); // No specular highlights
          newMaterial.alpha = 1.0;

          // Apply to mesh
          mesh.material = newMaterial;

          // Dispose old material if needed
          if (mesh.material && mesh.material !== newMaterial) {
            mesh.material.dispose();
          }
        }
      });
    });

    sceneRef.current!.getEngine().clear(sceneRef.current!.clearColor, true, true);
    sceneRef.current!.render(); // Force immediate render
    sceneRef.current!.freeActiveMeshes();
  };

  const initializeScene = () => {
    // Initialize Babylon.js
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;
    // Disable all keyboard inputs
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        evt.sourceEvent.preventDefault();
      })
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        evt.sourceEvent.preventDefault();
      })
    );
    scene.collisionsEnabled = true;
    let fadeAlpha = 0;
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
      300,
      Vector3.Zero(),
      scene
    );

    // Lock camera controls
    camera.lowerRadiusLimit = camera.upperRadiusLimit = 300; // Fixed distance
    camera.lowerBetaLimit = Math.PI / 6; // Minimum vertical angle
    camera.upperBetaLimit = Math.PI / 3; // Maximum vertical angle
    camera.inputs.attached.mousewheel.detachControl();

    // Cinematic orthographic projection
    const zoomFactor = 1; // Twice as large (0.5 = 2x zoom)
    camera.orthoTop = (GRID_SIZE * TILE_SIZE / 2) * zoomFactor; // Double the area
    camera.orthoBottom = (-GRID_SIZE * TILE_SIZE / 2) * zoomFactor;
    camera.orthoLeft = (-GRID_SIZE * TILE_SIZE / 4) * zoomFactor;
    camera.orthoRight = (GRID_SIZE * TILE_SIZE / 4) * zoomFactor;


    const createSciFiLights = (scene: Scene) => {
      // Cool blue ambient fill light
      const ambientLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
      ambientLight.intensity = 0.2;
      ambientLight.groundColor = new Color3(0.1, 0.1, 0.3);
      ambientLight.diffuse = new Color3(0.3, 0.3, 0.8);

      // Neon directional lights (multiple for sci-fi effect)
      const neonLight1 = new DirectionalLight("neon1", new Vector3(-0.5, -1, 0.5), scene);
      neonLight1.intensity = 0.4;
      neonLight1.diffuse = new Color3(0, 1, 1); // Cyan
      neonLight1.specular = new Color3(0.5, 1, 1);

      const neonLight2 = new DirectionalLight("neon2", new Vector3(1, -0.7, -0.5), scene);
      neonLight2.intensity = 0.3;
      neonLight2.diffuse = new Color3(1, 0, 1); // Magenta
      neonLight2.specular = new Color3(1, 0.5, 1);

      // Add glowing emissive light from below
      const floorLight = new PointLight("floorGlow", new Vector3(0, -10, 0), scene);
      floorLight.diffuse = new Color3(0.2, 0.8, 1);
      floorLight.intensity = 0.5;
      floorLight.range = 100;
    };
    createSciFiLights(scene);

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
    const createIndicator = () => {
      const indicator = MeshBuilder.CreateBox("tileIndicator", {
        width: INDICATOR_SIZE,
        height: 2, // Thin box
        depth: INDICATOR_SIZE
      }, scene);

      indicator.isPickable = false;
      indicator.visibility = 0; // Start hidden
      indicator.position.y = INDICATOR_HEIGHT;

      // Create material with opacity
      const indicatorMat = new StandardMaterial("indicatorMat", scene);
      indicatorMat.emissiveColor = new Color3(1, 0, 0.6); // Yellow glow
      indicatorMat.diffuseColor = new Color3(0.5, 0.5, 0.5); // Base yellow
      indicatorMat.alpha = 0.25;
      indicatorMat.transparencyMode = Material.MATERIAL_ALPHABLEND; // Enable transparency

      // For proper transparency rendering
      indicatorMat.backFaceCulling = false;
      indicatorMat.zOffset = -1; // Helps prevent depth issues

      indicator.material = indicatorMat;
      indicatorRef.current = indicator;
      return indicator;
    };

    const indicator = createIndicator();

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
      // Show and position the indicator
      if (indicatorRef.current) {
        indicatorRef.current.visibility = 1;
        indicatorRef.current.position.x = tileGroup.position.x;
        indicatorRef.current.position.z = tileGroup.position.z;
        setSelectedTile(tileGroup.name as string);
      }

      // Calculate the true world-space center of all visible tile meshes
      const meshes = tileGroup.getChildMeshes(true).filter(m => m.isEnabled() && m.isVisible);
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
      updateTiles();
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

      tileGroupsRef.current = [];

      for (let x = 0; x < GRID_SIZE; x++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          // Create parent node for this tile
          const xPos = (x - halfGrid) * (TILE_SIZE + TILE_GAP);
          const zPos = (z - halfGrid) * (TILE_SIZE + TILE_GAP);
          const tileName = `tile_group_${x}_${z}`;
          const tileGroup = new TransformNode(tileName, scene);
          tileGroup.position = new Vector3(
            xPos,
            0,
            zPos
          );


          const tileType = 'glow_square';
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
              tileClone.parent = tileGroup;
              tileClone.setEnabled(true);

              tileGroupsRef.current.push(tileGroup);
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
      createFloor(task);
      fadeIn();
      updateTiles();
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
    // Add this to your render loop
    engine.runRenderLoop(() => {
      if (indicatorRef.current) {
        // Gentle pulsing animation with opacity variation
        const pulse = Math.sin(performance.now() * 0.005) * 0.15;
        indicatorRef.current.scaling.y = 1 + pulse;

        // Slightly modulate opacity during pulse
        if (indicatorRef.current.visibility > 0) {
          (indicatorRef.current.material as StandardMaterial).alpha = 0.25 + pulse;
        }
      }
      scene.render();
    });

    // Cleanup
    return () => {
      if (indicatorRef.current) {
        indicatorRef.current.dispose();
      }
      engine.dispose();
    };
  }

  useEffect(() => {
    const loadDataAndInitialize = async () => {
      await getTiles?.();
      if (canvasRef.current && state.factoryTiles) {
        initializeScene();
      }
    };
    loadDataAndInitialize();
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !tileGroupsRef.current.length) return;

    // Use requestAnimationFrame to ensure scene is ready
    const frameId = requestAnimationFrame(() => {
      updateTiles();
    });

    return () => cancelAnimationFrame(frameId);
  }, [tileDataHash, factoryTiles]);

  useEffect(() => {
    if (sceneRef.current) updateTiles();
  }, [selectedTile]);

  useEffect(() => {
    return () => {
      // Clean up tile groups when component unmounts
      tileGroupsRef.current.forEach(group => group.dispose());
      tileGroupsRef.current = [];
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
};

export default FactoryFloorGame;


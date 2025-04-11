import React, { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  AbstractMesh,
  ArcRotateCamera,
  DefaultRenderingPipeline,
  HemisphericLight,
  Vector3,
  Color4,
  AssetsManager,
  MeshAssetTask,
  DirectionalLight,
  Color3,
  TransformNode,
  AxesViewer
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";

const GRID_SIZE = 25;
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

const FactoryFloorGame = () => {
  const canvasRef = useRef(null);

  const initializeScene = () => {

    // Initialize Babylon.js
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.1, 0.1, 0.15, 0.25);
    const camera = new ArcRotateCamera(
      "atmosphericCam",
      -Math.PI / 2.5,  // More dynamic angle
      Math.PI / 3.5,   // 60° downward tilt
      150,             // Closer for intimacy
      Vector3.Zero(),
      scene
    );
    camera.fov = 0.8;                          // Narrower FOV for drama
    camera.lowerRadiusLimit = 50;               // Prevent clipping
    camera.upperRadiusLimit = 500;              // Max zoom out
    camera.inertia = 0.85;                     // Smooth movements
    camera.attachControl(canvasRef.current, true);
    const envLight = new HemisphericLight("envLight", new Vector3(0, 1, 0), scene);
    envLight.intensity = 0.1;
    envLight.groundColor = new Color3(0.3, 0.3, 0.4); // Cool shadows
    const sunLight = new DirectionalLight("sunLight", new Vector3(-1, -2, -1), scene);
    sunLight.intensity = 0.25;
    sunLight.shadowEnabled = true; // Optional dynamic shadows

    const pipeline = new DefaultRenderingPipeline(
      "moodPipeline",
      true, // HDR
      scene,
      [camera]
    );
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.7;
    pipeline.bloomWeight = 0.3;


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

      // Grid setup
      const TILE_SIZE = 40;
      const halfGrid = GRID_SIZE / 2;
      const TILE_GAP = 0.025;

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
          const getTileType = (x:number, z:number) => {
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

              // 🔥 NEW: Center based on VISIBLE geometry only
              const visibleCenter = getVisibleBoundingCenter(tileClone);
              tileClone.position.subtractInPlace(visibleCenter);

              tileClone.parent = tileGroup;
              tileClone.setEnabled(true);
              
              // Remove vent_square special case - no longer needed
              // as getVisibleBoundingCenter handles all cases
            }
          });
        }
      }
    };



    // 🌟 Modern AssetsManager approach
    const assetsManager = new AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask(
      "load-glb",
      "",
      "/glbs/",
      "floor_tiles_parts.glb"
    );

    meshTask.onSuccess = (task) => {
      console.log("GLB loaded successfully");
      createFloor(task);
    };

    meshTask.onError = (task, message) => {
      console.error("GLB load failed:", message);
    };

    assetsManager.load();

    // Render loop
    engine.runRenderLoop(() => scene.render());

    // Cleanup
    return () => engine.dispose();
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


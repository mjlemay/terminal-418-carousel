import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, StandardMaterial, Color3, Mesh } from '@babylonjs/core';

const FactoryFloorGame = () => {
  const canvasRef = useRef(null);
  const stonesRef = useRef<{ mesh: Mesh; x: number; z: number; player: string }[]>([]); // Track stones
  const currentPlayerRef = useRef('black'); // Black starts first

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Babylon.js
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera(
      "camera", -Math.PI / 2, Math.PI / 3, 15, Vector3.Zero(), scene
    );
    camera.attachControl(canvasRef.current, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Create Go Board
    const createBoard = () => {
      const board = MeshBuilder.CreateGround("board", { width: 19, height: 19 }, scene);
      board.material = new StandardMaterial("boardMat", scene);
      (board.material as StandardMaterial).diffuseColor = new Color3(0.8, 0.7, 0.5); // Wooden color

      // Grid lines
      for (let i = 0; i < 19; i++) {
        MeshBuilder.CreateLines("lineX", {
          points: [new Vector3(-9, 0, i - 9), new Vector3(9, 0, i - 9)]
        }, scene);
        MeshBuilder.CreateLines("lineZ", {
          points: [new Vector3(i - 9, 0, -9), new Vector3(i - 9, 0, 9)]
        }, scene);
      }
    };
    createBoard();

    // Handle stone placement
    scene.onPointerDown = (_, pickResult) => {
      if (pickResult.hit) {
        if (!pickResult.pickedPoint) return;
        const { x, z } = pickResult.pickedPoint;
        const gridX = Math.round(x);
        const gridZ = Math.round(z);

        // Check if position is empty
        const existingStone = stonesRef.current.find(s => s.x === gridX && s.z === gridZ);
        if (existingStone) return;

        // Create stone
        const stone = MeshBuilder.CreateSphere("stone", { diameter: 0.9 }, scene);
        stone.position.set(gridX, 0.5, gridZ);
        stone.material = new StandardMaterial("stoneMat", scene);
        (stone.material as StandardMaterial).diffuseColor = currentPlayerRef.current === 'black' 
          ? new Color3(0, 0, 0) 
          : new Color3(1, 1, 1);

        stonesRef.current.push({ mesh: stone, x: gridX, z: gridZ, player: currentPlayerRef.current });
        currentPlayerRef.current = currentPlayerRef.current === 'black' ? 'white' : 'black';
      }
    };

    // Render loop
    engine.runRenderLoop(() => scene.render());

    // Cleanup
    return () => engine.dispose();
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
};

export default FactoryFloorGame;
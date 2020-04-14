import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Animation } from '@babylonjs/core/Animations/animation'
import { Node } from '@babylonjs/core/node'

import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import { GridMaterial } from '@babylonjs/materials/grid'

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import '@babylonjs/core/Meshes/meshBuilder'

const create = (canvas: HTMLCanvasElement) => { 
  // Associate a Babylon Engine to it.
  const engine = new Engine(canvas)

  // Create our first scene.
  var scene = new Scene(engine)

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero())

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true)

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7

  return { scene, engine }
}

const addShapes = (scene : Scene) => {
  // Create a grid material
  var material = new GridMaterial('grid', scene)

  // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
  var sphere = Mesh.CreateSphere('sphere1', 16, 2, scene)
  sphere.position.y = 4
  sphere.material = material

  var box = Mesh.CreateBox("box", 2, scene, true); // default box
  box.position = new Vector3(3, 2, 2)
  box.rotation = new Vector3(Math.PI / 4, Math.PI / 4, 0)
  box.material = material

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  var ground = Mesh.CreateGround('ground1', 6, 6, 2, scene)

  // Affect a material
  ground.material = material

  animate(box)
  animate(sphere)

  return {
    animate: () => {
      scene.beginAnimation(box, 0, 100, true);
      scene.beginAnimation(sphere, 0, 100, true);
    }
  }
}

const animate = (node: Node) => {
  // Animation.CreateAndStartAnimation("anim1", node, "scaling.x", 30, 120, 1.0, 1.5)

  var animationBox = new BABYLON.Animation("myAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  
  // An array with all animation keys
  var keys: any[] = []; 

  //At the animation key 0, the value of scaling is "1"
  keys.push({
    frame: 0,
    value: 1
  });

  //At the animation key 20, the value of scaling is "0.2"
  keys.push({
    frame: 20,
    value: 0.2
  });

  //At the animation key 100, the value of scaling is "1"
  keys.push({
    frame: 100,
    value: 1
  });

  animationBox.setKeys(keys);

  node.animations = [];
  node.animations.push(animationBox);
}

export const runScene = (canvas: HTMLCanvasElement) => {
  const { scene, engine } = create(canvas)

  const { animate } = addShapes(scene)

  // Render every frame
  engine.runRenderLoop(() => {
    scene.render()
  })

  animate()
}

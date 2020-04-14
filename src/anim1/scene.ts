import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Node,
  Animation
} from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'

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

const addShapes = (scene: Scene) => {
  // Create a grid material
  var material = new GridMaterial('grid', scene)

  // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
  var sphere = MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene)
  sphere.position.y = 4
  sphere.material = material

  var box = MeshBuilder.CreateBox('box', { width: 2, height: 3, depth: 1 }, scene)
  box.position = new Vector3(3, 2, 2)
  box.rotation = new Vector3(Math.PI / 4, Math.PI / 4, 0)
  box.material = material

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  var ground = MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)

  // Affect a material
  ground.material = material

  animate(box)
  animate(sphere)

  return {
    animate: () => {
      scene.beginAnimation(box, 0, 100, true)
      scene.beginAnimation(sphere, 0, 100, true)
    },
  }
}

const animate = (node: Node) => {
  var animationBox = new Animation(
    'myAnimation',
    'scaling.x',
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  )

  // An array with all animation keys
  var keys: any[] = []

  //At the animation key 0, the value of scaling is "1"
  keys.push({
    frame: 0,
    value: 1,
  })

  //At the animation key 20, the value of scaling is "0.2"
  keys.push({
    frame: 20,
    value: 0.2,
  })

  //At the animation key 100, the value of scaling is "1"
  keys.push({
    frame: 100,
    value: 1,
  })

  animationBox.setKeys(keys)

  node.animations = []
  node.animations.push(animationBox)
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

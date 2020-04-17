import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Color3,
  MeshBuilder,
  StandardMaterial,
} from '@babylonjs/core'
import { minBound, maxBound, boundsMidpoint, boundsSize } from '../bounds'

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  scene.ambientColor = new Color3(1, 1, 1)
  scene.collisionsEnabled = true

  const camera = new FreeCamera(
    'camera1',
    new Vector3(0, maxBound.y * 2, minBound.z * 5),
    scene
  )

  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  addBoundingBox(scene)

  return scene
}

export const addBoundingBox = (scene: Scene) => {
  const bounds = MeshBuilder.CreateBox(
    'boundBox',
    {
      ...boundsSize,
    },
    scene
  )
  bounds.position = boundsMidpoint
  bounds.isPickable = false

  const material = new StandardMaterial('boundsMaterial', scene)
  material.diffuseColor = new Color3(1, 1, 1)
  material.wireframe = true
  // material.alpha = 0.3
  // material.backFaceCulling  = false

  bounds.material = material
}

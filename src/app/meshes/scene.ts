import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Color3,
  ArcRotateCamera,
} from '@babylonjs/core'
import { minBound, maxBound } from '../settings'

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  scene.ambientColor = new Color3(1, 1, 1)
  scene.collisionsEnabled = true

  const camera = new ArcRotateCamera(
    'Camera',
    0,
    0,
    15,
    new Vector3(0, maxBound.y * 1.5, minBound.z * 1.2),
    scene
  )

  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  return scene
}

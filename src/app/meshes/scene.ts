import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  Color3,
  ArcRotateCamera,
} from '@babylonjs/core'
import { regions } from '../settings'

export const createScene = (engine: Engine, canvas: HTMLCanvasElement) => {
  const scene = new Scene(engine)
  scene.ambientColor = new Color3(1, 1, 1)
  scene.collisionsEnabled = true

  const camera = new ArcRotateCamera(
    'Camera',
    0,
    0,
    regions.stage.depth,
    Vector3.Zero(),
    //new Vector3(0, regions.stage.depth, -regions.stage.depth),
    scene
  )

  camera.setPosition(
    new Vector3(regions.stage.midX, regions.stage.depth, -regions.stage.depth)
  )
  camera.attachControl(canvas, true)

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  return scene
}

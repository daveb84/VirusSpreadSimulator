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
import { minBound, maxBound } from './bounds'

export class AppScene {
  private _canvas: HTMLCanvasElement
  private _scene: Scene
  private _engine: Engine

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas

    this.init()
  }

  public get scene() {
    return this._scene
  }

  public get engine() {
    return this._engine
  }

  private init() {
    const canvas = this._canvas

    // Associate a Babylon Engine to it.
    const engine = new Engine(canvas)

    // Create our first scene.
    const scene = new Scene(engine)
    scene.ambientColor = new Color3(1, 1, 1)

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera(
      'camera1',
      new Vector3(0, maxBound.y * 2, -15),
      scene
    )
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    const bounds = MeshBuilder.CreateBox(
      'boundBox',
      {
        width: maxBound.x - minBound.x,
        height: maxBound.y - minBound.y,
        depth: maxBound.z - minBound.z,
      },
      scene
    )
    bounds.position.x = 0
    bounds.position.y = 0
    bounds.position.z = 0

    const material = new StandardMaterial('boundsMaterial', scene)
    material.diffuseColor = new Color3(1, 1, 1)
    material.wireframe = true
    // material.alpha = 0.3
    // material.backFaceCulling  = false

    bounds.material = material

    this._scene = scene
    this._engine = engine
  }

  public start() {
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }
}

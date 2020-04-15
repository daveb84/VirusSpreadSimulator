import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
} from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'

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
    var scene = new Scene(engine)

    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Create a grid material
    var material = new GridMaterial('grid', scene)

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = MeshBuilder.CreateGround(
      'ground1',
      { width: 6, height: 6, subdivisions: 2 },
      scene
    )
    ground.position = new Vector3(0, -3, 0)
    ground.material = material

    this._scene = scene
    this._engine = engine
  }

  public start() {
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }
}

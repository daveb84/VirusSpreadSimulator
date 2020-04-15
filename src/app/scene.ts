import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Color3,
} from '@babylonjs/core'

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
    scene.ambientColor = new Color3(1, 1, 1)

    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    var light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    this._scene = scene
    this._engine = engine
  }

  public start() {
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }
}

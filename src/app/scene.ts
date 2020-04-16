import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Color3,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from '@babylonjs/core'
import { minBound, maxBound, boundsMidpoint, boundsSize } from './bounds'
import groundImage from '../images/ground.jpg'

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
    this._engine = engine

    // Create our first scene.
    const scene = new Scene(engine)
    this._scene = scene
    scene.ambientColor = new Color3(1, 1, 1)

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera(
      'camera1',
      new Vector3(0, maxBound.y * 2, minBound.z * 5),
      scene
    )
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    this.addBoundingBox()
    this.addGround()
  }

  private addBoundingBox() {
    const bounds = MeshBuilder.CreateBox(
      'boundBox',
      {
        ...boundsSize,
      },
      this._scene
    )
    bounds.position = boundsMidpoint

    const material = new StandardMaterial('boundsMaterial', this._scene)
    material.diffuseColor = new Color3(1, 1, 1)
    material.wireframe = true
    // material.alpha = 0.3
    // material.backFaceCulling  = false

    bounds.material = material
  }

  private addGround() {
    const ground = MeshBuilder.CreateGround('ground', {
      width: boundsSize.width,
      height: boundsSize.depth,
    })
    ground.position.x = boundsMidpoint.x
    ground.position.y = minBound.y
    ground.position.z = boundsMidpoint.z

    const material = new StandardMaterial('groundMaterial', this._scene)
    material.diffuseTexture = new Texture(groundImage, this._scene)

    ground.material = material
  }

  public start() {
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }
}

import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
} from '@babylonjs/core'
import { minBound, maxBound, boundsMidpoint, boundsSize } from './bounds'

export class AppScene {
  public readonly scene: Scene
  private readonly engine: Engine

  public obstacles: Mesh[] = []

  constructor(canvas: HTMLCanvasElement) {
    // Associate a Babylon Engine to it.
    this.engine = new Engine(canvas)

    // Create our first scene.
    this.scene = new Scene(this.engine)

    const scene = this.scene
    scene.ambientColor = new Color3(1, 1, 1)
    scene.collisionsEnabled = true

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
  }

  private addBoundingBox() {
    const bounds = MeshBuilder.CreateBox(
      'boundBox',
      {
        ...boundsSize,
      },
      this.scene
    )
    bounds.position = boundsMidpoint

    const material = new StandardMaterial('boundsMaterial', this.scene)
    material.diffuseColor = new Color3(1, 1, 1)
    material.wireframe = true
    // material.alpha = 0.3
    // material.backFaceCulling  = false

    bounds.material = material
  }

  public start() {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}

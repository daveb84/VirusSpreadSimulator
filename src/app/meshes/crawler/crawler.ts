import {
  Scene,
  Vector3,
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Material,
  Animatable,
} from '@babylonjs/core'
import { minBound, maxBound } from '../../bounds'
import { generateNumber } from '../../../utils/random'
import { moveCrawler, createDirection } from './moveCrawler'
import {
  CollisionState,
  ICollisionStateSettings,
  IObstacle,
} from '../../collisions'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2

export interface CrawlerSettings {
  defaultMaterial: Material
  infectedMaterial: Material
  collisionMaterial: Material
  traceMaterial: Material
}

export const getCrawlerSettings = (scene: Scene) => {
  const defaultMaterial = new StandardMaterial('crawlerMat1', scene)
  const infectedMaterial = new StandardMaterial('crawlerMat2', scene)
  const collisionMaterial = new StandardMaterial('crawlerMat3', scene)
  const traceMaterial = new StandardMaterial('crawlerMat3', scene)

  defaultMaterial.diffuseColor = new Color3(0.5, 0.5, 1)
  infectedMaterial.diffuseColor = new Color3(1, 0.4, 0.4)

  collisionMaterial.diffuseColor = new Color3(0.7, 0.3, 0.3)
  collisionMaterial.alpha = 0.1

  traceMaterial.diffuseColor = new Color3(1, 1, 1)

  const settings: CrawlerSettings = {
    defaultMaterial,
    infectedMaterial,
    collisionMaterial,
    traceMaterial,
  }

  return settings
}

export class Crawler {
  public readonly mesh: Mesh
  private readonly collisionState: CollisionState

  private moveAnimations: Animatable[] = []
  private _moving: boolean = false
  private _infected: boolean = false

  private direction: Vector3 | null = null

  constructor(private scene: Scene, private settings: CrawlerSettings) {
    this.mesh = MeshBuilder.CreateBox('crawler', dimensions, this.scene)
    this.mesh.material = settings.defaultMaterial
    this.mesh.animations = []

    this.collisionState = this.createCollisionState()
    this.setRandomPosition()
  }

  public get infected() {
    return this._infected
  }

  public get moving() {
    return this._moving
  }

  start() {
    this.move()
  }

  stop() {
    this._moving = false
    if (this.moveAnimations.length) {
      this.moveAnimations.forEach((x) => x.stop())
    }

    this.moveAnimations.splice(0, this.moveAnimations.length)
  }

  private createCollisionState() {
    const movingMesh = {
      getCurrentPosition: () => this.mesh.position,
      getCurrentDirection: () => this.direction,
      stopCurrentMovement: () => this.stop(),
      startNewDirection: (direction: Vector3) => this.move(direction),
    }

    const settings = {
      splatMaterial: this.settings.collisionMaterial,
    }

    return new CollisionState(this.scene, movingMesh, settings)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.collisionState.collide(obstacle, this.mesh.position)

    this._infected = true
    this.mesh.material = this.settings.infectedMaterial
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }

  private move(direction?: Vector3 | undefined) {
    if (direction === undefined) {
      direction = createDirection()
    }

    this.direction = direction

    const from = this.mesh.position.clone()
    const to = from.add(direction)

    this.drawTrace(from, to)

    const animation = moveCrawler(this.mesh, from, to, () =>
      this.onMoveComplete()
    )

    this.moveAnimations.push(animation)
    this._moving = true
  }

  private onMoveComplete() {
    this.collisionState.onMoveComplete()
    this.moveAnimations.splice(0, this.moveAnimations.length)

    if (this._moving) {
      this.move()
    }
  }

  private drawTrace(from: Vector3, to: Vector3) {
    const line = MeshBuilder.CreateLines(
      'lines',
      { points: [from, to], updatable: false },
      this.scene
    )
    line.material = this.settings.traceMaterial
  }
}

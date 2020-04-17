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
import { CollisionState, IObstacle } from '../../collisions'

const traceEnabled = false
const collisionMarkingEnabled = false

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2

export interface CrawlerSettings {
  materials: {
    default: Material
    infected: Material
    collisionMarker: Material
    trace: Material
  }
  trace: boolean
  markCollisions: boolean
}

export const getCrawlerSettings = (scene: Scene) => {
  const materials = {
    default: new StandardMaterial('crawlerMat1', scene),
    infected: new StandardMaterial('crawlerMat2', scene),
    collisionMarker: new StandardMaterial('crawlerMat3', scene),
    trace: new StandardMaterial('crawlerMat3', scene),
  }

  materials.default.diffuseColor = new Color3(0.5, 0.5, 1)
  materials.infected.diffuseColor = new Color3(1, 0.4, 0.4)

  materials.collisionMarker.diffuseColor = new Color3(0.7, 0.3, 0.3)
  materials.collisionMarker.alpha = 0.8

  materials.trace.diffuseColor = new Color3(1, 1, 1)

  const settings: CrawlerSettings = {
    materials,
    trace: traceEnabled,
    markCollisions: collisionMarkingEnabled,
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
    this.mesh.material = settings.materials.default
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
      markCollisions: collisionMarkingEnabled,
      markerMaterial: this.settings.materials.collisionMarker,
    }

    return new CollisionState(this.scene, movingMesh, settings)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.collisionState.collide(obstacle, this.mesh.position)

    this._infected = true
    this.mesh.material = this.settings.materials.infected
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
    if (!this.settings.trace) {
      return
    }

    const line = MeshBuilder.CreateLines(
      'lines',
      { points: [from, to], updatable: false },
      this.scene
    )
    line.material = this.settings.materials.trace
  }
}
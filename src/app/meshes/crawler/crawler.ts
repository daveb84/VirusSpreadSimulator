import { Scene, Vector3, Mesh, MeshBuilder, Animatable } from '@babylonjs/core'
import { generateNumber } from '../../../utils/random'
import { moveCrawler, createDirection } from './moveCrawler'
import { CollisionState, IObstacle } from '../../collisions'
import { traceMove } from '../../../utils/trace'
import { traceEnabled, minBound, maxBound } from '../../settings'
import { getCommonMaterials } from '../materials'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2

export class Crawler {
  public readonly mesh: Mesh
  private readonly collisionState: CollisionState

  private moveAnimations: Animatable[] = []
  private _moving: boolean = false
  private _infected: boolean = false

  private direction: Vector3 | null = null
  private materials = getCommonMaterials()

  constructor(private scene: Scene) {
    this.mesh = MeshBuilder.CreateBox('crawler', dimensions, this.scene)
    this.mesh.material = this.materials.default
    this.mesh.animations = []
    this.mesh.isPickable = true

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

    return new CollisionState(this.scene, movingMesh)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.collisionState.collide(obstacle, this.mesh.position)
  }

  infect() {
    this._infected = true
    this.mesh.material = this.materials.infected
  }

  public setPosition(position: Vector3) {
    this.mesh.position = position
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }

  public move(direction?: Vector3 | undefined) {
    if (direction === undefined) {
      direction = createDirection()
    }

    this.direction = direction

    const from = this.mesh.position.clone()
    const to = from.add(direction)

    if (traceEnabled) {
      traceMove(from, to, direction, this.mesh)
    }

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
}

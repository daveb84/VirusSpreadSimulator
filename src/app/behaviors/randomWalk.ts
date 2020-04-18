import { Mesh, Vector3, Animation, Animatable } from '@babylonjs/core'
import { generateNumber } from '../../utils/random'
import { traceMove } from '../../utils/trace'
import { walkerMovement } from '../settings'
import { CollisionState, IObstacle } from '../collisions'

export class RandomWalk {
  private _direction: Vector3 = undefined
  private moveFrom: Vector3
  private moveTo: Vector3

  private _moving: boolean = false
  private moveAnimations: Animatable[] = []

  private moveCompleteHandlers: Array<() => void> = []

  constructor(
    public mesh: Mesh,
    public distance: number = walkerMovement.distance,
    public frameRate: number = walkerMovement.frameRate,
    public endFrame: number = walkerMovement.endFrame
  ) {}

  public get moving() {
    return this._moving
  }

  public get direction() {
    return this._direction
  }

  protected addMoveCompleteHanlder(handler: () => void) {
    this.moveCompleteHandlers.push(handler)
  }

  public start() {
    this.move()
  }

  public stop() {
    this._moving = false
    if (this.moveAnimations.length) {
      this.moveAnimations.forEach((x) => x.stop())
    }

    this.moveAnimations.splice(0, this.moveAnimations.length)
  }

  public move(direction?: Vector3 | undefined) {
    this.createTarget(direction)

    const animation = this.createAnimation()

    const running = this.mesh
      .getScene()
      .beginDirectAnimation(
        this.mesh,
        [animation],
        0,
        this.endFrame,
        false,
        1,
        () => this.onMoveComplete()
      )

    this.moveAnimations.push(running)
    this._moving = true
  }

  private onMoveComplete() {
    this.moveCompleteHandlers.forEach((x) => x())
    this.moveAnimations.splice(0, this.moveAnimations.length)

    if (this._moving) {
      this.move()
    }
  }

  private createTarget(direction?: Vector3 | undefined) {
    this.moveFrom = this.mesh.position.clone()
    if (direction === undefined) {
      const angle = generateNumber(0, 360)

      const z = this.distance * Math.sin(angle)
      const x = this.distance * Math.cos(angle)

      direction = new Vector3(x, 0, z)
    }
    this._direction = direction

    this.moveTo = this.moveFrom.add(this._direction)

    traceMove(this.moveFrom, this.moveTo, this._direction, this.mesh)
  }

  private createAnimation() {
    const animation = new Animation(
      'move',
      'position',
      this.frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    )

    const keys = [
      {
        frame: 0,
        value: this.moveFrom,
      },
      {
        frame: this.endFrame,
        value: this.moveTo,
      },
    ]

    animation.setKeys(keys)

    return animation
  }
}

export class CollidingRandomWalk extends RandomWalk {
  private collisionState: CollisionState

  constructor(
    mesh: Mesh,
    distance: number = walkerMovement.distance,
    frameRate: number = walkerMovement.frameRate,
    endFrame: number = walkerMovement.endFrame
  ) {
    super(mesh, distance, frameRate, endFrame)

    this.collisionState = this.createCollisionState()
    this.addMoveCompleteHanlder(() => this.collisionState.onMoveComplete)
  }

  public collide(obstacle: IObstacle) {
    this.collisionState.collide(obstacle, this.mesh.position)
  }

  private createCollisionState() {
    const movingMesh = {
      getCurrentPosition: () => this.mesh.position,
      getCurrentDirection: () => this.direction,
      stopCurrentMovement: () => this.stop(),
      startNewDirection: (direction: Vector3) => this.move(direction),
    }

    return new CollisionState(this.mesh.getScene(), movingMesh)
  }
}

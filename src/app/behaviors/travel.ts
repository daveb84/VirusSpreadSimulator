import { Mesh, Vector3, Animation, Animatable } from '@babylonjs/core'
import { traceMove } from '../utils/trace'
import { CollisionHandler, IObstacle } from './collision'

export interface ITravelMove {
  endFrame: number
  target: Vector3
  animations: Animation[]
  direction: Vector3
}

export interface ITravelMoveFactory {
  createNextMove: (position: Vector3, direction?: Vector3) => ITravelMove
}

export class Travel {
  private _direction: Vector3 = undefined
  private moveFrom: Vector3
  private moveTo: Vector3

  private _moving: boolean = false
  private moveAnimations: Animatable[] = []

  private moveCompleteHandlers: Array<() => void> = []

  constructor(public mesh: Mesh, private moveFactory: ITravelMoveFactory) {}

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
    this.moveFrom = this.mesh.position.clone()

    const nextMove = this.moveFactory.createNextMove(this.moveFrom, direction)

    this.moveTo = nextMove.target
    this._direction = nextMove.direction

    traceMove(this.moveFrom, this.moveTo, this._direction, this.mesh)

    const running = this.mesh
      .getScene()
      .beginDirectAnimation(
        this.mesh,
        nextMove.animations,
        0,
        nextMove.endFrame,
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
}

export class CollidingTravel extends Travel {
  private collisionHandler: CollisionHandler

  constructor(mesh: Mesh, moveFactory: ITravelMoveFactory) {
    super(mesh, moveFactory)

    this.collisionHandler = this.createCollisionHandler()
    this.addMoveCompleteHanlder(() => this.collisionHandler.onMoveComplete())
  }

  public collide(obstacle: IObstacle, deflectionDistance: number) {
    this.collisionHandler.collide(
      obstacle,
      this.mesh.position,
      deflectionDistance
    )
  }

  private createCollisionHandler() {
    const movingMesh = {
      getCurrentPosition: () => this.mesh.position,
      getCurrentDirection: () => this.direction,
      stopCurrentMovement: () => this.stop(),
      startNewDirection: (direction: Vector3) => this.move(direction),
    }

    return new CollisionHandler(this.mesh.getScene(), movingMesh)
  }
}

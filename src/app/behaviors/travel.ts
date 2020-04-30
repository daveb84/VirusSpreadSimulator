import { Mesh, Vector3, Animation, Animatable } from '@babylonjs/core'
import { traceMove } from '../utils/trace'
import { CollisionHandler, IObstacle } from './collision'

export interface ITravelMove {
  target: Vector3
  animations: Animation[]
  endFrame: number
}

export interface ITravelMoveFactory {
  createNextMove: (position: Vector3, target?: Vector3) => ITravelMove
  setLockdownLevel: (level: number) => void
}

export class Travel {
  protected moveFrom: Vector3
  protected moveTo: Vector3

  private _moving: boolean = false
  private moveAnimations: Animatable[] = []

  private moveCompleteHandlers: Array<() => void> = []

  constructor(public mesh: Mesh, private _moveFactory: ITravelMoveFactory) {}

  public get moving() {
    return this._moving
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

  public updateMoveFactory(moveFactory: ITravelMoveFactory) {
    this._moveFactory = moveFactory
  }

  public get moveFactory() {
    return this._moveFactory
  }

  public move(target?: Vector3) {
    this.moveFrom = this.mesh.position.clone()

    const nextMove = this._moveFactory.createNextMove(this.moveFrom, target)

    this.moveTo = nextMove.target

    traceMove(this.moveFrom, this.moveTo, this.mesh)

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
      getCurrentTarget: () => this.moveTo,
      stopCurrentMove: () => this.stop(),
      startNewMove: (target: Vector3) => this.move(target),
    }

    return new CollisionHandler(this.mesh.getScene(), movingMesh)
  }
}

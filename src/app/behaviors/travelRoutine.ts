import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { generateNumber, FlatRegion } from '../vectors'
import { travelConfig } from '../settings'
import { IProcessStep } from '../appEvents'

export interface IRoutineTargets {
  target: FlatRegion
  fromStep: number
  toStep: number
  home: boolean
}

export class RoutineMoveFactory implements ITravelMoveFactory {
  constructor(
    public targets: IRoutineTargets[],
    public getProcessStep: () => IProcessStep,
    public distance: number = travelConfig.distance,
    public frameRate: number = travelConfig.frameRate,
    public endFrame: number = travelConfig.endFrame
  ) {}

  createNextMove(position: Vector3, target?: Vector3) {
    target = this.getTarget(position, target)

    const animation = this.createAnimation(position, target)

    const move: ITravelMove = {
      target,
      endFrame: this.endFrame,
      animations: [animation],
    }

    return move
  }

  private getTarget(position: Vector3, target: Vector3) {
    if (target) {
      return target
    }

    if (!this.targets.length) {
      return position
    }

    const step = this.getProcessStep().step
    let currentMoves = this.targets.filter(
      (x) => x.fromStep <= step && x.toStep >= step && x.target !== null
    )

    if (!currentMoves.length) {
      currentMoves = this.targets
    }

    const index = generateNumber(0, currentMoves.length - 1, true)
    target = currentMoves[index].target.getRandomPointFrom(
      position,
      this.distance
    )

    return target
  }

  private createAnimation(from: Vector3, to: Vector3) {
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
        value: from,
      },
      {
        frame: this.endFrame,
        value: to,
      },
    ]

    animation.setKeys(keys)

    return animation
  }
}

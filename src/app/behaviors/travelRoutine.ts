import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { generateNumber, FlatRegion } from '../vectors'
import { travelConfig } from '../settings'

interface ITimeSlot {
  targets: FlatRegion[]
  fromFrame: number
  toFrame: number
}

let routineTick: number = 0

export class RoutineMoveFactory implements ITravelMoveFactory {
  constructor(
    public distance: number = travelConfig.distance,
    public frameRate: number = travelConfig.frameRate,
    public endFrame: number = travelConfig.endFrame
  ) {}

  createNextMove(position: Vector3, direction?: Vector3) {
    const target = this.createTarget(position, [])

    const animation = this.createAnimation(position, target.target)

    const move: ITravelMove = {
      ...target,
      endFrame: this.endFrame,
      animations: [animation],
    }

    return move
  }

  private createTarget(position: Vector3, targets: FlatRegion[]) {
    if (!targets.length) {
      return null
    }

    const index = generateNumber(0, targets.length - 1, true)
    const target = targets[index].getRandomPoint()

    const direction = target.subtract(position)

    return {
      target,
      direction,
    }
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

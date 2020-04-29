import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { generateNumber } from '../utils'
import { travelConfig } from '../settings'

export class RandomMoveFactory implements ITravelMoveFactory {
  constructor(
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

  private getTarget(position: Vector3, target?: Vector3) {
    if (target) {
      return target
    }

    const angle = generateNumber(0, 360)

    const z = this.distance * Math.sin(angle)
    const x = this.distance * Math.cos(angle)

    const direction = new Vector3(x, 0, z)

    target = position.add(direction)

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

import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { generateNumber } from '../vectors'
import { walkerMovement } from '../settings'

export class RandomMoveFactory implements ITravelMoveFactory {
  constructor(
    public distance: number = walkerMovement.distance,
    public frameRate: number = walkerMovement.frameRate,
    public endFrame: number = walkerMovement.endFrame
  ) {}

  createNextMove(position: Vector3, direction?: Vector3) {
    const target = this.createTarget(position, direction)

    const animation = this.createAnimation(position, target.target)

    const move: ITravelMove = {
      ...target,
      endFrame: this.endFrame,
      animations: [animation],
    }

    return move
  }

  private createTarget(position: Vector3, direction: Vector3 = undefined) {
    if (direction === undefined) {
      const angle = generateNumber(0, 360)

      const z = this.distance * Math.sin(angle)
      const x = this.distance * Math.cos(angle)

      direction = new Vector3(x, 0, z)
    }

    const target = position.add(direction)

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

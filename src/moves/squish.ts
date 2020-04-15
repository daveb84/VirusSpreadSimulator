import { Animation, IAnimationKey } from '@babylonjs/core'
import { Move } from './move'

export class Squish extends Move {
  createAnimation() {
    var animation = new Animation(
      'squish',
      'scaling.x',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )

    // An array with all animation keys
    var keys: IAnimationKey[] = []

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: 1,
    })

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
      frame: 20,
      value: 0.2,
    })

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: 100,
      value: 1,
    })

    animation.setKeys(keys)

    return animation
  }
}

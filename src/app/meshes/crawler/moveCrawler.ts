import { Vector3, Animation } from '@babylonjs/core'

const distance = 3

export const createTargetVector = (angle: number) => {
  const z = distance * Math.sin(angle)
  const x = distance * Math.cos(angle)

  return new Vector3(x, 0, z)
}

const createPositionAnimation = (
  key: string,
  frameRate: number,
  start: number,
  end: number
) => {
  const animation = new Animation(
    'squish',
    key,
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  )

  const keys = [
    {
      frame: 0,
      value: start,
    },
    {
      frame: frameRate * 5,
      value: start + end,
    },
  ]

  animation.setKeys(keys)
  return animation
}

export const createMoveAnimations = (
  currentPosition: Vector3,
  target: Vector3,
  frameRate: number
) => {
  const x = createPositionAnimation(
    'position.x',
    frameRate,
    currentPosition.x,
    target.x
  )
  const z = createPositionAnimation(
    'position.z',
    frameRate,
    currentPosition.z,
    target.z
  )

  return [x, z]
}

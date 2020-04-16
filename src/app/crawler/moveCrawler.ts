import {
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Material,
  Animation,
} from '@babylonjs/core'
import { generateNumber } from '../../utils/random'

const distance = 0.5

const createTargetVector = (angle: number) => {
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
      frame: frameRate,
      value: start + end,
    },
  ]

  animation.setKeys(keys)
  return animation
}

export const createMoveAnimations = (
  currentPosition: Vector3,
  frameRate: number
) => {
  const angle = generateNumber(0, 360)
  const target = createTargetVector(angle)

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

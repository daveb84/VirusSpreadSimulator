import { Mesh, Vector3, Animation } from '@babylonjs/core'
import { generateNumber } from '../../../utils/random'

const distance = 3
const frameRate = 10
const endFrame = 10

export const createDirection = () => {
  const angle = generateNumber(0, 360)

  const z = distance * Math.sin(angle)
  const x = distance * Math.cos(angle)

  return new Vector3(x, 0, z)
}

export const moveCrawler = (
  mesh: Mesh,
  from: Vector3,
  to: Vector3,
  onComplete: () => void
) => {
  const scene = mesh.getScene()

  const animation = new Animation(
    'move',
    'position',
    frameRate,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
  )

  const keys = [
    {
      frame: 0,
      value: from,
    },
    {
      frame: endFrame,
      value: to,
    },
  ]

  animation.setKeys(keys)

  const running = scene.beginDirectAnimation(
    mesh,
    [animation],
    0,
    endFrame,
    false,
    1,
    onComplete
  )

  return running
}

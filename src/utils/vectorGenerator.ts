import { Vector3 } from '@babylonjs/core'

export const generatePosition = () =>
  generateVector(new Vector3(-3, -3, -3), new Vector3(3, 3, 3))

export const generateRotation = () => {
  const max = 2 * Math.PI
  return generateVector(Vector3.Zero(), new Vector3(max, max, max))
}

export const generateVector = (min: Vector3, max: Vector3) =>
  new Vector3(
    generateNumber(min.x, max.x),
    generateNumber(min.y, max.y),
    generateNumber(min.z, max.z)
  )

export const generateNumber = (from: number, to: number) =>
  Math.random() * Math.abs(from - to) + from

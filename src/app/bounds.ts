import { Vector3 } from '@babylonjs/core'

export const minBound = new Vector3(-9, -3, -3)
export const maxBound = new Vector3(9, 4, 6)

export const boundsMidpoint = maxBound
  .add(minBound)
  .multiply(new Vector3(0.5, 0.5, 0.5))

export const boundsSize = {
  width: maxBound.x - minBound.x,
  height: maxBound.y - minBound.y,
  depth: maxBound.z - minBound.z,
}

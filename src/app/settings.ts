import { Vector3 } from '@babylonjs/core'

export const traceEnabled = false
export const markCollisions = false

export const virusDuration = {
  incubation: 5000,
  ill: 5000,
}

export const walkerMovement = {
  autoStart: true,
  distance: 3,
  frameRate: 10,
  endFrame: 30,
}

export const minBound = new Vector3(-15, -3, -6)
export const maxBound = new Vector3(15, 4, 12)

export const boundsMidpoint = maxBound
  .add(minBound)
  .multiply(new Vector3(0.5, 0.5, 0.5))

export const boundsSize = {
  width: maxBound.x - minBound.x,
  height: maxBound.y - minBound.y,
  depth: maxBound.z - minBound.z,
}

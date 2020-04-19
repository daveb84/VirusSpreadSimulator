import { Vector3 } from '@babylonjs/core'
import { FlatRegion } from './vectors/region'

export const traceEnabled = false
export const markCollisions = false

export const virusDuration = {
  incubation: 5000,
  ill: 5000,
}

export const walkerMovement = {
  autoStart: false,
  distance: 3,
  frameRate: 10,
  endFrame: 30,
}

export const minBound = new Vector3(-3, -3, -3)
export const maxBound = new Vector3(3, 4, 6)

export const boundsMidpoint = maxBound
  .add(minBound)
  .multiply(new Vector3(0.5, 0.5, 0.5))

export const boundsSize = {
  width: maxBound.x - minBound.x,
  height: maxBound.y - minBound.y,
  depth: maxBound.z - minBound.z,
}

export const personHeight = 0.3

const createRegions = () => {
  const stageRegionPoints = {
    y: minBound.y,
    minX: minBound.x,
    minZ: minBound.z,
    maxX: maxBound.x,
    maxZ: maxBound.z,
  }

  const stageRegion = new FlatRegion(stageRegionPoints)

  const walkerRegion = new FlatRegion({
    ...stageRegionPoints,
    y: stageRegionPoints.y + personHeight / 2,
  })

  return {
    stage: stageRegion,
    walker: walkerRegion,
  }
}

export const regions = createRegions()

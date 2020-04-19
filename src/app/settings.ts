import { Vector3 } from '@babylonjs/core'
import { FlatRegion, Grid } from './vectors'

export const traceEnabled = false
export const markCollisions = true

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

const minBound = new Vector3(-6, 0, -6)
const maxBound = new Vector3(6, 4, 6)

export const cameraPosition = new Vector3(0, 10, 6)

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

  const walkerGrid = new Grid(walkerRegion, 10, 10)

  return {
    stage: stageRegion,
    walker: walkerRegion,
    grid: walkerGrid,
  }
}

export const regions = createRegions()

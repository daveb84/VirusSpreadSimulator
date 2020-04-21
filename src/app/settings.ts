import { Vector3 } from '@babylonjs/core'
import { FlatRegion, Grid } from './vectors'

export const traceEnabled = false
export const markCollisions = false

export const virusDuration = {
  incubation: 5000,
  ill: 5000,
}

export const travelConfig = {
  autoStart: false,
  distance: 3,
  frameRate: 10,
  endFrame: 30,
  timeStep: 1 / 10,
}

export const cameraPosition = new Vector3(0, 10, 6)

export const personHeight = 0.3

const minBound = new Vector3(-6, 0, -6)
const maxBound = new Vector3(6, 4, 6)
// const minBound = new Vector3(-3, 0, -3)
// const maxBound = new Vector3(3, 4, 3)

const gridRows = 20
const gridColumns = 20

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

  const buildingGrid = new Grid(stageRegion, gridRows, gridColumns)

  return {
    stage: stageRegion,
    walker: walkerRegion,
    buildingGrid: buildingGrid,
  }
}

export const regions = createRegions()

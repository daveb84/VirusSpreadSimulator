import { Vector3 } from '@babylonjs/core'
import { FlatRegion, Grid } from './vectors'

export const traceEnabled = false
export const markCollisions = false

export const virusDuration = {
  incubation: 300,
  ill: 300,
}

export const travelConfig = {
  autoStart: false,
  distance: 0.5,
  frameRate: 10,
  endFrame: 5,
  timeStep: 0.1,
  processorStepRatio: 0.05,
  timeSlots: 200,
}

export const cameraPosition = new Vector3(0, 10, 6)

export const personHeight = 0.3

const gridRows = 20
const gridColumns = 20

const gridSquareWidth = 0.5
const gridSquareDepth = 0.5

const infectionGridSquareRatio = 5

const createRegions = () => {
  const getBound = (squareSize: number, amount: number) => {
    return (squareSize * amount) / 2
  }

  const maxX = getBound(gridSquareWidth, gridColumns)
  const maxZ = getBound(gridSquareDepth, gridRows)

  const stageRegionPoints = {
    y: 0,
    minX: -maxX,
    minZ: -maxZ,
    maxX: maxX,
    maxZ: maxZ,
  }

  const stage = new FlatRegion(stageRegionPoints)

  const walker = new FlatRegion({
    ...stageRegionPoints,
    y: stageRegionPoints.y + personHeight / 2,
  })

  const buildingGrid = new Grid(stage, gridRows, gridColumns)

  const infectionGrid = new Grid(
    walker,
    gridRows * infectionGridSquareRatio,
    gridColumns * infectionGridSquareRatio
  )

  return {
    stage,
    walker,
    buildingGrid,
    infectionGrid,
  }
}

export const regions = createRegions()

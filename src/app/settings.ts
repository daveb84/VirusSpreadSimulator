import { FlatRegion, Grid } from './vectors'

export const traceEnabled = false
export const markCollisions = false

export const virusSettings = {
  incubation: 24 * 5,
  ill: 24 * 5,
  // incubation: 2,
  // ill: 2,
  deathRate: 0.05,
}

export const travelConfig = {
  autoStart: false,
  distance: 0.4,
  distanceWithinTarget: 0.1,
  frameRate: 10,
  endFrame: 1,

  timeStep: 0.1,
  stepHoursRatio: 0.2,
  hoursInWeek: 24 * 7,
}

export const populationConfig = {
  homes: 20,
  walkersPerHome: [1, 4],
  works: 10,
  worksPerWalker: [1, 2],
  shops: 10,
  shopsPerWalker: [3, 8],
  entertainments: 10,
  entertainmentsPerWalker: [2, 5],

  lockdownShopsPerWalker: [1, 3],
  lockdownWorkRatio: 0.2,
  lockdownShopRatio: 0.3,
}

// export const populationConfig = {
//   homes: 1,
//   walkersPerHome: [1, 1],
//   works: 1,
//   worksPerWalker: [1, 1],
//   shops: 10,
//   shopsPerWalker: [10, 10],
//   entertainments: 1,
//   entertainmentsPerWalker: [1, 1],

//   lockdownShopsPerWalker: [1, 3],
//   lockdownWorkRatio: 0.3,
//   lockdownShopRatio: 0.5,
// }

export const personHeight = 0.3
export const personWidth = 0.1

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

  const graveYardPoints = {
    y: 1,
    minX: -2,
    maxX: 2,
    minZ: maxZ + 2,
    maxZ: maxZ + 4,
  }

  const stage = new FlatRegion(stageRegionPoints)

  const graveYard = new FlatRegion(graveYardPoints)

  const walker = new FlatRegion({
    ...stageRegionPoints,
    y: stageRegionPoints.y + personHeight / 2,
  })

  const walkerGraveYard = new FlatRegion({
    ...graveYardPoints,
    y: graveYardPoints.y + personWidth / 2,
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
    graveYard,
    walkerGraveYard,
  }
}

export const regions = createRegions()

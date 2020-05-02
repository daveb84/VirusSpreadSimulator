import { FlatRegion, Grid } from './vectors'

export const traceEnabled = false
export const markCollisions = false

export const virusSettings = {
  incubation: 24,
  ill: 24,
  // incubation: 2,
  // ill: 2,
  deathRate: 0.1,
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

export const personHeight = 0.3
export const personWidth = 0.1

const gridRows = 20
const gridColumns = 20

const gridSquareWidth = 0.5
const gridSquareDepth = 0.5

const infectionGridSquareRatio = 5

export const populationConfig = {
  gridRegion: {
    rows: Math.ceil(gridRows / 2),
    columns: Math.ceil(gridRows / 2),
  },

  gridRegionRows: Math.ceil(gridRows / 2),
  gridRegionColumns: Math.ceil(gridRows / 2),

  homes: 15,
  walkersPerHome: [1, 4],
  homeRegion: {
    rows: Math.ceil(gridRows / 2),
    columns: Math.ceil(gridColumns / 2),
  },

  works: 3,
  worksPerWalker: [1, 1],
  worksShopsPerWalker: [1, 3],
  worksEntertainmentPerWalker: [1, 3],
  workRegion: {
    rows: Math.ceil(gridRows / 2),
    columns: Math.ceil(gridColumns / 2),
  },

  shops: 5,
  shopsPerWalker: [3, 5],
  entertainments: 5,
  entertainmentsPerWalker: [3, 5],

  lockdownWorkRatio: 0.2,
}

// export const populationConfig = {
//   gridRegion: {
//     rows: Math.ceil(gridRows / 2),
//     columns: Math.ceil(gridRows / 2),
//   },

//   homes: 1,
//   walkersPerHome: [1, 1],
//   homeRegion: {
//     rows: Math.ceil(gridRows / 2),
//     columns: Math.ceil(gridColumns / 2),
//   },

//   works: 1,
//   worksPerWalker: [1, 1],
//   worksShopsPerWalker: [1, 1],
//   worksEntertainmentPerWalker: [1, 1],
//   workRegion: {
//     rows: Math.ceil(gridRows / 2),
//     columns: Math.ceil(gridColumns / 2),
//   },

//   shops: 1,
//   shopsPerWalker: [1, 1],
//   entertainments: 1,
//   entertainmentsPerWalker: [1, 1],

//   lockdownWorkRatio: 0.2,
// }

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

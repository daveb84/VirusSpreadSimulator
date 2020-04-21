import { IBuildingConfig, BuildingType } from './buildings'
import { generateNumber } from '../vectors'
import { travelConfig } from '../settings'

interface IBuildingConfigOptions {
  rows?: number
  columns?: number
  height?: number
  rowIndex?: number
  columnIndex?: number
}

const home: IBuildingConfig = {
  rows: 1,
  columns: 1,
  height: 1,
  type: BuildingType.Home,
}

const shop: IBuildingConfig = {
  rows: 1,
  columns: 1,
  height: 1,
  type: BuildingType.Shop,
}

const work: IBuildingConfig = {
  rows: 2,
  columns: 2,
  height: 4,
  type: BuildingType.Work,
}

const createBuilding = (
  defaultValues: IBuildingConfig,
  args?: IBuildingConfigOptions
) => ({
  ...defaultValues,
  ...args,
})

export interface IBuildingWalkers {
  index: number
  building: IBuildingConfig
  walkers: number[]
}

export interface IWalkerBuildings {
  index: number
  buildings: IBuildingTimeSlot[]
}

export interface IBuildingTimeSlot {
  building: number
  fromStep: number
  toStep: number
}

const configAmounts = {
  homes: 60,
  walkerHomesFrom: 1,
  walkerHomesTo: 4,
  works: 5,
  walkerWorksFrom: 1,
  walkerWorksTo: 2,
  shops: 20,
  walkerShopsFrom: 0,
  walkerShopsTo: 10,
}

export const createPopulationConfig = () => {
  const homes = generateBuildings(configAmounts.homes, home)

  const works = generateBuildings(configAmounts.works, work)

  const shops = generateBuildings(configAmounts.shops, shop)

  const buildings: IBuildingWalkers[] = [...homes, ...works, ...shops].map(
    (building, index) => ({
      index,
      building,
      walkers: [],
    })
  )

  const homeFiltered = buildings.filter(
    (x) => x.building.type === BuildingType.Home
  )
  const workFiltered = buildings.filter(
    (x) => x.building.type === BuildingType.Work
  )
  const shopFiltered = buildings.filter(
    (x) => x.building.type === BuildingType.Shop
  )

  let walkerIndex = 0

  const walkers: IWalkerBuildings[] = []

  homeFiltered.forEach((home) => {
    const walkersAmount = generateNumber(
      configAmounts.walkerHomesFrom,
      configAmounts.walkerHomesTo,
      true
    )

    for (let i = 0; i < walkersAmount; i++) {
      const work = pickRandom(
        configAmounts.walkerWorksFrom,
        configAmounts.walkerWorksTo,
        workFiltered
      )
      const shop = pickRandom(
        configAmounts.walkerShopsFrom,
        configAmounts.walkerShopsTo,
        shopFiltered
      )

      const walkerBuildings = [home, ...work, ...shop]

      const walker: IWalkerBuildings = {
        index: walkerIndex,
        buildings: [],
      }

      assignTimeSlots(walker, walkerBuildings)

      walkerBuildings.forEach((building) => {
        building.walkers.push(walkerIndex)
      })

      walkerIndex++
      walkers.push(walker)
    }
  })

  return { buildingWalkers: buildings, walkerBuildings: walkers }
}

const pickRandom = <T>(min: number, max: number, buildings: T[]) => {
  const amount = generateNumber(min, max, true)

  const picked: T[] = []

  for (let i = 0; i < amount; i++) {
    const index = generateNumber(0, buildings.length - 1, true)

    picked.push(buildings[index])
  }

  return picked
}

const generateBuildings = (
  amount: number,
  defaultValues: IBuildingConfig,
  options?: IBuildingConfigOptions
) => {
  const created: IBuildingConfig[] = []
  for (let i = 0; i < amount; i++) {
    created.push(createBuilding(defaultValues, options))
  }

  return created
}

const assignTimeSlots = (
  walker: IWalkerBuildings,
  buildings: IBuildingWalkers[]
) => {
  const increment = Math.floor(travelConfig.timeSlots / buildings.length)

  let current = 0
  for (let i = 0; i < buildings.length - 1; i++) {
    const building = buildings[i]
    const end = current + increment

    walker.buildings.push({
      building: building.index,
      fromStep: current,
      toStep: current + increment,
    })

    current = end
  }

  walker.buildings.push({
    building: buildings[buildings.length - 1].index,
    fromStep: current,
    toStep: travelConfig.timeSlots,
  })
}

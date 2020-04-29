import { IBuildingConfig, BuildingType } from './types'

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
  height: 0.5,
  type: BuildingType.Home,
}

const work: IBuildingConfig = {
  rows: 2,
  columns: 2,
  height: 1.5,
  type: BuildingType.Work,
}

const shop: IBuildingConfig = {
  rows: 1,
  columns: 1,
  height: 0.75,
  type: BuildingType.Shop,
}

const entertainment: IBuildingConfig = {
  rows: 1,
  columns: 1,
  height: 1.2,
  type: BuildingType.Entertainment,
}

export const createBuilding = (
  defaultValues: IBuildingConfig,
  args?: IBuildingConfigOptions
): IBuildingConfig => ({
  ...defaultValues,
  ...args,
})

export const createBuildingForType = (
  type: BuildingType,
  args?: IBuildingConfigOptions
) => {
  let building: IBuildingConfig

  switch (type) {
    case BuildingType.Home:
      building = home
      break
    case BuildingType.Work:
      building = work
      break

    case BuildingType.Shop:
      building = shop
      break

    case BuildingType.Entertainment:
      building = entertainment
      break
  }
  return createBuilding(building, args)
}

export const createBuildingsForType = (amount: number, type: BuildingType) => {
  const buildings: IBuildingConfig[] = []
  for (let i = 0; i < amount; i++) {
    buildings.push(createBuildingForType(type))
  }

  return buildings
}

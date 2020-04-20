import { IBuildingConfig, BuildingType } from './place'

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

export const buildingConfig = [
  createBuilding(home),
  createBuilding(home),
  createBuilding(home),
  createBuilding(shop),
  createBuilding(shop),
  createBuilding(work),
]

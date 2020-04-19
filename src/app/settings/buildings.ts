import { IBuildingConfig, BuildingType } from '../buildings'

const createHome = (rows = 1, columns = 1, height = 1): IBuildingConfig => {
  return {
    rows,
    columns,
    height,
    type: BuildingType.Home,
  }
}

const createShop = (rows = 1, columns = 1, height = 1): IBuildingConfig => {
  return {
    rows,
    columns,
    height,
    type: BuildingType.Shop,
  }
}

const createWork = (rows = 2, columns = 2, height = 4): IBuildingConfig => {
  return {
    rows,
    columns,
    height,
    type: BuildingType.Work,
  }
}

export const buildingConfig = [
  createShop(),
  createShop(),
  createShop(3, 2, 2),
  createHome(),
  createHome(),
  createHome(),
  createHome(),
  createWork(),
  createWork(),
]

export interface IBuildingConfig {
  rows: number
  columns: number
  height: number
  type: BuildingType
  rowIndex?: number
  columnIndex?: number
}

export enum BuildingType {
  Home,
  Work,
  Shop,
}

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

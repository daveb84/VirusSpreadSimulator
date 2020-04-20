import { Grid, GridDivision } from './vectors'
import { getCommonMaterials } from './materials/common'
import { Vector3, Scene } from '@babylonjs/core'
import { Building } from './meshes'
import { buildingConfig, regions } from './settings'

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

interface ICellPopulation {
  [cellIndex: number]: boolean
}

class BuildingPopulation {
  private cellPopulation: ICellPopulation

  constructor(
    private scene: Scene,
    private grid: Grid,
    private buildings: IBuildingConfig[]
  ) {
    this.populate()
  }

  populate() {
    this.cellPopulation = {}

    this.buildings.forEach((building) => {
      const locations = this.getAvailableLocations(building)
      const location = this.chooseLocation(building, locations)

      if (location) {
        const material = this.getMaterial(building)

        const buildingMesh = new Building(
          this.scene,
          material,
          location.width,
          building.height,
          location.depth
        )

        buildingMesh.mesh.position = new Vector3(
          location.midX,
          location.y + building.height / 2,
          location.midZ
        )

        location.cells.forEach((x) => {
          this.cellPopulation[x.index] = true
        })
      }
    })
  }

  private getAvailableLocations(building: IBuildingConfig) {
    const locations = this.grid.getDivisions(building.rows, building.columns)

    return locations.filter((location) => {
      const taken = location.cells.some((cell) => {
        const indexTaken = this.cellPopulation[cell.index]

        return indexTaken
      })

      if (taken) {
        // location.draw(this.scene)
      }

      return !taken
    })
  }

  private chooseLocation(building: IBuildingConfig, locations: GridDivision[]) {
    if (!locations.length) {
      return null
    }

    if (building.rowIndex) {
      locations = locations.filter(
        (l) => l.cells[0].rowIndex === building.rowIndex
      )
    }

    if (building.columnIndex) {
      locations = locations.filter(
        (l) => l.cells[0].columnIndex === building.columnIndex
      )
    }

    if (!locations.length) {
      return null
    }

    if (locations.length === 1) {
      return locations[0]
    }

    const index = Math.floor(Math.random() * locations.length)

    return locations[index]
  }

  private getMaterial(building: IBuildingConfig) {
    const materials = getCommonMaterials()

    switch (building.type) {
      case BuildingType.Home:
        return materials.homeBuilding

      case BuildingType.Shop:
        return materials.shopBuilding
      default:
        return materials.workBuilding
    }
  }
}

export const placeBuildings = (scene: Scene) => {
  new BuildingPopulation(scene, regions.buildingGrid, buildingConfig)
}

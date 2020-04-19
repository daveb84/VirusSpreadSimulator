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
  private cellPopulation: ICellPopulation = {}

  constructor(
    private scene: Scene,
    private grid: Grid,
    private buildings: IBuildingConfig[]
  ) {
    this.populate()
  }

  populate() {
    this.buildings.forEach((building) => {
      const locations = this.getAvailableLocations(building)

      if (locations.length > 0) {
        const location = this.chooseLocation(locations)
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

        location.cellIndexes.forEach((x) => (this.cellPopulation[x] = true))
      }
    })
  }

  private getAvailableLocations(building: IBuildingConfig) {
    const locations = this.grid.getDivisions(building.rows, building.columns)

    return locations.filter((location) => {
      const taken = location.cellIndexes.some(
        (index) => this.cellPopulation[index]
      )

      return !taken
    })
  }

  private chooseLocation(locations: GridDivision[]) {
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

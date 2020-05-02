import { Grid, GridDivision, IGridRegion } from '../vectors'
import { getCommonMaterials } from '../materials/common'
import { Vector3, Scene } from '@babylonjs/core'
import { Building } from '../meshes'
import { IBuildingConfig, BuildingType } from './types'

interface ICellPopulation {
  [cellIndex: number]: boolean
}

export class BuildingPopulation {
  private cellPopulation: ICellPopulation
  private _placedBuildings: PlacedBuilding[] = []

  constructor(private scene: Scene, private grid: Grid) {
    this.cellPopulation = {}
  }

  public get placedBuildings() {
    return this._placedBuildings
  }

  addBuilding(building: IBuildingConfig, region?: IGridRegion) {
    const locations = this.getAvailableLocations(building, region)
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

      const placedBuilding = new PlacedBuilding(building, location)

      this._placedBuildings.push(placedBuilding)

      return placedBuilding
    }

    return null
  }

  private getAvailableLocations(
    building: IBuildingConfig,
    region?: IGridRegion
  ) {
    const locations = this.grid.getDivisions(
      building.rows,
      building.columns,
      region
    )

    return locations.filter((location) => {
      const taken = location.cells.some(
        (cell) => this.cellPopulation[cell.index]
      )

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
      case BuildingType.Work:
        return materials.workBuilding
      case BuildingType.Entertainment:
        return materials.entertainmentBuilding
    }
  }
}

export class PlacedBuilding {
  constructor(
    public building: IBuildingConfig,
    public location: GridDivision | null
  ) {}
}

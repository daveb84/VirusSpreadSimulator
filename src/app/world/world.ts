import { Scene } from '@babylonjs/core'
import { Walker } from './walker'
import { WalkerProcessor } from './processor'
import { IBuildingConfig, BuildingType } from './types'
import {
  createBuildingsForType,
  createBuildingForType,
} from './buildingFactory'
import { BuildingPopulation, PlacedBuilding } from './buildingPopulation'
import { regions } from '../settings'
import { generateNumber, pickRandom, FlatRegion } from '../vectors'

const populationConfig = {
  homes: 5,
  walkerHomes: [1, 1],
  works: 1,
  walkerWorks: [1, 1],
  shops: 1,
  walkerShops: [1, 1],
}

class World {
  private buildingPopulation: BuildingPopulation

  constructor(
    private scene: Scene,
    private walkers: Walker[],
    private processor: WalkerProcessor
  ) {
    this.buildingPopulation = new BuildingPopulation(
      scene,
      regions.buildingGrid
    )
  }

  populate() {
    const buildings = [
      ...createBuildingsForType(populationConfig.shops, BuildingType.Shop),
      ...createBuildingsForType(populationConfig.works, BuildingType.Work),
    ]

    buildings.forEach((b) => this.buildingPopulation.addBuilding(b))
  }

  addHome(walkers: number) {
    const home = createBuildingForType(BuildingType.Home)

    const placedBuilding = this.buildingPopulation.addBuilding(home)

    if (placedBuilding) {
      for (let i = 0; i < walkers; i++) {
        const places = [
            ...this.pickRandomBuilding(BuildingType.Shop, populationConfig.walkerShops),
            ...this.pickRandomBuilding(BuildingType.Work, populationConfig.walkerWorks)
        ].map(x => x.)
      }
    }
  }

  private createHomes() {
    for (let i = 0; i < populationConfig.homes; i++) {
      const numberWalkers = generateNumber(
        populationConfig.walkerHomes[0],
        populationConfig.walkerHomes[1],
        true
      )
      this.addHome(numberWalkers)
    }
  }

  private pickRandomBuilding(type: BuildingType, range: number[]) {
    const buildings = this.buildingPopulation.placedBuildings.filter(x => x.building.type === type)

    return pickRandom(buildings, range[0], range[1])
  }
}

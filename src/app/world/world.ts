import { Scene } from '@babylonjs/core'
import { Walker } from './walker'
import { WalkerProcessor } from './processor'
import { BuildingType } from './types'
import {
  createBuildingsForType,
  createBuildingForType,
} from './buildingFactory'
import { BuildingPopulation } from './buildingPopulation'
import { regions } from '../settings'
import { generateNumber, pickRandom } from '../utils'
import { FlatRegion } from '../vectors'
import { RoutineMoveFactory } from '../behaviors'
import { populationConfig } from '../settings'

export class World {
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

    this.populate()
  }

  private populate() {
    const buildings = [
      ...createBuildingsForType(populationConfig.shops, BuildingType.Shop),
      ...createBuildingsForType(populationConfig.works, BuildingType.Work),
      ...createBuildingsForType(
        populationConfig.entertainments,
        BuildingType.Entertainment
      ),
    ]

    buildings.forEach((b) => this.buildingPopulation.addBuilding(b))

    for (let i = 0; i < populationConfig.homes; i++) {
      const numberWalkers = generateNumber(
        populationConfig.walkersPerHome[0],
        populationConfig.walkersPerHome[1],
        true
      )
      this.addHome(numberWalkers)
    }
  }

  addHome(walkers: number) {
    const home = createBuildingForType(BuildingType.Home)

    const placedBuilding = this.buildingPopulation.addBuilding(home)

    if (placedBuilding) {
      for (let i = 0; i < walkers; i++) {
        const walker = this.createWalker(placedBuilding.location)

        this.walkers.push(walker)
      }
    }
  }

  addWalker() {
    const home = this.pickRandomLocation(BuildingType.Home, [1, 1])[0]

    const walker = this.createWalker(home)
    this.walkers.push(walker)

    return walker
  }

  private createWalker(home: FlatRegion) {
    const work = this.pickRandomLocation(
      BuildingType.Work,
      populationConfig.worksPerWalker
    )

    const shops = this.pickRandomLocation(
      BuildingType.Shop,
      populationConfig.shopsPerWalker
    )

    const entertainment = this.pickRandomLocation(
      BuildingType.Entertainment,
      populationConfig.entertainmentsPerWalker
    )

    const getProcessStep = () => this.processor.getProcessStep()

    const travelMoves = new RoutineMoveFactory(
      getProcessStep,
      home,
      work,
      shops,
      entertainment
    )

    return new Walker(this.scene, home, getProcessStep, travelMoves)
  }

  private pickRandomLocation(type: BuildingType, range: number[]) {
    const buildings = this.buildingPopulation.placedBuildings.filter(
      (x) => x.building.type === type
    )

    return pickRandom(buildings, range[0], range[1]).map((x) => x.location)
  }
}

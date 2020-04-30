import { Scene } from '@babylonjs/core'
import { Walker } from './walker'
import { WalkerProcessor } from './processor'
import { BuildingType } from './types'
import {
  createBuildingsForType,
  createBuildingForType,
} from './buildingFactory'
import { BuildingPopulation, PlacedBuilding } from './buildingPopulation'
import { regions } from '../settings'
import { generateNumber, pickRandom } from '../utils'
import { FlatRegion } from '../vectors'
import { RoutineMoveFactory } from '../behaviors'
import { populationConfig } from '../settings'
import {
  createRoutineItems,
  createLockdownRoutineItems,
} from '../behaviors/travelRoutineItems'

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

  private lockdownShops: PlacedBuilding[]

  private populate() {
    const shops = createBuildingsForType(
      populationConfig.shops,
      BuildingType.Shop
    )
    const work = createBuildingsForType(
      populationConfig.works,
      BuildingType.Work
    )
    const entertainment = createBuildingsForType(
      populationConfig.entertainments,
      BuildingType.Entertainment
    )

    const buildings = [...shops, ...work, ...entertainment]

    buildings.forEach((b) => this.buildingPopulation.addBuilding(b))

    const placedShops = this.buildingPopulation.placedBuildings.filter(
      (x) => x.building.type === BuildingType.Shop
    )
    const lockdownShopsAmount = Math.floor(
      placedShops.length * populationConfig.lockdownShopRatio
    )

    this.lockdownShops = [
      ...pickRandom(placedShops, lockdownShopsAmount, lockdownShopsAmount),
    ]

    for (let i = 0; i < populationConfig.homes; i++) {
      const numberWalkers = generateNumber(
        populationConfig.walkersPerHome[0],
        populationConfig.walkersPerHome[1],
        true
      )
      this.addWalkersInNewHome(numberWalkers)
    }
  }

  addWalkersInNewHome(walkers: number) {
    const home = createBuildingForType(BuildingType.Home)

    const placedBuilding = this.buildingPopulation.addBuilding(home)

    const addedWalkers: Walker[] = []

    if (placedBuilding) {
      for (let i = 0; i < walkers; i++) {
        const walker = this.createWalker(placedBuilding.location)

        this.walkers.push(walker)
        addedWalkers.push(walker)
      }
    }

    return addedWalkers
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

    const lockdownShops = this.pickRandomLocation(
      BuildingType.Shop,
      populationConfig.lockdownShopsPerWalker,
      this.lockdownShops
    )

    const getProcessStep = () => this.processor.getProcessStep()

    const routineItems = createRoutineItems(home, work, shops, entertainment)
    const lockdownRoutineItems = createLockdownRoutineItems(
      home,
      work,
      lockdownShops
    )

    const travelMoves = new RoutineMoveFactory(
      getProcessStep,
      home,
      routineItems
    )
    const lockdownTravelMoves = new RoutineMoveFactory(
      getProcessStep,
      home,
      lockdownRoutineItems
    )

    return new Walker(
      this.scene,
      home,
      getProcessStep,
      travelMoves,
      lockdownTravelMoves
    )
  }

  private pickRandomLocation(
    type: BuildingType,
    range: number[],
    collection?: PlacedBuilding[]
  ) {
    const buildings = (
      collection || this.buildingPopulation.placedBuildings
    ).filter((x) => x.building.type === type)

    return pickRandom(buildings, range[0], range[1]).map((x) => x.location)
  }
}

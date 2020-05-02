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
import { GridRegion, IGridRegion } from '../vectors'
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
    this.getRegions().forEach((region) => {
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

      buildings.forEach((b) => this.buildingPopulation.addBuilding(b, region))

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
    })
  }

  private getRegions(): IGridRegion[] {
    const gridRegions = regions.buildingGrid.getRegions(
      populationConfig.gridRegionRows,
      populationConfig.gridRegionColumns
    )
    return gridRegions
  }

  addWalkersInNewHome(walkers: number) {
    const home = createBuildingForType(BuildingType.Home)

    const placedBuilding = this.buildingPopulation.addBuilding(home)

    const addedWalkers: Walker[] = []

    if (placedBuilding) {
      for (let i = 0; i < walkers; i++) {
        const walker = this.createWalker(placedBuilding)

        this.walkers.push(walker)
        addedWalkers.push(walker)
      }
    }

    return addedWalkers
  }

  addWalker() {
    const home = this.pickBuilding(BuildingType.Home, [1, 1])[0]

    const walker = this.createWalker(home)
    this.walkers.push(walker)

    return walker
  }

  private createWalker(home: PlacedBuilding) {
    const homeRegion = regions.buildingGrid.getRegionByRadius(
      home.location.cells[0],
      populationConfig.homeRegionRows,
      populationConfig.homeRegionColumns
    )

    const work = this.pickBuildingForRegion(
      BuildingType.Work,
      populationConfig.worksPerWalker,
      homeRegion
    )

    const shops = this.pickBuildingForRegion(
      BuildingType.Shop,
      populationConfig.shopsPerWalker,
      homeRegion
    )

    const entertainment = this.pickBuildingForRegion(
      BuildingType.Entertainment,
      populationConfig.entertainmentsPerWalker,
      homeRegion
    )

    const lockdownShops = this.pickBuildingForRegion(
      BuildingType.Shop,
      populationConfig.lockdownShopsPerWalker,
      homeRegion,
      this.lockdownShops
    )

    const getProcessStep = () => this.processor.getProcessStep()

    const routineItems = createRoutineItems(
      home.location,
      work,
      shops,
      entertainment
    )
    const lockdownRoutineItems = createLockdownRoutineItems(
      home.location,
      work,
      lockdownShops
    )

    const travelMoves = new RoutineMoveFactory(
      getProcessStep,
      home.location,
      routineItems
    )

    const lockdownTravelMoves = new RoutineMoveFactory(
      getProcessStep,
      home.location,
      lockdownRoutineItems
    )

    return new Walker(
      this.scene,
      home.location,
      getProcessStep,
      travelMoves,
      lockdownTravelMoves
    )
  }

  private pickBuilding(type: BuildingType, range: number[]) {
    const buildings = this.buildingPopulation.placedBuildings.filter(
      (x) => x.building.type === type
    )

    return pickRandom(buildings, range[0], range[1])
  }

  private pickBuildingForRegion(
    type: BuildingType,
    range: number[],
    region: GridRegion,
    collection?: PlacedBuilding[]
  ) {
    const buildings = (
      collection || this.buildingPopulation.placedBuildings
    ).filter((x) => x.building.type === type)

    const forRegion = buildings.filter((x) =>
      region.containsPosition(x.location.midPoint)
    )

    const picked = forRegion.length
      ? pickRandom(forRegion, range[0], range[1])
      : pickRandom(buildings, 1, 1)

    return picked.map((x) => x.location)
  }
}

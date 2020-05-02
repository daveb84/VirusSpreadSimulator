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
import { createRoutineItems } from '../behaviors/travelRoutineItems'

export class World {
  private buildingPopulation: BuildingPopulation
  private regions: GridRegion[]

  constructor(
    private scene: Scene,
    private walkers: Walker[],
    private processor: WalkerProcessor
  ) {
    this.buildingPopulation = new BuildingPopulation(
      scene,
      regions.buildingGrid
    )

    this.regions = regions.buildingGrid.getRegions(
      populationConfig.gridRegion.rows,
      populationConfig.gridRegion.columns
    )

    this.populate()
  }

  private populate() {
    this.regions.forEach((region, index) => {
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

      for (let i = 0; i < populationConfig.homes; i++) {
        const numberWalkers = generateNumber(
          populationConfig.walkersPerHome[0],
          populationConfig.walkersPerHome[1],
          true
        )

        // if(index !== 0) {
        //   break;
        // }

        this.addWalkersInNewHome(numberWalkers, region)
      }
    })
  }

  addWalkersInNewHome(walkers: number, region?: GridRegion) {
    region = region || pickRandom(this.regions, 1, 1)[0]

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
      populationConfig.homeRegion.rows,
      populationConfig.homeRegion.columns
    )

    const homeShops = this.pickBuildingForRegion(
      BuildingType.Shop,
      populationConfig.shopsPerWalker,
      homeRegion
    )

    const homeEntertainment = this.pickBuildingForRegion(
      BuildingType.Entertainment,
      populationConfig.entertainmentsPerWalker,
      homeRegion
    )

    const work = this.pickBuildingForRegion(
      BuildingType.Work,
      populationConfig.worksPerWalker,
      homeRegion
    )

    const workShops: GridRegion[] = []
    const workEntertainment: GridRegion[] = []

    work.forEach((workLocation) => {
      const workRegion = regions.buildingGrid.getRegionByRadius(
        workLocation.cells[0],
        populationConfig.workRegion.rows,
        populationConfig.workRegion.columns
      )

      this.pickBuildingForRegion(
        BuildingType.Shop,
        populationConfig.worksShopsPerWalker,
        workRegion,
        workShops
      ).forEach((x) => workShops.push(x))

      this.pickBuildingForRegion(
        BuildingType.Entertainment,
        populationConfig.worksEntertainmentPerWalker,
        workRegion,
        workEntertainment
      ).forEach((x) => workEntertainment.push(x))
    })

    const getProcessStep = () => this.processor.getProcessStep()

    const routineItems = createRoutineItems({
      home: home.location,
      work: work,
      homeShops,
      homeEntertainment,
      workShops,
      workEntertainment,
    })

    const travelMoves = new RoutineMoveFactory(
      getProcessStep,
      home.location,
      routineItems
    )

    return new Walker(this.scene, home.location, getProcessStep, travelMoves)
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
    except?: GridRegion[],
    collection?: PlacedBuilding[]
  ) {
    const buildings = (
      collection || this.buildingPopulation.placedBuildings
    ).filter((x) => {
      if (x.building.type !== type) {
        return false
      }

      if (except && except.includes(x.location)) {
        return false
      }

      return true
    })

    const forRegion = buildings.filter((x) =>
      region.containsPosition(x.location.midPoint)
    )

    const picked = forRegion.length
      ? pickRandom(forRegion, range[0], range[1])
      : pickRandom(buildings, 1, 1)

    return picked.map((x) => x.location)
  }
}

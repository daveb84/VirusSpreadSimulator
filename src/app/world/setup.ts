import { createPopulationConfig } from './population'
import { BuildingPopulation, PlacedBuilding } from './buildings'
import { regions } from '../settings'
import { Scene } from '@babylonjs/core'
import { Walker } from './walker'
import { IRoutineTargets } from '../behaviors'
import { WalkerProcessor } from './processor'
import { IWalkerBuildings } from './types'

export const populateWalkers = (
  scene: Scene,
  walkers: Walker[],
  processor: WalkerProcessor
) => {
  const getCurrentStep = () => processor.getProcessorStep()
  const config = createPopulationConfig()

  const buildingConfigs = config.buildingWalkers.map((x) => x.building)
  const population = new BuildingPopulation(
    scene,
    regions.buildingGrid,
    buildingConfigs
  )

  population.populate()

  config.walkerBuildings.forEach((walker) => {
    const targets = getRoutineTargets(walker, population.placedBuildings)

    if (targets.length) {
      const walkerMesh = new Walker(scene, getCurrentStep, targets)

      walkers.push(walkerMesh)
    }
  })
}

const getRoutineTargets = (
  walker: IWalkerBuildings,
  buildings: PlacedBuilding[]
) => {
  const targets: IRoutineTargets[] = []

  walker.buildings.forEach((walkerBuilding) => {
    const moveLocation = buildings[walkerBuilding.building].location

    if (moveLocation) {
      const move: IRoutineTargets = {
        target: moveLocation,
        fromStep: walkerBuilding.fromStep,
        toStep: walkerBuilding.toStep,
      }

      targets.push(move)
    }
  })

  return targets
}

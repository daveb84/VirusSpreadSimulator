import { Walker } from './walker'
import { IObstacle } from '../behaviors'
import { Scene, Observer } from '@babylonjs/core'
import { travelConfig, regions } from '../settings'
import {
  onProcessNextHour,
  onProcessCycleBegin,
  IProcessStep,
  onProcessCycleComplete,
} from '../appEvents'
import { GridCell } from '../vectors'
import { convertStepToHours } from '../utils'

interface IWalkerPosition {
  walker: Walker
  cell: GridCell
}

export class WalkerProcessor {
  private attachedHandler: Observer<Scene>

  private currentStep: IProcessStep = {
    step: 0,
    hours: 0,
    weekHours: 0,
    weekHoursWhole: 0,
  }

  private stoppedStepId = 0

  constructor(
    private scene: Scene,
    private walkers: Walker[],
    private boundingBox: IObstacle
  ) {}

  start() {
    if (!this.attachedHandler) {
      let first = true
      let startStep = 0
      let startAdjustedStep = 0

      this.attachedHandler = this.scene.onBeforeStepObservable.add((scene) => {
        const stepId = scene.getStepId()
        let adjustedStepId: number

        if (first) {
          startStep = stepId
          startAdjustedStep = this.stoppedStepId
          adjustedStepId = this.stoppedStepId
          first = false
        } else {
          adjustedStepId = startAdjustedStep + stepId - startStep
        }

        this.process(adjustedStepId)
        this.stoppedStepId = adjustedStepId
      })
    }
  }

  stop() {
    if (this.attachedHandler) {
      this.scene.onBeforeStepObservable.remove(this.attachedHandler)
      this.attachedHandler = null
    }
  }

  getProcessStep(): IProcessStep {
    return this.currentStep
  }

  private process(step: number) {
    this.updateStep(step)

    const walkerPositions: IWalkerPosition[] = this.walkers.map((w) => ({
      walker: w,
      cell: regions.infectionGrid.getGridCell(w.mesh.position),
    }))

    this.processBounds(walkerPositions)
    this.processInfection(walkerPositions)

    onProcessCycleComplete.notifyObservers(this.currentStep)
  }

  private updateStep(step: number) {
    const hours = convertStepToHours(step * travelConfig.stepHoursRatio)
    const weekHours = hours % travelConfig.hoursInWeek
    const weekHoursWhole = Math.floor(weekHours)

    const stepChanged = weekHoursWhole > this.currentStep.weekHoursWhole
    this.currentStep = {
      step,
      hours,
      weekHours,
      weekHoursWhole,
    }

    onProcessCycleBegin.notifyObservers(this.currentStep)
    if (stepChanged) {
      onProcessNextHour.notifyObservers(weekHoursWhole)
    }
  }

  private processBounds(walkers: IWalkerPosition[]) {
    walkers
      .filter((x) => !x.cell && x.walker.moving)
      .forEach((x) => {
        x.walker.collideWithObstacle(this.boundingBox)
      })
  }

  private processInfection(walkers: IWalkerPosition[]) {
    const groupByGridCell: any = {}

    walkers
      .filter((x) => x.cell)
      .forEach((x) => {
        groupByGridCell[x.cell.index] = groupByGridCell[x.cell.index] || []

        groupByGridCell[x.cell.index].push(x.walker)
      })

    for (let index in groupByGridCell) {
      const canSpread = groupByGridCell[index].some((x) => x.canSpreadVirus)

      if (canSpread) {
        groupByGridCell[index]
          .filter((x) => x.canCatchVirus)
          .forEach((x) => x.infect())
      }
    }
  }
}

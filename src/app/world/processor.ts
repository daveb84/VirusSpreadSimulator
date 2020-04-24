import { Walker } from './walker'
import { IObstacle } from '../behaviors'
import { Scene, Observer } from '@babylonjs/core'
import { travelConfig, regions } from '../settings'
import { onStep, onProcess } from '../appEvents'
import { GridCell } from '../vectors'

interface IWalkerPosition {
  walker: Walker
  cell: GridCell
}

export class WalkerProcessor {
  private attachedHandler: Observer<Scene>
  private routineStep = 0

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

  getProcessorStep() {
    return this.routineStep
  }

  private process(sceneStepId: number) {
    this.updateStep(sceneStepId)

    const walkerPositions: IWalkerPosition[] = this.walkers.map((w) => ({
      walker: w,
      cell: regions.infectionGrid.getGridCell(w.mesh.position),
    }))

    this.processBounds(walkerPositions)

    this.processInfection(walkerPositions)
  }

  private updateStep(sceneStepId: number) {
    const timeUnit = Math.floor(sceneStepId * travelConfig.processorStepRatio)
    const step = timeUnit % (travelConfig.timeSlots + 1)

    const stepChanged = step > this.routineStep
    this.routineStep = step

    onProcess.notifyObservers({ sceneStepId: sceneStepId, step: step })
    if (stepChanged) {
      onStep.notifyObservers(step)
    }
  }

  private processBounds(walkers: IWalkerPosition[]) {
    walkers
      .filter((x) => !x.cell)
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

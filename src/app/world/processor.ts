import { Walker } from './walker'
import { IObstacle } from '../behaviors'
import { Scene, Observer } from '@babylonjs/core'
import { travelConfig } from '../settings'
import { onStep, onProcess } from '../appEvents'

const obstacleCollide = (walker: Walker, obstacle: IObstacle) => {
  if (walker.moving) {
    const collide = obstacle.mesh.intersectsMesh(walker.mesh, true)

    if (collide) {
      walker.collideWithObstacle(obstacle)

      return true
    }
  }

  return false
}

const walkerCollide = (walker: Walker, other: Walker) => {
  if (!walker.contagious && !other.contagious) {
    return
  }

  const collide = other.mesh.intersectsMesh(walker.mesh, true)

  if (collide) {
    if (!walker.contagious) {
      walker.infect()
    }

    if (!other.contagious) {
      other.infect()
    }
  }
}

const boundingBoxCollide = (walker: Walker, obstacle: IObstacle) => {
  if (walker.moving) {
    const collide = obstacle.mesh.intersectsMesh(walker.mesh, true)

    if (!collide) {
      walker.collideWithObstacle(obstacle)

      return true
    }
  }
}

export class WalkerProcessor {
  private attachedHandler: Observer<Scene>
  private routineStep = 0

  private stoppedStepId = 0

  constructor(
    private scene: Scene,
    private walkers: Walker[],
    private boundingBox: IObstacle,
    private obstacles: IObstacle[] = []
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
    const timeUnit = Math.floor(sceneStepId * travelConfig.processorStepRatio)
    const step = timeUnit % (travelConfig.timeSlots + 1)

    const stepChanged = step > this.routineStep
    this.routineStep = step

    onProcess.notifyObservers({ sceneStepId: sceneStepId, step: step })
    if (stepChanged) {
      onStep.notifyObservers(step)
    }

    const { walkers, boundingBox, obstacles } = this

    const toCheck = [...walkers]
    toCheck.shift()

    walkers.forEach((walker) => {
      if (boundingBox) {
        boundingBoxCollide(walker, boundingBox)
      }

      obstacles.forEach((obstacle) => {
        obstacleCollide(walker, obstacle)
      })

      toCheck.forEach((other) => {
        walkerCollide(walker, other)
      })

      toCheck.shift()
    })
  }
}

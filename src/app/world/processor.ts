import { Walker } from './walker'
import { IObstacle } from '../behaviors'
import { Scene, Observer } from '@babylonjs/core'

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

  constructor(
    private scene: Scene,
    private walkers: Walker[],
    private boundingBox: IObstacle,
    private obstacles: IObstacle[] = []
  ) {}

  start() {
    if (!this.attachedHandler) {
      this.attachedHandler = this.scene.onBeforeStepObservable.add((scene) => {
        this.process(scene.getStepId())
      })
    }
  }

  stop() {
    if (this.attachedHandler) {
      this.scene.onBeforeStepObservable.remove(this.attachedHandler)
      this.attachedHandler = null
    }
  }

  private process(stepId: number) {
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

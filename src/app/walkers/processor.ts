import { Walker } from './walker'
import { IObstacle } from '../behaviors'

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

export const processWalkers = (
  walkers: Walker[],
  obstacles: IObstacle[] = [],
  boundingBox: IObstacle = null
) => {
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

import { Crawler } from '../meshes/crawler/crawler'
import { IObstacle } from './types'

const obstacleCollide = (crawler: Crawler, obstacle: IObstacle) => {
  if (crawler.moving) {
    const collide = obstacle.mesh.intersectsMesh(crawler.mesh, true)

    if (collide) {
      crawler.collideWithObstacle(obstacle)

      return true
    }
  }

  return false
}

const crawlerCollide = (crawler: Crawler, other: Crawler) => {
  if (!crawler.contagious && !other.contagious) {
    return
  }

  const collide = other.mesh.intersectsMesh(crawler.mesh, true)

  if (collide) {
    if (!crawler.contagious) {
      crawler.infect()
    }

    if (!other.contagious) {
      other.infect()
    }
  }
}

const boundingBoxCollide = (crawler: Crawler, obstacle: IObstacle) => {
  if (crawler.moving) {
    const collide = obstacle.mesh.intersectsMesh(crawler.mesh, true)

    if (!collide) {
      crawler.collideWithObstacle(obstacle)

      return true
    }
  }
}

export const processCollisions = (
  crawlers: Crawler[],
  obstacles: IObstacle[] = [],
  boundingBox: IObstacle = null
) => {
  const checkCrawlers = [...crawlers]
  checkCrawlers.shift()

  crawlers.forEach((crawler) => {
    if (boundingBox) {
      boundingBoxCollide(crawler, boundingBox)
    }

    obstacles.forEach((obstacle) => {
      obstacleCollide(crawler, obstacle)
    })

    checkCrawlers.forEach((other) => {
      crawlerCollide(crawler, other)
    })

    checkCrawlers.shift()
  })
}

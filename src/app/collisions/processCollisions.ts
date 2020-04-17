import { Crawler } from '../meshes/crawler/crawler'
import { IObstacle } from './types'

const obstacleCollide = (crawler: Crawler, obstacle: IObstacle) => {
  if (crawler.moving) {
    const collide = obstacle.mesh.intersectsMesh(crawler.mesh, true)

    if (collide) {
      crawler.collideWithObstacle(obstacle)
    }
  }
}

const crawlerCollide = (crawler: Crawler, other: Crawler) => {
  if (!crawler.infected && !other.infected) {
    return
  }

  const collide = other.mesh.intersectsMesh(crawler.mesh, true)

  if (collide) {
    if (!crawler.infected) {
      crawler.infect()
    }

    if (!other.infected) {
      other.infect()
    }
  }
}

export const processCollisions = (
  crawlers: Crawler[],
  obstacles: IObstacle[]
) => {
  const checkCrawlers = [...crawlers]
  checkCrawlers.shift()

  crawlers.forEach((crawler) => {
    obstacles.forEach((obstacle) => {
      obstacleCollide(crawler, obstacle)

      checkCrawlers.forEach((other) => {
        crawlerCollide(crawler, other)
      })

      checkCrawlers.shift()
    })
  })
}

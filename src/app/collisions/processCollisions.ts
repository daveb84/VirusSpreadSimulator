import { Crawler } from '../meshes/crawler/crawler'
import { IObstacle } from './obstacle'

export const processCollisions = (
  crawlers: Crawler[],
  obstacles: IObstacle[]
) => {
  obstacles.forEach((obstacle) => {
    crawlers.forEach((crawler) => {
      if (crawler.moving) {
        const colide = obstacle.mesh.intersectsMesh(crawler.mesh, true)

        if (colide) {
          crawler.collideWithObstacle(obstacle)
        }
      }
    })
  })
}

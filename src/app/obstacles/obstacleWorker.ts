import { Crawler } from '../meshes/crawler/crawler'
import { IObstacle } from './obstacle'

export const createCrawlerWorker = (
  crawlers: Crawler[],
  obstacles: IObstacle[]
) => {
  obstacles.forEach((obstacle) => {
    crawlers.forEach((crawler) => {
      const colide = crawler.mesh.intersectsMesh(obstacle.mesh, false)

      if (colide) {
        crawler.collideWithObstacle(obstacle)
      }
    })
  })
}

import { AppScene } from './scene'
import { Crawler, crawlerMaterial } from './crawler/crawler'
import { Scene } from '@babylonjs/core'

export const createApp = (canvas: HTMLCanvasElement) => {
  const scene = new AppScene(canvas)

  const crawlers = createCrawlers(scene.scene, 200)

  scene.start()

  return {
    start: () => {
      crawlers.forEach((c) => c.start())
    },
    stop: () => {
      crawlers.forEach((c) => c.stop())
    },
  }
}

const createCrawlers = (scene: Scene, quantity: number) => {
  const crawlers: Crawler[] = []
  const material = crawlerMaterial(scene)

  for (let i = 0; i < quantity; i++) {
    crawlers.push(new Crawler(scene, material))
  }

  return crawlers
}

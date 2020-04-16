import { AppScene } from './scene'
import { Crawler, getCrawlerSettings, Stage } from './meshes'
import { Scene } from '@babylonjs/core'

export const createApp = (canvas: HTMLCanvasElement) => {
  const scene = new AppScene(canvas)

  const stage = new Stage(scene.scene)
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
  const settings = getCrawlerSettings(scene)

  for (let i = 0; i < quantity; i++) {
    crawlers.push(new Crawler(scene, settings))
  }

  return crawlers
}

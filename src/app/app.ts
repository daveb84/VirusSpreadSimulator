import {
  Crawler,
  getCrawlerSettings,
  Stage,
  createScene,
  ICrawlerSettings,
} from './meshes'
import { Scene, Engine } from '@babylonjs/core'
import { processCollisions } from './collisions/processCollisions'

export const createApp = (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas)
  const scene = createScene(engine, canvas)
  const settings = getCrawlerSettings(scene)

  const stage = new Stage(scene)
  const crawlers = createCrawlers(scene, settings, 200)

  scene.registerBeforeRender(() => {
    processCollisions(crawlers, stage.walls)
  })

  engine.runRenderLoop(() => {
    scene.render()
  })

  return {
    start: () => {
      crawlers.forEach((c) => c.start())
    },
    stop: () => {
      crawlers.forEach((c) => c.stop())
    },
    add: (amount: number, infected: boolean) => {
      const newCrawlers = createCrawlers(scene, settings, amount, infected)
      crawlers.push(...newCrawlers)
    },
  }
}

const createCrawlers = (
  scene: Scene,
  settings: ICrawlerSettings,
  quantity: number,
  infected: boolean = false
) => {
  const crawlers: Crawler[] = []

  for (let i = 0; i < quantity; i++) {
    const crawler = new Crawler(scene, settings)

    if (infected) {
      crawler.infect()
    }

    crawlers.push(crawler)
  }

  return crawlers
}

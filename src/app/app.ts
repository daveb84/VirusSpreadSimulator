import { Crawler, getCrawlerSettings, Stage, createScene } from './meshes'
import { Scene, Engine } from '@babylonjs/core'
import { processCollisions } from './collisions/processCollisions'

export const createApp = (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas)
  const scene = createScene(engine, canvas)

  const stage = new Stage(scene)
  const crawlers = createCrawlers(scene, 200)

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

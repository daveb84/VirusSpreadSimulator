import {
  Crawler,
  getCrawlerSettings,
  Stage,
  createScene,
  ICrawlerSettings,
} from './meshes'
import { Scene, Engine, PickingInfo } from '@babylonjs/core'
import { processCollisions } from './collisions/processCollisions'
import { initTrace, showOnlyTracesForOwner } from '../utils/trace'

const initApp = (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas)
  const scene = createScene(engine, canvas)

  initTrace(scene)

  const settings = getCrawlerSettings(scene)

  const stage = new Stage(scene)
  const crawlers = createCrawlers(scene, settings, 200)

  scene.onPointerUp = (evt, pickResult) => {
    clickCrawler(pickResult, crawlers)
  }

  scene.registerBeforeRender(() => {
    processCollisions(crawlers, stage.walls)
  })

  engine.runRenderLoop(() => {
    scene.render()
  })

  return { engine, crawlers, scene, settings }
}

export const createApp = (canvas: HTMLCanvasElement) => {
  let app = initApp(canvas)

  return {
    start: () => {
      app.crawlers.forEach((c) => c.start())
    },
    stop: () => {
      app.crawlers.forEach((c) => c.stop())
    },
    add: (amount: number, infected: boolean) => {
      const newCrawlers = createCrawlers(
        app.scene,
        app.settings,
        amount,
        infected
      )
      app.crawlers.push(...newCrawlers)
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

const clickCrawler = (pick: PickingInfo, crawlers: Crawler[]) => {
  if (pick.hit) {
    const match = crawlers.find((x) => x.mesh === pick.pickedMesh)

    if (match) {
      showOnlyTracesForOwner(match.mesh)
    }
  }
}

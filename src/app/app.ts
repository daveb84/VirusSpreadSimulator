import { Stage, createScene } from './meshes'
import { initMaterials } from './materials'
import { Scene, Engine, PickingInfo, CannonJSPlugin } from '@babylonjs/core'
import { Walker, WalkerProcessor, populateWalkers } from './world'
import {
  initTrace,
  showOnlyTraceMovesForOwner,
  traceMoves,
} from './utils/trace'
import { travelConfig, regions } from './settings'
import * as cannon from 'cannon'
import { onWalkerNotFound } from './appEvents'

class App {
  private readonly engine: Engine
  private readonly scene: Scene

  private readonly walkers: Walker[]
  private processor: WalkerProcessor

  private moving: boolean = false

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, false, {
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    })
    this.scene = createScene(this.engine, canvas)
    this.scene.enablePhysics(null, new CannonJSPlugin(false, 10, cannon))
    this.scene.getPhysicsEngine().setTimeStep(travelConfig.timeStep)

    initMaterials(this.scene)
    initTrace(this.scene)

    const stage = new Stage(this.scene)
    this.walkers = []
    this.processor = new WalkerProcessor(
      this.scene,
      this.walkers,
      stage.bounds,
      regions.walkerGraveYard
    )

    populateWalkers(this.scene, this.walkers, this.processor)

    this.scene.onPointerUp = (evt, pickResult) => {
      this.clickWalker(pickResult)
    }

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  start() {
    this.processor.start()

    this.moving = true
    this.walkers.forEach((c) => c.start())
  }

  stop() {
    this.processor.stop()

    this.moving = false
    this.walkers.forEach((w) => w.stop())
  }

  add(amount: number, infected: boolean) {
    const newWalkers = this.createWalkers(amount, infected)
    this.walkers.push(...newWalkers)

    if (this.moving) {
      newWalkers.forEach((c) => c.start())
    }
  }

  moveWalker(walkerIndex: number, moveIndex: number, start: boolean) {
    const walker = this.findWalker(walkerIndex)
    if (!walker) {
      return
    }

    const moves = traceMoves.filter((x) => x.owner === walker.mesh)

    if (moveIndex < 0 || moveIndex >= moves.length) {
      return
    }

    const matching = moves[moveIndex]
    walker.setPosition(matching.from)

    if (start) {
      walker.start()
    }
  }

  private findWalker(walkerIndex: number, publishNotFound = true) {
    if (walkerIndex < 0 || walkerIndex >= this.walkers.length) {
      if (publishNotFound) {
        onWalkerNotFound.notifyObservers(walkerIndex)
      }
      return null
    }

    const walker = this.walkers[walkerIndex]
    return walker
  }

  private createWalkers(quantity: number, infected: boolean = false) {
    const walkers: Walker[] = []

    for (let i = 0; i < quantity; i++) {
      const walker = new Walker(this.scene, () =>
        this.processor.getProcessStep()
      )

      if (infected) {
        walker.infect()
      }

      walkers.push(walker)
    }

    return walkers
  }

  private clickWalker(pick: PickingInfo) {
    if (pick.hit) {
      const match = this.walkers.find((x) => x.mesh === pick.pickedMesh)

      if (match) {
        match.infect()
      }

      return match
    }
  }

  public showTraces(walkerIndex: number) {
    const walker = this.findWalker(walkerIndex)
    if (!walker) {
      return
    }

    showOnlyTraceMovesForOwner(walker.mesh)
  }
}

export const createApp = (canvas: HTMLCanvasElement) => {
  const app = new App(canvas)

  if (travelConfig.autoStart) {
    app.start()
  }

  return app
}

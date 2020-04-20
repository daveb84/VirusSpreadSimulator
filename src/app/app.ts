import { Stage, createScene } from './meshes'
import { initMaterials } from './materials'
import { Scene, Engine, PickingInfo } from '@babylonjs/core'
import { processWalkers, Walker } from './walkers'
import {
  initTrace,
  showOnlyTraceMovesForOwner,
  traceMoves,
} from './utils/trace'
import { walkerMovement } from './settings'
import { placeBuildings } from './buildings'

class App {
  private readonly engine: Engine
  private readonly scene: Scene

  private readonly walkers: Walker[]

  private selected: Walker = null
  private selectedMove: number = 0

  private moving: boolean = false

  constructor(
    canvas: HTMLCanvasElement,
    private debug: (message: string) => void
  ) {
    this.engine = new Engine(canvas)
    this.scene = createScene(this.engine, canvas)

    initMaterials(this.scene)
    initTrace(this.scene)
    placeBuildings(this.scene)

    const stage = new Stage(this.scene)
    this.walkers = this.createWalkers(0)

    this.scene.onPointerUp = (evt, pickResult) => {
      this.selected = this.clickWalker(pickResult)
    }

    this.scene.registerBeforeRender(() => {
      if (this.moving) {
        processWalkers(this.walkers, [], stage.bounds)
      }
    })

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  start() {
    if (this.selected) {
      this.selected.start()
    } else {
      this.moving = true
      this.walkers.forEach((c) => c.start())
    }
  }

  stop() {
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

  moveBack(index: number) {
    if (this.tryMoveBack(index)) {
      this.selectedMove = index
    }
  }

  replayMove(index: number) {
    if (this.tryMoveBack(index)) {
      const moves = traceMoves.filter((x) => x.owner === this.selected.mesh)

      if (index < moves.length) {
        const matching = moves[index]

        if (this.selectedMove !== index) {
          this.selected.setPosition(matching.from)
        }

        this.selected.move(matching.direction)
      }
    }
  }

  private createWalkers(quantity: number, infected: boolean = false) {
    const walkers: Walker[] = []

    for (let i = 0; i < quantity; i++) {
      const walker = new Walker(this.scene)

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
        const moves = traceMoves.filter((x) => x.owner === match.mesh)
        this.debug('Moves: ' + moves.length)
        showOnlyTraceMovesForOwner(match.mesh)
      }

      return match
    }
  }

  private tryMoveBack(index: number) {
    if (this.selected) {
      const moves = traceMoves.filter((x) => x.owner === this.selected.mesh)

      if (index < moves.length) {
        const matching = moves[index]

        this.selected.setPosition(matching.from)

        return true
      } else {
        alert('Move cannot be found')
      }
    } else {
      alert('Nothing selected')
    }
    return false
  }
}

export const createApp = (
  canvas: HTMLCanvasElement,
  debug: (message: string) => void
) => {
  const app = new App(canvas, debug)

  if (walkerMovement.autoStart) {
    app.start()
  }

  return app
}

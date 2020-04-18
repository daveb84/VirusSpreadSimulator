import { Stage, createScene, StageArea } from './meshes'
import { initMaterials } from './materials'
import { Scene, Engine, PickingInfo } from '@babylonjs/core'
import { processCollisions } from './collisions/processCollisions'
import {
  initTrace,
  showOnlyTraceMovesForOwner,
  traceMoves,
} from '../utils/trace'
import { walkerMovement } from './settings'
import { Walker } from './walker'

export const createApp = (
  canvas: HTMLCanvasElement,
  debug: (message: string) => void
) => {
  const engine = new Engine(canvas)
  const scene = createScene(engine, canvas)

  initMaterials(scene)
  initTrace(scene)

  new Stage(scene)
  const stageArea = new StageArea(scene)
  const walkers = createWalkers(scene, 200)

  let moving = false
  let selected: Walker = null
  let selectedMove: number = 0

  scene.onPointerUp = (evt, pickResult) => {
    selected = clickWalker(pickResult, walkers, debug)
  }

  scene.registerBeforeRender(() => {
    processCollisions(walkers, [], stageArea)
  })

  engine.runRenderLoop(() => {
    scene.render()
  })

  const app = {
    start: () => {
      if (selected) {
        selected.start()
      } else {
        moving = true
        walkers.forEach((c) => c.start())
      }
    },
    stop: () => {
      moving = false
      walkers.forEach((c) => c.stop())
    },
    add: (amount: number, infected: boolean) => {
      const newWalkers = createWalkers(scene, amount, infected)
      walkers.push(...newWalkers)

      if (moving) {
        newWalkers.forEach((c) => c.start())
      }
    },
    moveBack: (index: number) => {
      if (moveBack(selected, index)) {
        selectedMove = index
      }
    },
    replayMove: (index: number) => {
      if (moveBack(selected, index)) {
        const moves = traceMoves.filter((x) => x.owner === selected.mesh)

        if (index < moves.length) {
          const matching = moves[index]

          if (selectedMove !== index) {
            selected.setPosition(matching.from)
          }

          selected.move(matching.direction)
        }
      }
    },
  }

  if (walkerMovement.autoStart) {
    app.start()
  }

  return app
}

const createWalkers = (
  scene: Scene,
  quantity: number,
  infected: boolean = false
) => {
  const walkers: Walker[] = []

  for (let i = 0; i < quantity; i++) {
    const walker = new Walker(scene)

    if (infected) {
      walker.infect()
    }

    walkers.push(walker)
  }

  return walkers
}

const clickWalker = (
  pick: PickingInfo,
  walkers: Walker[],
  debug: (message: string) => void
) => {
  if (pick.hit) {
    const match = walkers.find((x) => x.mesh === pick.pickedMesh)

    if (match) {
      const moves = traceMoves.filter((x) => x.owner === match.mesh)
      debug('Moves: ' + moves.length)
      showOnlyTraceMovesForOwner(match.mesh)
    }

    return match
  }
}

const moveBack = (selected: Walker, index: number) => {
  if (selected) {
    const moves = traceMoves.filter((x) => x.owner === selected.mesh)

    if (index < moves.length) {
      const matching = moves[index]

      selected.setPosition(matching.from)

      return true
    } else {
      alert('Move cannot be found')
    }
  } else {
    alert('Nothing selected')
  }
  return false
}

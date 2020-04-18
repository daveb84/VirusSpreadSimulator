import { Person, Stage, createScene, StageArea, initMaterials } from './meshes'
import { Scene, Engine, PickingInfo } from '@babylonjs/core'
import { processCollisions } from './collisions/processCollisions'
import {
  initTrace,
  showOnlyTraceMovesForOwner,
  traceMoves,
} from '../utils/trace'
import { crawlerMovement } from './settings'

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
  const people = createCrawlers(scene, 200)

  let moving = false
  let selected: Person = null
  let selectedMove: number = 0

  scene.onPointerUp = (evt, pickResult) => {
    selected = clickCrawler(pickResult, people, debug)
  }

  scene.registerBeforeRender(() => {
    processCollisions(people, [], stageArea)
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
        people.forEach((c) => c.start())
      }
    },
    stop: () => {
      moving = false
      people.forEach((c) => c.stop())
    },
    add: (amount: number, infected: boolean) => {
      const newCrawlers = createCrawlers(scene, amount, infected)
      people.push(...newCrawlers)

      if (moving) {
        newCrawlers.forEach((c) => c.start())
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

  if (crawlerMovement.autoStart) {
    app.start()
  }

  return app
}

const createCrawlers = (
  scene: Scene,
  quantity: number,
  infected: boolean = false
) => {
  const people: Person[] = []

  for (let i = 0; i < quantity; i++) {
    const person = new Person(scene)

    if (infected) {
      person.infect()
    }

    people.push(person)
  }

  return people
}

const clickCrawler = (
  pick: PickingInfo,
  crawlers: Person[],
  debug: (message: string) => void
) => {
  if (pick.hit) {
    const match = crawlers.find((x) => x.mesh === pick.pickedMesh)

    if (match) {
      const moves = traceMoves.filter((x) => x.owner === match.mesh)
      debug('Moves: ' + moves.length)
      showOnlyTraceMovesForOwner(match.mesh)
    }

    return match
  }
}

const moveBack = (selected: Person, index: number) => {
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

import { Person } from '../meshes'
import {
  Virus,
  CollidingTravel,
  IObstacle,
  RandomMoveFactory,
  IRoutineTargets,
  RoutineMoveFactory,
} from '../behaviors'
import { Scene, Vector3 } from '@babylonjs/core'
import { travelConfig, regions } from '../settings'

export class Walker {
  private person: Person
  private virus: Virus
  private travel: CollidingTravel

  constructor(
    private scene: Scene,
    getProcessorStep: () => number,
    routineTargets?: IRoutineTargets[]
  ) {
    this.person = new Person(scene)
    this.virus = new Virus(this.person.mesh)

    if (routineTargets && routineTargets.length) {
      const travelMoves = new RoutineMoveFactory(
        routineTargets,
        getProcessorStep
      )
      this.travel = new CollidingTravel(this.person.mesh, travelMoves)
    } else {
      const travelMoves = new RandomMoveFactory()
      this.travel = new CollidingTravel(this.person.mesh, travelMoves)
    }

    const startPosition = regions.walker.getRandomPoint()
    this.setPosition(startPosition)
  }

  public get moving() {
    return this.travel.moving
  }

  public get contagious() {
    return this.virus.contagious
  }

  public get mesh() {
    return this.person.mesh
  }

  start() {
    this.travel.start()
  }

  stop() {
    this.travel.stop()
  }

  infect() {
    this.virus.infect()
  }

  setPosition(position: Vector3) {
    this.mesh.position = position
  }

  move(target: Vector3) {
    this.travel.move(target)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.travel.collide(obstacle, travelConfig.distance)
  }
}

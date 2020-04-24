import { Person } from '../meshes'
import {
  Virus,
  CollidingTravel,
  IObstacle,
  RandomMoveFactory,
  IRoutineTargets,
  RoutineMoveFactory,
  Isolate,
  Death,
} from '../behaviors'
import { Scene, Vector3 } from '@babylonjs/core'
import { travelConfig, regions } from '../settings'
import { FlatRegion } from '../vectors'
import { IProcessStep } from '../appEvents'

export class Walker {
  private person: Person
  private virus: Virus
  private travel: CollidingTravel
  private isolate: Isolate
  private death: Death
  private home: FlatRegion

  constructor(
    scene: Scene,
    getProcessStep: () => IProcessStep,
    routineTargets?: IRoutineTargets[]
  ) {
    this.person = new Person(scene)

    if (routineTargets && routineTargets.length) {
      const travelMoves = new RoutineMoveFactory(routineTargets, getProcessStep)
      this.travel = new CollidingTravel(this.person.mesh, travelMoves)

      const home = routineTargets.find((x) => x.home)
      this.home = home && home.target
    } else {
      const travelMoves = new RandomMoveFactory()
      this.travel = new CollidingTravel(this.person.mesh, travelMoves)
    }

    this.isolate = new Isolate(this.person.mesh, this.travel, this.home)
    this.death = new Death(this.person.mesh, this.travel)
    this.virus = new Virus(
      this.person.mesh,
      getProcessStep,
      (isolate) => this.isolate.setIsolation(isolate),
      () => this.death.die()
    )

    const startPosition = regions.walker.getRandomPoint()
    this.setPosition(startPosition)
  }

  public get moving() {
    return this.travel.moving
  }

  public get canSpreadVirus() {
    return this.virus.canSpread
  }

  public get canCatchVirus() {
    return this.virus.canCatch
  }

  public get virusState() {
    return this.virus.state
  }

  public get mesh() {
    return this.person.mesh
  }

  start() {
    if (!this.isolate.isolating && !this.death.dead) {
      this.travel.start()
    }
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

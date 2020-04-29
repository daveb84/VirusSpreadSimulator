import { Person } from '../meshes'
import {
  Virus,
  CollidingTravel,
  IObstacle,
  ITravelMoveFactory,
} from '../behaviors'
import { Scene, Vector3 } from '@babylonjs/core'
import { travelConfig, regions } from '../settings'
import { FlatRegion } from '../vectors'
import { IProcessStep } from '../appEvents'

export class Walker {
  private person: Person
  private virus: Virus
  private travel: CollidingTravel

  constructor(
    scene: Scene,
    private home: FlatRegion,
    getProcessStep: () => IProcessStep,
    travelMoves: ITravelMoveFactory
  ) {
    this.person = new Person(scene)

    this.travel = new CollidingTravel(this.person.mesh, travelMoves)

    this.virus = new Virus(
      this.person.mesh,
      getProcessStep,
      this.travel,
      this.home
    )

    const startPosition = this.home
      ? this.home.getRandomPoint()
      : regions.walker.getRandomPoint()
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
    if (!this.virus.isIsolating && !this.virus.isDead) {
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

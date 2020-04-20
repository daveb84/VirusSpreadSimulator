import { Person } from '../meshes'
import {
  Virus,
  CollidingTravel,
  IObstacle,
  Travel,
  RandomMoveFactory,
} from '../behaviors'
import { Scene, Vector3 } from '@babylonjs/core'
import { walkerMovement, regions } from '../settings'

export class Walker {
  private person: Person
  private virus: Virus
  private travel: CollidingTravel
  private travelMoves: RandomMoveFactory

  constructor(private scene: Scene) {
    this.person = new Person(scene)
    this.virus = new Virus(this.person.mesh)
    this.travelMoves = new RandomMoveFactory()
    this.travel = new CollidingTravel(this.person.mesh, this.travelMoves)

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

  move(direction: Vector3) {
    this.travel.move(direction)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.travel.collide(obstacle, walkerMovement.distance)
  }
}

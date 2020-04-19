import { Person } from './meshes'
import { Virus, CollidingRandomWalk, IObstacle } from './behaviors'
import { Scene, Vector3 } from '@babylonjs/core'
import { walkerMovement, regions } from './settings'

export class Walker {
  private person: Person
  private virus: Virus
  private collidingWalk: CollidingRandomWalk

  constructor(private scene: Scene) {
    this.person = new Person(scene)
    this.virus = new Virus(this.person.mesh)
    this.collidingWalk = new CollidingRandomWalk(this.person.mesh)

    const startPosition = regions.walker.getRandomPoint()
    this.setPosition(startPosition)
  }

  public get moving() {
    return this.collidingWalk.moving
  }

  public get contagious() {
    return this.virus.contagious
  }

  public get mesh() {
    return this.person.mesh
  }

  start() {
    this.collidingWalk.start()
  }

  stop() {
    this.collidingWalk.stop()
  }

  infect() {
    this.virus.infect()
  }

  setPosition(position: Vector3) {
    this.mesh.position = position
  }

  move(direction: Vector3) {
    this.collidingWalk.move(direction)
  }

  collideWithObstacle(obstacle: IObstacle) {
    this.collidingWalk.collide(obstacle, walkerMovement.distance)
  }
}

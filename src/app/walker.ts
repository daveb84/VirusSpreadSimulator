import { Person } from './meshes'
import { Virus } from './behaviors/virus'
import { CollidingRandomWalk } from './behaviors/randomWalk'
import { Scene, Vector3 } from '@babylonjs/core'
import { IObstacle } from './collisions'

export class Walker {
  private person: Person
  private virus: Virus
  private collidingWalk: CollidingRandomWalk

  constructor(private scene: Scene) {
    this.person = new Person(scene)
    this.virus = new Virus(this.person.mesh)
    this.collidingWalk = new CollidingRandomWalk(this.person.mesh)
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
    this.collidingWalk.collide(obstacle)
  }
}

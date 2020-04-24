import { Mesh } from '@babylonjs/core'
import { Travel } from './travel'
import { regions } from '../settings'

export class Death {
  private _dead: boolean = false

  public get dead() {
    return this._dead
  }

  constructor(private mesh: Mesh, private travel: Travel) {}

  die() {
    this.travel.stop()
    this._dead = true
    this.mesh.position = regions.walkerGraveYard.getRandomPoint()
    this.mesh.rotation.z = Math.PI / 2
  }
}

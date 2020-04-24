import { Mesh } from '@babylonjs/core'
import { FlatRegion } from '../vectors'
import { Travel } from './travel'

export class Isolate {
  private _isolating: boolean = false

  public get isolating() {
    return this._isolating
  }

  constructor(
    private mesh: Mesh,
    private travel: Travel,
    private home?: FlatRegion
  ) {}

  setIsolation(isolate: boolean) {
    this._isolating = isolate

    if (isolate) {
      this.travel.stop()

      if (this.home) {
        this.mesh.position = this.home.getRandomPoint()
      }

      this.mesh.rotation.z = Math.PI / 2
    } else {
      this.mesh.rotation.z = 0
      this.travel.start()
    }
  }
}

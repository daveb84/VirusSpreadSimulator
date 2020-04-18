import { Vector3, Mesh } from '@babylonjs/core'
import { IObstacle } from '../behaviors'
import { centerRegion, moveTowardPointInRegion } from '../vectors/region'

export class Wall implements IObstacle {
  constructor(public readonly mesh: Mesh) {}

  getDeflectDirection(currentPosition: Vector3, currentDirection: Vector3) {
    return moveTowardPointInRegion(
      centerRegion,
      currentPosition,
      currentDirection
    )
  }
}

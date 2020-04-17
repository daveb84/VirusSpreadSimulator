import { Vector3, Mesh } from '@babylonjs/core'
import { IObstacle } from '../collisions/types'
import { deflectToCenter } from '../collisions/deflections'

export class Wall implements IObstacle {
  constructor(public readonly mesh: Mesh) {}

  getDeflectDirection(currentPosition: Vector3, currentDirection: Vector3) {
    return deflectToCenter(currentPosition, currentDirection)
  }
}
